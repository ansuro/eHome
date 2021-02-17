import { Application } from './declarations';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const aedes = require('aedes')();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const server = require('net').createServer(aedes.handle);
import logger from './logger';

import { Client } from 'aedes';

// start MQTT-Broker, set connected-disconnected-status handler
export default function (app: Application): void {
  const deviceManager = app.service('devicemanager');

  const mqttport = app.get('MQTT_PORT') || 1883;

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

  // TODO configure auth, ssl, cert, ...
  server.listen(mqttport, () => {
    logger.info('MQTT broker listening on port: %s', mqttport);
  });
}
