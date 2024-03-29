import io from 'socket.io-client';
import socketio from '@feathersjs/socketio-client';
import { createClient } from 'ehome-backend';
import type { ServiceTypes, Configuration } from 'ehome-backend';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthenticationClient, ClientConstructor } from '@feathersjs/authentication-client';

// const IO_URL = Platform.select({
//   web: __DEV__ ? 'http://localhost:3030' : 'https://api.ansuro.me:443',
//   native: __DEV__ ? 'http://10.0.2.2:3030' : 'https://api.ansuro.me:443',
// });
const IO_URL = 'http://localhost:3030';

console.log(IO_URL);
const socket = io(IO_URL, {
  transports: ['websocket'],
  forceNew: true,
  secure: true
});

const connection = socketio<ServiceTypes>(socket);

const client = createClient<Configuration>(connection);//, {
//   storage: AsyncStorage,
//   Authentication: AuthenticationClient
//   // storage: Platform.select({
//   //   native: AsyncStorage,
//   //   web: window.localStorage
//   // })
// });
// client.authentication

client.
export default client;
