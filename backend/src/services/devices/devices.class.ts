import { Service, NedbServiceOptions } from 'feathers-nedb';
import { Application } from '../../declarations';
import { Paginated, Params } from '@feathersjs/feathers';
import logger from '../../logger';

export interface DeviceData {
  _id?: string;
  name?: string;
  MAC: string;
  online: boolean;
  status?: string;
}

export class Devices extends Service<DeviceData> {
  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options);
  }

  async create(data: DeviceData, params?: Params) {
    logger.info('device create, data: %o', data);
    logger.info('device create, params: %o', params);

    return super.create(data, params);
  }

  // async connect(mac: string) {
  //   // const id = await this.findIdByMAC(mac);
  //   // logger.info('ID: %o', id);
  //   const exists = await this.existsInDb(mac);
  //   if (!exists) {
  //     // create new unconfigured device
  //     return super.create({ MAC: mac, status: true }).then(d => {
  //       logger.info('New unconfigured device saved: %o', d);
  //     });
  //     logger.info('new unconfigured device with MAC %s saved', mac);
  //   } else {
  //     // update status to online
  //     return super.patch(null, { status: true }, {
  //       query: {
  //         MAC: mac
  //       }
  //     });
  //     logger.info('Device online: %s', mac);
  //   }
  // }

  // async disconnect(mac: string) {
  //   // update status to offline
  //   // const id = await this.findIdByMAC(mac);
  //   logger.info('Device offline: %s', mac);
  //   return super.patch(null, { status: false }, {
  //     query: {
  //       MAC: mac
  //     }
  //   });

  // }

  async existsInDb(mac: string) {
    const e = await super.find({
      query: {
        $limit: 0,
        MAC: mac
      }
    }) as Paginated<DeviceData>;
    // logger.info('existsInDB %o', e);
    // const e2 = await super.find({
    //   query: {
    //     MAC: mac
    //   }
    // });
    // logger.info('existsInDB2 %o', e2);
    return e.total == 0 ? false : true;
  }

  // find ID via MAC, not found returns -1
  // private async findIdByMAC(mac: string): Promise<string | number> {
  //   try {
  //     const did = await super.find({
  //       query: {
  //         $limit: 1,
  //         $select: ['_id'],
  //         MAC: mac
  //       }
  //     });
  //     logger.info('id: %o', did);
  //     return did.total == 0 ? -1 : did.data[0]._id;
  //   }
  //   catch (e) {
  //     logger.error('%o', e);
  //     throw new Error(e);
  //   }

  // }

}
