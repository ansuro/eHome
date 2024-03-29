// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type {
  DeviceManager,
  DeviceManagerData,
  DeviceManagerPatch,
  DeviceManagerQuery
} from './device-manager.schema'

export type { DeviceManager, DeviceManagerData, DeviceManagerPatch, DeviceManagerQuery }

export interface DeviceManagerServiceOptions {
  app: Application
}

export interface DeviceManagerParams extends Params<DeviceManagerQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class DeviceManagerService<ServiceParams extends DeviceManagerParams = DeviceManagerParams>
  implements ServiceInterface<DeviceManager, DeviceManagerData, ServiceParams, DeviceManagerPatch>
{
  constructor(public options: DeviceManagerServiceOptions) {}

  async find(_params?: ServiceParams): Promise<DeviceManager[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<DeviceManager> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: DeviceManagerData, params?: ServiceParams): Promise<DeviceManager>
  async create(data: DeviceManagerData[], params?: ServiceParams): Promise<DeviceManager[]>
  async create(
    data: DeviceManagerData | DeviceManagerData[],
    params?: ServiceParams
  ): Promise<DeviceManager | DeviceManager[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: DeviceManagerData, _params?: ServiceParams): Promise<DeviceManager> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: DeviceManagerPatch, _params?: ServiceParams): Promise<DeviceManager> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<DeviceManager> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
