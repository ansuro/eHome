import { Platform } from 'react-native'
import io from 'socket.io-client';
import { AsyncStorage } from '@react-native-community/async-storage';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';

// TODO externalize Config
const IO_URL = __DEV__ ? 'http://ehome.local:3030' : 'https://api.ansuro.me:443';

const socket = io(IO_URL, {
  transports: ['websocket'],
  forceNew: true,
  secure: true
});
const client = feathers();

client.configure(socketio(socket));
// TODO auf Emulator testen
client.configure(authentication({
  ...Platform.select({
    android: AsyncStorage,
    default: window.localStorage
  })
}));

export default client;