import io from 'socket.io-client';
import { AsyncStorage, } from '@react-native-community/async-storage';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';

import { appState } from './AppStateObserver';

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
  storage: window.localStorage || AsyncStorage
}));

client.io.on('disconnect', () => {
  appState.setConnected(false);
  console.log('ws disconnected');
});

client.io.on('connect', () => {
  appState.setConnected(true);
  console.log('ws connected');
  // eingeloggt? Home : Login
  client.reAuthenticate().then(() => {
    // show application page
    appState.login();
    console.log(appState.loggedIn);
  }).catch(() => {
    // show login page
    appState.logout();
    console.log(appState.loggedIn);
  });
});

export default client;