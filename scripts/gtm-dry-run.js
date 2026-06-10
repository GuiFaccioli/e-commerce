/* global console, process */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contractPath = path.resolve(__dirname, '../tracking/ga4-events.contract.json');

function assertField(object, field, context, warnings) {
  if (!object[field]) warnings.push(`${context} is missing required field: ${field}`);
}

function variableNameFromPath(parameterPath) {
  return `DLV - ${parameterPath}`;
}

function validateContract(contract) {
  const warnings = [];

  for (const field of ['version', 'project', 'containerId', 'measurementId', 'events']) {
    assertField(contract, field, 'Contract', warnings);
  }

  if (!Array.isArray(contract.events)) {
    warnings.push('Contract events must be an array');
    return warnings;
  }

  for (const eventConfig of contract.events) {
    const context = `Event ${eventConfig.event || '<unknown>'}`;

    for (const field of ['event', 'ga4EventName', 'type', 'triggerName', 'tagName', 'parameters']) {
      assertField(eventConfig, field, context, warnings);
    }

    if (!eventConfig.requiredParameters || !Array.isArray(eventConfig.requiredParameters) || eventConfig.requiredParameters.length === 0) {
      warnings.push(`${context} has no requiredParameters`);
    }

    if (eventConfig.event === 'purchase' && !eventConfig.requiredParameters?.includes('transaction_id')) {
      warnings.push('Event purchase must include transaction_id as required parameter');
    }

    if (eventConfig.type === 'ecommerce' && !eventConfig.parameters?.items) {
      warnings.push(`${context} is ecommerce but has no items parameter`);
    }

    for (const [parameterName, parameterPath] of Object.entries(eventConfig.parameters || {})) {
      if (!parameterPath || typeof parameterPath !== 'string' || parameterPath.trim() === '') {
        warnings.push(`${context} parameter ${parameterName} has an empty path`);
      }
    }
  }

  return warnings;
}

function collectVariables(events) {
  const variables = new Map();

  for (const eventConfig of events) {
    for (const parameterPath of Object.values(eventConfig.parameters)) {
      variables.set(parameterPath, variableNameFromPath(parameterPath));
    }
  }

  return [...variables.entries()].map(([parameterPath, variableName]) => ({ parameterPath, variableName }));
}

function printDryRun(contract, warnings) {
  const variables = collectVariables(contract.events);

  console.log('GTM DRY RUN');
  console.log(`Project: ${contract.project}`);
  console.log(`Container: ${contract.containerId}`);
  console.log(`Measurement ID: ${contract.measurementId}`);
  console.log('');

  console.log('Variables to create:');
  console.log('');
  for (const variable of variables) {
    console.log(`* ${variable.variableName} → ${variable.parameterPath}`);
  }
  console.log('');

  console.log('Triggers to create:');
  console.log('');
  for (const eventConfig of contract.events) {
    console.log(`* ${eventConfig.triggerName} listens to ${eventConfig.event}`);
  }
  console.log('');

  console.log('Tags to create:');
  console.log('');
  for (const eventConfig of contract.events) {
    console.log(`* ${eventConfig.tagName} sends ${eventConfig.ga4EventName}`);
    console.log('  Parameters:');
    console.log('');
    for (const [parameterName, parameterPath] of Object.entries(eventConfig.parameters)) {
      console.log(`  * ${parameterName} ← {{${variableNameFromPath(parameterPath)}}}`);
    }
    console.log('');
  }

  console.log('Warnings:');
  console.log('');
  if (warnings.length === 0) {
    console.log('* none');
    return;
  }

  for (const warning of warnings) {
    console.log(`* ${warning}`);
  }
}

async function main() {
  const raw = await readFile(contractPath, 'utf8');
  const contract = JSON.parse(raw);
  const warnings = validateContract(contract);
  printDryRun(contract, warnings);

  if (warnings.length > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('GTM DRY RUN failed');
  console.error(error);
  process.exitCode = 1;
});
