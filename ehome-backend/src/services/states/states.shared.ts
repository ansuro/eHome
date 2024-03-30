// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { State, StateData, StatePatch, StateQuery, StateService } from './states.class'

export type { State, StateData, StatePatch, StateQuery }

export type StateClientService = Pick<StateService<Params<StateQuery>>, (typeof stateMethods)[number]>

export const statePath = 'states'

export const stateMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const stateClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(statePath, connection.service(statePath), {
    methods: stateMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [statePath]: StateClientService
  }
}
