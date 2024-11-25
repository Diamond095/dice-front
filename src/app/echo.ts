import Echo from "laravel-echo";
import Pusher from 'pusher-js';

declare global {
    interface Window {
      Echo: any;
      Pusher: any;
    }
}

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '8f20dfdf28a33b31bec5',
    cluster: 'eu',
    wsPort: 443,
    disableStats: true,
    encrypted: true,
});
