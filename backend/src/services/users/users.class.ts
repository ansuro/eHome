import { Service, NedbServiceOptions } from 'feathers-nedb';
import { Application, ServiceTypes } from '../../declarations';
import { Params, Paginated, Id } from '@feathersjs/feathers';
import logger from '../../logger';
import { GroupData } from '../groups/groups.class';

export interface UserData {
  _id: Id;
  username: string;
  password: string;
  admin: boolean;
  groups?: GroupData[]
}

export class Users extends Service<UserData> {
  private app: Application;

  constructor(options: Partial<NedbServiceOptions>, app: Application) {
    super(options);
    this.app = app;
  }

  async find(params?: Params) {
    // logger.info('USERS FIND %o', params);
    // if (params && params.with) {
    //   let pageOrArray: Paginated<UserData> | UserData[] = await super.find(params);
    //   logger.info('%o', pageOrArray);

    //   const { data, isPage, ...rest } = Array.isArray(pageOrArray) ? { data: pageOrArray, isPage: false } : { data: pageOrArray.data, isPage: true, ...pageOrArray };
    //   // const groups = await this.groupService.find();
    //   const p = data.map(async user => {
    //     logger.info('%o', user);
    //     const groups = await this.loadGroups(user._id);
    //     // const groups = await this.groupService.find();
    //     user.groups = groups as GroupData[];
    //     logger.info('USER-Groups %o', groups);
    //     return user;
    //   });

    //   const d = await Promise.all(p);
    //   return isPage ? { ...rest, data: d } as Paginated<UserData> : d;
    // } else {
    return super.find(params);
    // }
  }

  private loadGroups(userId: Id) {
    return this.app.service('groups').find({
      paginate: false,
      query: {
        members: userId
      }
    }) as Promise<GroupData[]>;
  }
}
