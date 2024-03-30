// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Paginated, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Device, DeviceData, DevicePatch, DeviceQuery } from './devices.schema'

export type { Device, DeviceData, DevicePatch, DeviceQuery }

export interface DeviceParams extends KnexAdapterParams<DeviceQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class DeviceService<ServiceParams extends Params = DeviceParams> extends KnexService<
  Device,
  DeviceData,
  DeviceParams,
  DevicePatch
> {

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
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'devices',
    multi: ['remove', 'patch']
  }
}
