import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register SmartPocket offline service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // Automatically check for SW updates
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content available
              }
            };
          }
        };
      })
      .catch(() => {
        // Offline / private browsing
      });
  });
}

createRoot(document.getElementById('root')!).render(<App />);
