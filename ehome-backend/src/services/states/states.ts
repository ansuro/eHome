// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  stateDataValidator,
  statePatchValidator,
  stateQueryValidator,
  stateResolver,
  stateExternalResolver,
  stateDataResolver,
  statePatchResolver,
  stateQueryResolver
} from './states.schema'

import type { Application } from '../../declarations'
import { StateService, getOptions } from './states.class'
import { statePath, stateMethods } from './states.shared'

export * from './states.class'
export * from './states.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const state = (app: Application) => {
  // Register our service on the Feathers application
  app.use(statePath, new StateService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: stateMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(statePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(stateExternalResolver),
        schemaHooks.resolveResult(stateResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(stateQueryValidator), schemaHooks.resolveQuery(stateQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(stateDataValidator), schemaHooks.resolveData(stateDataResolver)],
      patch: [schemaHooks.validateData(statePatchValidator), schemaHooks.resolveData(statePatchResolver)],
      remove: []
    },
    after: {
      all: []
    },
    error: {
      all: []
    }
  })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [statePath]: StateService
  }
}
