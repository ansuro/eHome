import { Application } from './declarations';

import fs from 'fs';

import logger from './logger';
import { Client } from 'aedes';

// start MQTT-Broker, set connected-disconnected-status handler
export default function (app: Application): void {
  const deviceManager = app.service('devicemanager');

  const mqttport = app.get('MQTT_PORT') || 1883;
  let server;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const aedes = require('aedes')();

  if(mqttport === 1883) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    server = require('net').createServer(aedes.handle);
  } else {
    const options = {
      key: fs.readFileSync('../cert/key_1024.pem'),
      cert: fs.readFileSync('../cert/x509_1024.pem')
    };

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    server = require('tls').createServer(options, aedes.handle);
  }

  aedes.on('clientReady', (client: Client) => {
    logger.info('Client connect: %o', client.id);
    // client.id == MAC
    if (client.id !== app.get('MQTT_BACKEND_CLIENT_ID')) {
      logger.info('device connected: %s', client.id);
      deviceManager.connect(client.id);
    }
  });

  aedes.on('clientDisconnect', (client: Client) => {
    // client.id == MAC
    logger.info('device disconnected: %s', client.id);
    deviceManager.disconnect(client.id);
  });

  server.listen(mqttport, () => {
    logger.info('MQTT broker listening on port: %s', mqttport);
  });
}
