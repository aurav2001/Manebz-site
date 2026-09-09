import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Handle dynamic module chunk loading errors across new deployments
window.addEventListener('vite:preloadError', (event) => {
  console.warn('New deployment detected / stale module chunk encountered. Reloading...');
  window.location.reload();
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

