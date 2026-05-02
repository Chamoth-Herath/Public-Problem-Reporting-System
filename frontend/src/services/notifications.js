export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
};

export const showNotification = (title, body, url = '/') => {
    if (Notification.permission !== 'granted') return;
    const n = new Notification(title, {
        body,
        icon: '/logo192.png',
        badge: '/logo192.png',
    });
    n.onclick = () => { window.focus(); window.location.href = url; n.close(); };
};