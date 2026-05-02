self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    self.registration.showNotification(data.title || 'Civic Portal', {
        body: data.body || 'Your complaint status has been updated.',
        icon: '/logo192.png',
        badge: '/logo192.png',
        data: { url: data.url || '/' }
    });
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow(event.notification.data.url));
});