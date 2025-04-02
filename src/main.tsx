
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, requestNotificationPermission } from './utils/pushNotificationUtils.ts'

// Register the service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await registerServiceWorker();
      if (registration) {
        // Request notification permission
        await requestNotificationPermission();
      }
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
