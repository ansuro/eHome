// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#database-services
import type { Paginated, Params } from '@feathersjs/feathers'
import { KnexService } from '@feathersjs/knex'
import type { KnexAdapterParams, KnexAdapterOptions } from '@feathersjs/knex'

import type { Application } from '../../declarations'
import type { State, StateData, StatePatch, StateQuery } from './states.schema'
import { logger } from '../../logger'
import { app } from '../../app'
import { log } from 'console'

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

  async create(data: StateData, params?: ServiceParams): Promise<State>;
  async create(data: StateData[], params?: ServiceParams): Promise<State[]>;
  async create(
    data: StateData | StateData[],
    params?: ServiceParams
  ): Promise<State | State[]> {
    // Konvertiere einzelnes Objekt zu Array für einheitliche Verarbeitung
    const items = Array.isArray(data) ? data : [data];

    // Verarbeite jedes Item einzeln
    const results = await Promise.all(items.map(async (item) => {
      try {
        // Suche nach existierendem State mit Knex direkt
        const [existingState] = await (this.options.Model as any)
          .select('id')
          .from('states')
          .where({
            name: item.name,
            MAC: item.MAC
          })
          .limit(1);

        let result: State;
        
        // Konvertiere Werte für die Datenbank
        const processedItem = {
          ...item,
          value: item.type === 0 ? String(item.value) : item.value,
          options: item.options ? JSON.stringify(item.options) : undefined
        };

        if (existingState) {
          // Update existierenden State
          logger.info('Updating existing state for MAC %s, name %s', item.MAC, item.name);
          const tmpResult = await super.patch(existingState.id, processedItem);
          result = Array.isArray(tmpResult) ? tmpResult[0] : tmpResult;
        } else {
          // Erstelle neuen State
          logger.info('Creating new state for MAC %s, name %s', item.MAC, item.name);
          result = await super.create(processedItem);
        }

        // Konvertiere Werte zurück für die Antwort
        if (Array.isArray(result)) {

          result.forEach(s => {
            if (s.type === 0) {
              // TODO wird immer zu true, falls false
              s.value = s.value === 'false' ? false : true;
            }
            if (s.options && typeof s.options === 'string') {
              s.options = JSON.parse(s.options);
            }
          });

        } else {
          if (result.type === 0) {
            result.value = result.value === 'false' ? false : true;
          }
          if (result.options && typeof result.options === 'string') {
            result.options = JSON.parse(result.options);
          }
        }

        return result;

      } catch (error) {
        logger.error('Error in updateOrCreate: %o', error);
        throw error;
      }
    }));

    return results;
  }

  async patch(id: null, data: StatePatch, params?: ServiceParams): Promise<State[]>;
  async patch(id: number, data: StatePatch, params?: ServiceParams): Promise<State>;
  async patch(
    id: number | null,
    data: StatePatch,
    params?: ServiceParams
  ): Promise<State | State[]> {

    const processedData = {
      ...data,
      value: data.type === 0 ? (data.value === 'true' ? true : false) : false,
      options: data.options ? JSON.stringify(data.options) : undefined
    };

    logger.info('Patching state with id %s: %o', id, processedData);
    // logger.info('Params: %o', params);
    logger.info('Current data before patch: %o', data);
    const result = await super.patch(id, data, params);
    logger.info('Patched state with id %s: %o', id, result);
    const countListener = app.service('devices').emit('patched', result, params);
    logger.info('Emitted patched event to devices service, listeners count: %d', countListener);

    if (Array.isArray(result)) {
      result.forEach(s => this.convertResult(s));
    } else {
      this.convertResult(result);
    }

    logger.info('Converted patched state with id %s: %o', id, result);

    return result;
  }

  private convertResult(state: State) {
    switch (state.value) {
      case 'true':
        state.value = true;
        logger.info('Converted state value to true string for state id %s', state.id);
        break;

      case 'false':
        state.value = false;
        logger.info('Converted state value to false string for state id %s', state.id);
        break;

      case '0':
        state.value = false;
        logger.info('Converted state value to false 0 for state id %s', state.id);
        break;

      case '1':
        state.value = true;
        logger.info('Converted state value to true 1 for state id %s', state.id);
        break;
    
      default:
        break;
    }
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
