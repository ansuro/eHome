import { Service, NedbServiceOptions } from 'feathers-nedb';
import { Application, ServiceTypes } from '../../declarations';
import { Params, Id, NullableId } from '@feathersjs/feathers';
import logger from '../../logger';
import { UserData } from '../users/users.class';
import { DeviceData } from '../devices/devices.class';
import { BadRequest } from '@feathersjs/errors';

export interface GroupData {
  _id?: Id;
  name: string;
  members?: string[] | UserData[];
  devices?: string[] | DeviceData[];
}

export class Groups extends Service<GroupData> {
  private userService: ServiceTypes['users'];
  private deviceService: ServiceTypes['devices'];

  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options);
    this.userService = app.service('users');
    this.deviceService = app.service('devices');
  }

  // async find(params?: Params) {
  //   // if (params && params.resolve) {
  //   let pageOrArray: Paginated<GroupData> | GroupData[] = await super.find(params);
  //   logger.info('%o', pageOrArray);

  //   const { data, isPage, ...rest } = Array.isArray(pageOrArray) ? { data: pageOrArray, isPage: false } : { data: pageOrArray.data, isPage: true, ...pageOrArray };

  //   const p = data.map(async group => {
  //     logger.info('%o', group);
  //     group.members = await this.resolveMembers(group.members);
  //     group.devices = await this.resolveDevices(group.devices);
  //     logger.info('TEST %o', group.members);
  //     return group;
  //   });

  //   const d = await Promise.all(p);
  //   return isPage ? { ...rest, data: d } as Paginated<GroupData> : d
  //   // }

  //   // return super.find(params);
  // }

  // async get(id: Id, params?: Params) {
  //   const g: GroupData = await super.get(id, params);
  //   logger.info('gruppe: %o', g);
  //   if (params) {
  //     if (params.$withMembers)
  //       g.members = await this.resolveMembers(g.members);
  //     else
  //       delete g.members;

  //     if (params.$withDevices)
  //       g.devices = await this.resolveDevices(g.devices);
  //     else
  //       delete g.devices;

  //     logger.info('MEMBERS: %o', g.members);
  //   }
  //   return g;
  // }

  async get(id: Id, params?: Params) {
    if (!params || !params.user)
      throw new BadRequest();

    const { provider, user, edit } = params;

    if (!provider || (user.admin && edit)) {
      return await super.get(id, params);
    }

    const group = await super.get(id, {
      ...params,
      query: {
        $select: ['_id', 'devices'],
        members: user._id
      }
    }) as GroupData;
    group.devices = await this.resolveDevices(group.devices) as DeviceData[];
    logger.info('Group get: %o', group);
    return group;
  }

  private resolveDevices(deviceList: any[] = []) {
    return this.deviceService.find({
      paginate: false,
      query: {
        _id: {
          $in: deviceList
        }
      }
    });
  }

  private resolveMembers(users: any[] = []) {
    return this.userService.find({
      paginate: false,
      query: {
        $select: ['_id', 'username'],
        _id: {
          $in: users
        }
      }
    }) as Promise<UserData[]>;
  }

  patch(id: NullableId, data: Partial<any>, params?: Params) {
    return super.patch(id, data, params);
  }

  async find(params?: Params) {
    logger.info('Params: %o', params);

    if (!params || !params.user) // TODO
      throw new BadRequest();

    const { provider, user, edit } = params;

    if (!provider || (user.admin && edit)) {
      return await super.find(params);
    }

    // return user memberships with devices
    const groups = await super.find({
      ...params,
      query: {
        $select: ['_id', 'name', 'devices'],
        members: user._id
      }
    }) as GroupData[];

    const g = groups.map(async g => {
      g.devices = await this.resolveDevices(g.devices) as DeviceData[];
      return g;
    });
    const t = await Promise.all(g);
    // logger.info('t: %o', t);
    return t;
  }
}
