import io from 'socket.io-client';
import { AsyncStorage,  } from '@react-native-community/async-storage';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';

const socket = io('http://ehome.local:3030', {
  transports: ['websocket'],
  forceNew: true
});
const client = feathers();

client.configure(socketio(socket));
// TODO auf Emulator testen
client.configure(authentication({
  storage: window.localStorage || AsyncStorage
}));

export default client;