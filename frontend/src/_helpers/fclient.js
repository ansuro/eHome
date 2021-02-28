import io from 'socket.io-client';
import feathers from '@feathersjs/client';

const s = io(process.env.REACT_APP_IO_URL, {
    // withCredentials: true,
    transports: ['websocket'],
    secure: true
});
const client = feathers();
client.configure(feathers.socketio(s));
client.configure(feathers.authentication({storage: window.localStorage}));

export default client;

export async function isAdmin() {
    const { user } = await client.get('authentication');
    // console.log(user.username);
    return user.admin === true;
}
