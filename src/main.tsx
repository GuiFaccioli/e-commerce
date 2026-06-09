import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initializeGtm } from './lib/dataLayer';
import './styles.css';

initializeGtm();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
