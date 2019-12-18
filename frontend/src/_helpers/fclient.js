import io from 'socket.io-client';
import feathers from '@feathersjs/client';

const s = io('http://localhost:3030');
const client = feathers();
client.configure(feathers.socketio(s));
client.configure(feathers.authentication({storage: window.localStorage}));

export default client;

export async function isAdmin() {
    const { user } = await client.get('authentication');
    // console.log(user.username);
    return user.admin === true;
}
