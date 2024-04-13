// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Paginated, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { State, StateData, StatePatch, StateQuery } from './states.schema'

export type { State, StateData, StatePatch, StateQuery }

export interface StateParams extends KnexAdapterParams<StateQuery> { }

// By default calls the standard Knex adapter service methods but can be customized with your own functionality.
export class StateService<ServiceParams extends Params = StateParams> extends KnexService<
  State,
  StateData,
  StateParams,
  StatePatch
> {

  async find(params?: ServiceParams & { paginate: false; }): Promise<State[]>
  async find(params?: ServiceParams & { paginate?: { default?: number; max?: number } }): Promise<Paginated<State>>
  async find(params?: ServiceParams): Promise<Paginated<State> | State[]> {
    let states = await super.find(params);

    // return Paginated<State>
    if (!Array.isArray(states)) {
      return states;
    }

    states.forEach(s => {
      // convert string to boolean
      if (s.type === 0) {
        s.value = s.value == 'false' ? false : true;
      }
    });

    return states;
  }
}

export const getOptions = (app: Application): KnexAdapterOptions => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('sqliteClient'),
    name: 'states',
    multi: ['remove', 'create', 'patch']
  }
}
