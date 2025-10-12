// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import fs from 'fs';

import { MqttClient, connect, IClientOptions } from 'mqtt';
import { logger } from '../../logger';

import type { Application } from '../../declarations'
import type {
  DeviceManager,
  DeviceManagerData,
  DeviceManagerPatch,
  DeviceManagerQuery
} from './device-manager.schema'

import type { State, StateData } from '../states/states.schema';

export type { DeviceManager, DeviceManagerData, DeviceManagerPatch, DeviceManagerQuery }

export interface DeviceManagerServiceOptions {
  app: Application
}

export interface DeviceManagerParams extends Params<DeviceManagerQuery> { }

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class DeviceManagerService<ServiceParams extends DeviceManagerParams = DeviceManagerParams>
  implements ServiceInterface<DeviceManager, DeviceManagerData, ServiceParams, DeviceManagerPatch>
{
  private app: Application;
  private mqtt!: MqttClient;

  constructor(public options: DeviceManagerServiceOptions) {
    this.app = options.app;
    // this.mqttSetup();
  }

  // configure and connect mqtt backend client
  mqttSetup(): void {
    let mqttOptions: IClientOptions;
    // to check for encryption
    const mqttport = this.app.get('MQTT_PORT') || 1883;

    if (mqttport === 1883) {
      mqttOptions = {
        clientId: this.app.get('MQTT_BACKEND_CLIENT_ID'),
        port: mqttport,
        host: 'localhost',
        protocol: 'mqtt'
      };
    } else {
      mqttOptions = {
        clientId: this.app.get('MQTT_BACKEND_CLIENT_ID'),
        key: fs.readFileSync('../cert/key_1024.pem'),
        cert: fs.readFileSync('../cert/x509_1024.pem'),
        port: mqttport,
        host: 'localhost',
        protocol: 'mqtts',
        rejectUnauthorized: false
      };
    }

    this.mqtt = connect(mqttOptions);
    this.mqtt.on('connect', () => {
      this.mqtt.subscribe({ 'status/+': { qos: 1 } }, (err, granted) => {
        if (err)
          logger.error('%o', err);

        logger.info("subscribe status: %o", granted)
      });

      this.mqtt.subscribe({ 'register/+': { qos: 1 } }, (err, granted) => {
        if (err)
          logger.error('%o', err);

          logger.info("subscribe register: %o", granted)
      });

      logger.info('Backend mqtt client connected');
    });

    this.mqtt.on('error', (err) => {
      logger.info("%o", err);
    });

    this.mqtt.on('disconnect', () => {
      logger.info("disconnect");
    });

    this.mqtt.on('message', async (topic, message) => {
      logger.info('message: %o', message.toString());

      const msg = message.toString();

      // TODO better error management in device
      if (msg === 'Error') {
        logger.error('Unknown device state');
        return;
      }


      if (topic.startsWith('register/')) {
        const deviceMAC = topic.replace('register/', '');
        // logger.info('(topic: %s) msg: %s', topic, message);
        // logger.info('JSON: %o', parsedMessage);
        // logger.info('mac-id: %s', deviceMAC);

        let parsedMessage: StateData[] = [];
        try {
          parsedMessage = JSON.parse(msg);
          logger.info("%o", parsedMessage);
        } catch (e) {
          logger.error("Parsing JSON failed: %o", e);
          return;
        }

        // TODO states patchen

        // TODO prüfen
        let states: StateData[] = parsedMessage.map((s: any) => {
          // let newValue: any;
          // if (s['value'] === !!s['value']) {
          //   newValue = s['value'] ? 'true' : 'false';
          // } else {
          //   newValue = s['value'];
          // }

          let ns: StateData = {
            ...s,
            MAC: deviceMAC
            // value: s.value + ''
            // options: s.options ? JSON.stringify(s.options) : undefined
          };

          return ns;
        });

        logger.info("JSON-Array nach States[] gecastet: %o", states);

        // alle rows löschen, alle states inserten
        // emit custom event
        try {
          await this.app.service('states').remove(null, { query: { MAC: deviceMAC } });
          await this.app.service('states').create(states);
          // TODO emit custom event
        } catch (e) {
          logger.error("Inserting new states failed: %o", e);
        }

        // this.app.service('device').patch(null, {
        //   states: m
        // }, {
        //   query: {
        //     MAC: mac
        //   }
        // }).then(d => {
        //   logger.info('device registered: %o', d);
        // }).catch(e => logger.error(e));

      } else if (topic.startsWith('status/')) {

        const mac = topic.replace('status/', '');
        logger.info('(topic: %s) msg: %s', topic, message);
        logger.info('mac-id: %s', mac);
        
        let parsedMessage: StateData;
        try {
          parsedMessage = JSON.parse(msg);
          logger.info("%o", parsedMessage);
        } catch (e) {
          logger.error("Parsing JSON failed: %o", e);
          return;
        }
        
        logger.info('JSON: %o', parsedMessage);
        // update state change
        // find and update

        try { // TODO
          const s = await this.app.service('states').patch(null, {
            value: parsedMessage["value"]
          }, {
            query: {
              $and: [{ MAC: mac }, { name: parsedMessage["name"] }]
            }
          });
          // TODO emit custom event
          logger.info("State of device (%s) changed: %o", mac, s);
        } catch (e) {
          logger.error("Statechange failed: %s", e);
        }


        // this.deviceService.find({query: {
        //   MAC: mac
        // }, paginate: false}).then(d => {
        //   this.stateService.patch(d[0].id, {
        //     value: m["value"]
        //   }, {
        //     query: {
        //       name: m["name"]
        //     }
        //   }).then(s => {
        //     logger.info("State saved: %o", s);
        //     // TODO emit custom event
        //   }).catch(e => {
        //     logger.error("Saving state failed: %o", e);
        //   });
        // }).catch(e => {
        //   logger.error("Error finding deivce: %o", e);
        // });


        // 1. find by mac
        // 2. patch whole array
        // (this.app.service('device').find({
        //   query: {
        //     MAC: mac,
        //     $select: ['id', 'states'],
        //     $paginate: false
        //   }
        // }) as Promise<Device[]>).then(d => {
        //   logger.info('device(%s) state found: %o', mac, d);
        //   const newStates = d[0].states?.map(s => {
        //     if (s.name === m.name) {
        //       s.value = m.value;
        //     }

        //     return s;
        //   });
        //   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        //   this.app.service('device').patch(d[0]._id!, {
        //     states: newStates
        //   }).then(pd => {
        //     logger.info('device states patched: %o', pd);
        //   }).catch(e => logger.error(e));
        // }).catch(e => logger.error(e));

      }
    });
  }
  /*
  a device connected via mqtt
  - check wether the device is a new device or was already connected
  -   if new device: save it, emit online event
  -   if was already connected: update status to online, emit online event
*/
  async connect(mac: string) {
    if (await this.app.service('devices').existsInDb(mac)) {
      // at least connected once
      try {
        //TODO do find first and check if there is only one device then patch
        const d = await this.app.service('devices').patch(null, { isOnline: true }, {
          query: {
            MAC: mac
          }
        });
        // const d = await this.app.service('device').patch(mac, { isOnline: true });
        logger.info('Device online: %o', d);
        // this.deviceService.emit('status', d);
      } catch (e) {
        logger.error(e);
      }
    } else {
      // new unconfigured device
      try {
        const d = await this.app.service('devices').create({
          name: mac,
          MAC: mac,
          isOnline: true
        });
        // logger.info('New device saved: %o', d);
        // this.deviceService.emit('newdevice', d);
      } catch (e) {
        logger.error(e);
      }
    }
  }

  /*
    a device disconnected from the mqtt broker
    - set status to offline
    - emit offline event
  */
  async disconnect(mac: string) {
    try {
      const d = await this.app.service('devices').patch(null, { isOnline: false }, {
        query: {
          MAC: mac
        }
      });

      logger.info('Device offline (%s): %s', mac, d[0]?.name!);
    } catch (e) {
      logger.error("Error changing device status to offline: %", e);
    }
  }

  async find(_params?: ServiceParams): Promise<DeviceManager[]> {
    return [];
  }

  async get(id: Id, _params?: ServiceParams): Promise<DeviceManager> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    };
  }

  async create(data: DeviceManagerData, params?: ServiceParams): Promise<DeviceManager>;
  async create(data: DeviceManagerData[], params?: ServiceParams): Promise<DeviceManager[]>;
  async create(
    data: DeviceManagerData | DeviceManagerData[],
    params?: ServiceParams
  ): Promise<DeviceManager | DeviceManager[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)));
    }

    return {
      id: 0,
      ...data
    };
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: DeviceManagerData, _params?: ServiceParams): Promise<DeviceManager> {
    return {
      id: 0,
      ...data
    };
  }

  async patch(id: NullableId, data: DeviceManagerPatch, _params?: ServiceParams): Promise<DeviceManager> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    };
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<DeviceManager> {
    return {
      id: 0,
      text: 'removed'
    };
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
