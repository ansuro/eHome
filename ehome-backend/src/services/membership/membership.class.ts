// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Paginated, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { Membership, MembershipData, MembershipPatch, MembershipQuery } from './membership.schema'

export type { Membership, MembershipData, MembershipPatch, MembershipQuery }

export interface MembershipParams extends KnexAdapterParams<MembershipQuery> {}

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class MembershipService<ServiceParams extends Params = MembershipParams> extends KnexService<
  Membership,
  MembershipData,
  MembershipParams,
  MembershipPatch
> {

  async find(params?: ServiceParams & { paginate: false; }): Promise<Membership[]>
  async find(params?: ServiceParams & { paginate?: { default?: number; max?: number } }): Promise<Paginated<Membership>>
  async find(params?: ServiceParams): Promise<Paginated<Membership> | Membership[]> {
    return await super.find(params);
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: false,
    Model: app.get('sqliteClient'),
    name: 'membership'
  }
}
