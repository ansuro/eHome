import { Application } from "./declarations";

import { Server, Client } from "mosca";
import logger from "./logger";

// start MQTT-Broker, set connected-disconnected-status handler
export default function (app: Application) {
  const deviceManager = app.service('devicemanager');

  // TODO configure auth, ssl, cert, ...
  const msrv = new Server({
    port: app.get('MQTT_PORT')
  });

  msrv.on('ready', () => {
    logger.info('MQTT broker started');
  });

  msrv.on('clientConnected', (client: Client) => {
    logger.info('Client connect: %o', client.id);
    // client.id == MAC
    if (client.id !== app.get('MQTT_BACKEND_CLIENT_ID')) {
      logger.info('device connected: %s', client.id);
      deviceManager.connect(client.id);
    }
  });

  msrv.on('clientDisconnected', (client: Client) => {
    // client.id == MAC
    logger.info('device disconnected: %s', client.id);
    deviceManager.disconnect(client.id);
  });

}
