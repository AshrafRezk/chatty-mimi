
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker, requestNotificationPermission } from './utils/pushNotificationUtils.ts';

// Register the service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Register service worker with more robust error handling
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
        updateViaCache: 'none' // Ensure browser checks for updated service worker
      });
      
      console.log('Service Worker registered successfully:', registration.scope);
      
      // Check if the service worker is active or activating
      if (registration.active || registration.installing || registration.waiting) {
        try {
          await requestNotificationPermission();
        } catch (permError) {
          console.warn('Notification permission error:', permError);
        }
      }

      // Handle service worker updates
      registration.onupdatefound = () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.onstatechange = () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('New service worker available, reload for updates');
            // Here we could prompt the user to refresh for updates if needed
          }
        };
      };
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find the root element');
}

// Create a root using the new React 18 createRoot API
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
