// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  deviceDataValidator,
  devicePatchValidator,
  deviceQueryValidator,
  deviceResolver,
  deviceExternalResolver,
  deviceDataResolver,
  devicePatchResolver,
  deviceQueryResolver
} from './devices.schema'

import type { Application } from '../../declarations'
import { DeviceService, getOptions } from './devices.class'
import { devicePath, deviceMethods } from './devices.shared'

export * from './devices.class'
export * from './devices.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const device = (app: Application) => {
  // Register our service on the Feathers application
  app.use(devicePath, new DeviceService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deviceMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(devicePath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(deviceExternalResolver),
        schemaHooks.resolveResult(deviceResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(deviceQueryValidator), schemaHooks.resolveQuery(deviceQueryResolver)],
      find: [],
      get: [],
      create: [schemaHooks.validateData(deviceDataValidator), schemaHooks.resolveData(deviceDataResolver)],
      patch: [schemaHooks.validateData(devicePatchValidator), schemaHooks.resolveData(devicePatchResolver)],
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
    [devicePath]: DeviceService
  }
}
