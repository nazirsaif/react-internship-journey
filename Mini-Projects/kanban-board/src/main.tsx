import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@internal/ui-system/src/index.css';
import './style.css';

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
