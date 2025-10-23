// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Id, NullableId, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { User, UserData, UserPatch, UserQuery } from './users.schema'
import { logger } from '../../logger'

export type { User, UserData, UserPatch, UserQuery }

export interface UserParams extends KnexAdapterParams<UserQuery> {
  $withGroups: boolean
}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class UserService<ServiceParams extends Params = UserParams> extends KnexService<
  User,
  UserData,
  UserParams,
  UserPatch
> {

  // get(id: Id, params?: UserParams | undefined): Promise<User> {
  //   let user: Promise<User> = super.get(id, params);
  //   logger.info('UserService.get called');
  //   if (params?.$withGroups) {
  //     user = user.then(async u => {
  //       const membership = await (this.options.Model as any)
  //         .select('gid', 'groups.id', 'groups.name')
  //         .from('membership')
  //         .join('groups', 'membership.gid', 'groups.id')
  //         .where('membership.uid', u.id);

  //       logger.info('Loaded membership: %o', membership);
  //       return {
  //         ...u,
  //         userGroups: membership
  //       };
  //     });
  //   }

  //   return user;
  // }

  remove(id: Id, params?: UserParams): Promise<User>
  remove(id: null, params?: UserParams): Promise<User[]>
  remove(id: NullableId, params?: UserParams): Promise<User | User[]> {
    logger.info('UserService.remove called for id %o', id);
    let usersPromise = super.remove(id, params);
    const users = Array.isArray(usersPromise) ? usersPromise : [usersPromise];

    return Promise.all(users).then(async us => {
      for (const u of us) {
        logger.info('Removing membership for user id %d', u.id);
        await (this.options.Model as any)('user_groups').where({ user_id: u.id }).del();
      }
      return Array.isArray(id) || id === null ? us : us[0];
    });
  }

}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'users'
  }
}
