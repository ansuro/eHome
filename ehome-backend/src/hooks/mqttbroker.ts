import { HookContext, NextFunction } from '../declarations';

import fs from 'fs';

import { logger } from '../logger';
import { Client } from 'aedes';
import type { Server } from 'net';

let server: Server;
let aedes: any;

// start MQTT-Broker, set connected-disconnected-status handler
export const startMQTTBroker = async (context: HookContext, next: NextFunction) => {
  const deviceManager = context.app.service('device-manager');

  const mqttport = context.app.get('MQTT_PORT') || 1883;
  
  aedes = require('aedes')();

  if (mqttport === 1883) {
    server = require('net').createServer(aedes.handle);
  } else {
    const options = {
      key: fs.readFileSync('../cert/key_1024.pem'),
      cert: fs.readFileSync('../cert/x509_1024.pem')
    };

    server = require('tls').createServer(options, aedes.handle);
  }

  aedes.on('clientReady', (client: Client) => {
    logger.info('Client connect: %o', client.id);
    // client.id == MAC
    if (client.id !== context.app.get('MQTT_BACKEND_CLIENT_ID')) {
      logger.info('device connected: %s', client.id);
      deviceManager.connect(client.id);
    }
  });

  aedes.on('clientDisconnect', (client: Client) => {
    // client.id == MAC
    logger.info('device disconnected: %s', client.id);
    deviceManager.disconnect(client.id);
  });

  server.listen(mqttport, async () => {
    logger.info('MQTT broker listening on port: %s', mqttport);
    // connect mqtt backend client
    context.app.service('device-manager').mqttSetup();
    await next();
  });
}

export const stopMQTTBroker = async (context: HookContext, next: NextFunction) => {
  await new Promise((resolve, reject) => {
    aedes.close((err: any) => {
      server.close(() => {
        logger.info('MQTT broker closed.');
        resolve(err);
      });
    }
    )});

    await next();
}
