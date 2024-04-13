// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Paginated, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Group, GroupData, GroupPatch, GroupQuery } from './groups.schema'
import { logger } from '../../logger'

export type { Group, GroupData, GroupPatch, GroupQuery }

export interface GroupParams extends KnexAdapterParams<GroupQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class GroupService<ServiceParams extends Params = GroupParams> extends KnexService<
  Group,
  GroupData,
  GroupParams,
  GroupPatch
> {
  async find(params?: ServiceParams & { paginate: false; }): Promise<Group[]>
  async find(params?: ServiceParams & { paginate?: { default?: number; max?: number } }): Promise<Paginated<Group>>
  async find(params?: ServiceParams): Promise<Paginated<Group> | Group[]> {
    // logger.info('REQUEST: %o', params?.query);
    return await super.find(params);
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    Model: app.get('sqliteClient'),
    name: 'groups'
  }
}
