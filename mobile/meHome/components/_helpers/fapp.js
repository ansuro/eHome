import { Platform } from 'react-native'
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';

// TODO externalize Config
// const IO_URL = __DEV__ ? 'http://localhost:3030' : 'https://api.ansuro.me:443';
const IO_URL = Platform.select({
  web: __DEV__ ? 'http://localhost:3030' : 'https://api.ansuro.me:443',
  native: __DEV__ ? 'http://10.0.2.2:3030' : 'https://api.ansuro.me:443'
});
console.log(IO_URL);
const socket = io(IO_URL, {
  transports: ['websocket'],
  forceNew: true,
  secure: true
});
const client = feathers();

client.configure(socketio(socket));

client.configure(authentication({
    storage: Platform.select({
    native: AsyncStorage,
    web: window.localStorage
  })
}));

export default client;