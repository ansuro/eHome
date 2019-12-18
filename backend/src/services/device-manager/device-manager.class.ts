import { Id, NullableId, Paginated, Params, ServiceMethods } from '@feathersjs/feathers';
import { Client, connect, MqttClient } from 'mqtt';
import { Application, ServiceTypes } from '../../declarations';
import logger from '../../logger';
import { BadRequest, Forbidden, NotImplemented } from '@feathersjs/errors';

interface Data {
  MAC: any;
  name: any;
  value: any;
}

interface ServiceOptions { }

export class DeviceManager implements ServiceMethods<Data> {
  private app: Application;
  private options: ServiceOptions;
  private mqtt!: Client;

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options;
    this.app = app;

    this.mqttSetup();
  }

  mqttSetup() {
    const mqttOptions = {
      clientId: this.app.get('MQTT_BACKEND_CLIENT_ID')
    };

    this.mqtt = connect(mqttOptions);
    this.mqtt.on('connect', () => {
      this.mqtt.subscribe({ 'status/+': { qos: 1 } }, (err, granted) => {
        if (err)
          logger.error('%o', err);
      });

      this.mqtt.subscribe({ 'register/+': { qos: 1 } }, (err, granted) => {
        if (err)
          logger.error('%o', err);
      });

      logger.info('Backend mqtt client connected');
    });

    this.mqtt.on('message', (topic, message) => {
      logger.info("message: %o", message.toString());

      const msg = message.toString();

      // TODO better error management in device
      if (msg === 'Error') {
        logger.error('Unknown device state');
        return;
      }

      const m = JSON.parse(msg);

      if (topic.startsWith('status/')) {
        const id = topic.replace('status/', '');
        logger.info('(topic: %s) msg: %s', topic, message);
        logger.info('JSON: %o', m);
        logger.info('id: %s', id);

        this.app.service('devices').patch(null, {
          states: m
        }, {
          query: {
            MAC: id
          }
        }).then(m => {
          logger.info('saved: %o', m);
        }).catch(e => logger.error(e));
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
      // at least once connected
      return this.app.service('devices').patch(null, { online: true }, {
        query: {
          MAC: mac
        }
      }).then(d => {
        logger.info('Device online: %o', d);
        // this.deviceService.emit('status', d);
      }).catch(e => { });
    } else {
      // new unconfigured device
      return this.app.service('devices').create({
        MAC: mac,
        online: true
      }).then(d => {
        logger.info('New device saved: %o', d);
        // this.deviceService.emit('newdevice', d);
      }).catch(e => {
        logger.error(e);
      });
    }
  }

  /*
    a device disconnected from the mqtt broker
    - set status to offline
    - emit offline event
  */
  disconnect(mac: string) {
    return this.app.service('devices').patch(null, { online: false }, {
      query: {
        MAC: mac
      }
    }).then(d => {
      logger.info('Device offline: %o', d);
      // this.deviceService.emit('status', d);
    }).catch(e => { });
  }

  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return [];
  }

  async get(id: Id, params?: Params): Promise<Data> {
    // return {
    //   // id, text: `A new message with ID: ${id}!`
    // };

    throw new NotImplemented();
  }

  async create(data: Data, params?: Params): Promise<Data> {
    // if (Array.isArray(data)) {
    //   return Promise.all(data.map(current => this.create(current, params)));
    // }

    // return data;
    throw new NotImplemented();
  }

  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data;
  }

  /*
    update status of a device (on, off, new value)
    - check permission
    - send update command to device (via mqtt)
    - wait for respone and update accordingly
    - emit new status
  */
  // TODO return a promise and wait for mqtt response
  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {

    if (!params)
      throw new BadRequest();

    logger.info('device update: %s => %o Params: %o', id, data, params.user._id);
    if (await this.isPermitted(params.user._id, id)) {
      const dx = await this.app.service('devices').find({
        query: {
          _id: id,
          $select: ['MAC'],
          $paginate: false
        }
      });
      const MAC = dx[0].MAC;
      this.mqtt.publish(MAC, Buffer.from(JSON.stringify(data)));
    } else {
      throw new Forbidden();
    }

    return data;
  }

  async remove(id: NullableId, params?: Params): Promise<Data> {
    // return { id };
    throw new NotImplemented();
  }

  private async isPermitted(userId: Id, deviceId: NullableId) {
    const c = await this.app.service('groups').find({
      query: {
        $limit: 0,
        members: userId,
        devices: deviceId
      }
    });

    logger.info('isPermitted: %o %o total: %o', userId, deviceId, c);
    return c.total > 0;
  }
}
