importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyA5WiIGCyRiwK8qRArE5AnLWlaP111sMSM",
  authDomain: "h-reminder.firebaseapp.com",
  projectId: "h-reminder",
  storageBucket: "h-reminder.appspot.com",
  messagingSenderId: "133453356675",
  appId: "1:133453356675:web:8abd694e7ca52b1fff85b6",
  measurementId: "G-50TD3GMM2X"
});

const messaging = firebase.messaging();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch((err) => {
        console.log('Service worker registration failed, error:', err);
      });
  }

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // 백그라운드에서 수신된 메시지 처리
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});