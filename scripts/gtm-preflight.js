/* global console, process */
import { existsSync, readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { google } from 'googleapis';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const contractPath = path.resolve(rootDir, 'tracking/ga4-events.contract.json');
const envLocalPath = path.resolve(rootDir, '.env.local');
const envPath = path.resolve(rootDir, '.env');

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;

  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
}

function loadLocalEnv() {
  loadEnvFile(envPath);
  loadEnvFile(envLocalPath);
}

function unique(values) {
  return [...new Set(values)];
}

function variableNameFromPath(parameterPath) {
  return `DLV - ${parameterPath}`;
}

function expectedFromContract(contract) {
  const parameterPaths = contract.events.flatMap((eventConfig) => Object.values(eventConfig.parameters || {}));

  return {
    variables: unique(parameterPaths).map(variableNameFromPath),
    triggers: contract.events.map((eventConfig) => eventConfig.triggerName),
    tags: contract.events.map((eventConfig) => eventConfig.tagName),
  };
}

function missing(expected, existing) {
  const existingSet = new Set(existing);
  return expected.filter((item) => !existingSet.has(item));
}

function printList(items, emptyText = 'none') {
  if (!items.length) {
    console.log(`* ${emptyText}`);
    return;
  }

  for (const item of items) console.log(`* ${item}`);
}

function validateEnv() {
  const required = ['GTM_ACCOUNT_ID', 'GTM_CONTAINER_ID', 'GTM_WORKSPACE_NAME', 'GOOGLE_APPLICATION_CREDENTIALS'];
  const missingEnv = required.filter((key) => !process.env[key]);

  if (missingEnv.length) {
    throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}. Create .env.local from .env.example and configure local credentials.`);
  }

  const credentialsPath = path.resolve(rootDir, process.env.GOOGLE_APPLICATION_CREDENTIALS);
  if (!existsSync(credentialsPath)) {
    throw new Error(`Google credentials file not found: ${credentialsPath}. Set GOOGLE_APPLICATION_CREDENTIALS to a local service account JSON file. Do not commit it.`);
  }

  process.env.GOOGLE_APPLICATION_CREDENTIALS = credentialsPath;
}

async function getTagManagerClient() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/tagmanager.readonly'],
  });
  const authClient = await auth.getClient();
  return google.tagmanager({ version: 'v2', auth: authClient });
}

async function main() {
  loadLocalEnv();
  const contract = JSON.parse(await readFile(contractPath, 'utf8'));
  const expected = expectedFromContract(contract);

  console.log('GTM PREFLIGHT READ-ONLY');
  console.log('');
  console.log('Contract:');
  console.log('');
  console.log(`* Project: ${contract.project}`);
  console.log(`* Container placeholder: ${contract.containerId}`);
  console.log(`* Measurement placeholder: ${contract.measurementId}`);
  console.log(`* Events: ${contract.events.length}`);
  console.log('');

  validateEnv();
  const tagmanager = await getTagManagerClient();

  const accountId = process.env.GTM_ACCOUNT_ID;
  const containerId = process.env.GTM_CONTAINER_ID;
  const workspaceName = process.env.GTM_WORKSPACE_NAME;

  const accountsResponse = await tagmanager.accounts.list();
  const accounts = accountsResponse.data.account || [];
  const account = accounts.find((item) => item.accountId === accountId);
  if (!account) throw new Error(`GTM account not found or not accessible: ${accountId}`);

  const containersResponse = await tagmanager.accounts.containers.list({ parent: `accounts/${accountId}` });
  const containers = containersResponse.data.container || [];
  const container = containers.find((item) => item.containerId === containerId);
  if (!container) throw new Error(`GTM container not found in account ${accountId}: ${containerId}`);

  const workspacesResponse = await tagmanager.accounts.containers.workspaces.list({ parent: `accounts/${accountId}/containers/${containerId}` });
  const workspaces = workspacesResponse.data.workspace || [];
  const workspace = workspaces.find((item) => item.name === workspaceName);

  let variables = [];
  let triggers = [];
  let tags = [];

  if (workspace?.path) {
    const [variablesResponse, triggersResponse, tagsResponse] = await Promise.all([
      tagmanager.accounts.containers.workspaces.variables.list({ parent: workspace.path }),
      tagmanager.accounts.containers.workspaces.triggers.list({ parent: workspace.path }),
      tagmanager.accounts.containers.workspaces.tags.list({ parent: workspace.path }),
    ]);

    variables = variablesResponse.data.variable || [];
    triggers = triggersResponse.data.trigger || [];
    tags = tagsResponse.data.tag || [];
  }

  const existingVariableNames = variables.map((item) => item.name).filter(Boolean);
  const existingTriggerNames = triggers.map((item) => item.name).filter(Boolean);
  const existingTagNames = tags.map((item) => item.name).filter(Boolean);

  console.log('Google API:');
  console.log('');
  console.log('* Auth: OK');
  console.log(`* Account found: ${accountId}`);
  console.log(`* Container found: ${containerId}`);
  console.log(`* Workspace: ${workspace?.name || `${workspaceName} (not found)`}`);
  if (!workspace) console.log('* Workspace not found. It would be created in a future apply step.');
  console.log('');

  console.log('Existing in GTM:');
  console.log('Variables:');
  console.log('');
  printList(existingVariableNames, `${existingVariableNames.length} found`);
  console.log('');
  console.log('Triggers:');
  console.log('');
  printList(existingTriggerNames, `${existingTriggerNames.length} found`);
  console.log('');
  console.log('Tags:');
  console.log('');
  printList(existingTagNames, `${existingTagNames.length} found`);
  console.log('');

  console.log('Diff:');
  console.log('Variables missing:');
  console.log('');
  printList(missing(expected.variables, existingVariableNames));
  console.log('');
  console.log('Triggers missing:');
  console.log('');
  printList(missing(expected.triggers, existingTriggerNames));
  console.log('');
  console.log('Tags missing:');
  console.log('');
  printList(missing(expected.tags, existingTagNames));
  console.log('');

  console.log('Actions taken:');
  console.log('');
  console.log('* none');
  console.log('');
  console.log('Safety:');
  console.log('');
  console.log('* read-only mode');
  console.log('* no GTM changes made');
  console.log('* no workspace created');
  console.log('* no container version created');
  console.log('* no publish executed');
}

main().catch((error) => {
  console.error('GTM PREFLIGHT READ-ONLY failed');
  console.error(error.message);
  process.exitCode = 1;
});
