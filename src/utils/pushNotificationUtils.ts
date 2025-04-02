
/**
 * Register the service worker for Push Notifications
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered successfully:', registration.scope);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  console.log('Service Workers not supported');
  return null;
}

/**
 * Request permission for push notifications
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(serviceWorkerReg: ServiceWorkerRegistration): Promise<PushSubscription | null> {
  try {
    const vapidPublicKey = 'BElW8biMRR-K06LEUxGaYNz9t9CwFbeKa-gL5Itp5lD8eYNjpQAMGlvOAHhOyJxYUSqO_tIBJ-s3KW2-fJGU6gc'; // Replace with your VAPID public key
    
    const subscription = await serviceWorkerReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });
    
    console.log('User subscribed to push notifications:', subscription);
    
    // Here you would typically send the subscription to your server
    // await saveSubscription(subscription);
    
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
    return null;
  }
}

/**
 * Schedule a weather notification
 */
export async function scheduleWeatherNotification(userLocation: { city: string, country: string, latitude: number, longitude: number }) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    // Normally, you would fetch real weather data from an API
    const weatherInfo = {
      temp: Math.round(15 + Math.random() * 15), // Random temp between 15-30
      condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)]
    };

    new Notification('Daily Weather Update', {
      body: `Current weather in ${userLocation.city}: ${weatherInfo.temp}°C, ${weatherInfo.condition}. Have a great day!`,
      icon: '/icons/icon-192x192.png'
    });
  } catch (error) {
    console.error('Error showing weather notification:', error);
  }
}

/**
 * Schedule a daily tip notification
 */
export async function scheduleTipNotification() {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    const tips = [
      'Voice chat with Mimi by clicking the microphone icon!',
      'Try switching to different moods to see how Mimi adapts.',
      'Use the persona selector to get specialized help.',
      'Ask Mimi to analyze images by uploading them.',
      'For better answers, be specific in your questions.',
      'You can ask Mimi to create charts for data visualization.',
      'Try multilingual conversations with Mimi!',
      'Stuck on a problem? Ask Mimi for step-by-step guidance.'
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    new Notification('Mimi AI Tip', {
      body: randomTip,
      icon: '/icons/icon-192x192.png'
    });
  } catch (error) {
    console.error('Error showing tip notification:', error);
  }
}

/**
 * Convert base64 string to Uint8Array for VAPID key
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  
  return outputArray;
}
