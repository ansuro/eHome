// For more information about this file see https://dove.feathersjs.com/guides/cli/service.class.html#custom-services
import type { Id, NullableId, Params, ServiceInterface } from '@feathersjs/feathers'

import type { Application } from '../../declarations'
import type { Password, PasswordData, PasswordPatch, PasswordQuery } from './password.schema'

export type { Password, PasswordData, PasswordPatch, PasswordQuery }

export interface PasswordServiceOptions {
  app: Application
}

export interface PasswordParams extends Params<PasswordQuery> {}

// This is a skeleton for a custom service class. Remove or add the methods you need here
export class PasswordService<ServiceParams extends PasswordParams = PasswordParams>
  implements ServiceInterface<Password, PasswordData, ServiceParams, PasswordPatch>
{
  constructor(public options: PasswordServiceOptions) {}

  async find(_params?: ServiceParams): Promise<Password[]> {
    return []
  }

  async get(id: Id, _params?: ServiceParams): Promise<Password> {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }

  async create(data: PasswordData, params?: ServiceParams): Promise<Password>
  async create(data: PasswordData[], params?: ServiceParams): Promise<Password[]>
  async create(data: PasswordData | PasswordData[], params?: ServiceParams): Promise<Password | Password[]> {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id: NullableId, data: PasswordData, _params?: ServiceParams): Promise<Password> {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id: NullableId, data: PasswordPatch, _params?: ServiceParams): Promise<Password> {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id: NullableId, _params?: ServiceParams): Promise<Password> {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app: Application) => {
  return { app }
}
