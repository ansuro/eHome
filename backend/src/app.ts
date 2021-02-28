import path from 'path';
import favicon from 'serve-favicon';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';

import feathers from '@feathersjs/feathers';
import configuration from '@feathersjs/configuration';
import express from '@feathersjs/express';
import socketio from '@feathersjs/socketio';


import { Application } from './declarations';
import logger from './logger';
import middleware from './middleware';
import services from './services';
import appHooks from './app.hooks';
import channels from './channels';
import authentication from './authentication';
import dbinit from './dbinit';
import deviceinit from './deviceinit';
import mqttbroker from './mqttbroker';
import mdns from './mdns';
// Don't remove this comment. It's needed to format import lines nicely.

const app: Application = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors({
  origin: ['https://admin.ansuro.me', 'https://ehome.ansuro.me'],
  // credentials: true
}));
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());
// app.configure(socketio());
app.configure(socketio({
  // origins: ['https://admin.ansuro.me:443', 'https://ehome.ansuro.me:443'],
  transports: ['websocket']
  // handlePreflightRequest: (server, req, res) => {
  //   res.writeHead(200, {
  //     'Access-Control-Allow-Origin': 'https://admin.ansuro.me',
  //     'Access-Control-Allow-Methods': '*',
  //     'Access-Control-Allow-Headers': 'my-custom-header',
  //     'Access-Control-Allow-Credentials': 'true'
  //   });
  //   res.end();
// }
}));

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger } as any));

app.hooks(appHooks);

// Create default users, if necessary
app.configure(dbinit);

// Configure MQTT-Broker
app.configure(mqttbroker);

// reset all device status to offline
app.configure(deviceinit);

app.configure(mdns);

export default app;
