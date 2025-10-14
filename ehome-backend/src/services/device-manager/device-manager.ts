// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  deviceManagerDataValidator,
  deviceManagerPatchValidator,
  deviceManagerQueryValidator,
  deviceManagerResolver,
  deviceManagerExternalResolver,
  deviceManagerDataResolver,
  deviceManagerPatchResolver,
  deviceManagerQueryResolver
} from './device-manager.schema'

import type { Application } from '../../declarations'
import { DeviceManagerService, getOptions } from './device-manager.class'
import { deviceManagerPath, deviceManagerMethods } from './device-manager.shared'

export * from './device-manager.class'
export * from './device-manager.schema'

import { logPayload } from '../../hooks/log-payload'

// A configure function that registers the service and its hooks via `app.configure`
export const deviceManager = (app: Application) => {
  // Register our service on the Feathers application
  app.use(deviceManagerPath, new DeviceManagerService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: deviceManagerMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(deviceManagerPath).hooks({
    around: {
      all: [
        // logPayload,
        authenticate('jwt'),
        schemaHooks.resolveExternal(deviceManagerExternalResolver),
        schemaHooks.resolveResult(deviceManagerResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(deviceManagerQueryValidator),
        schemaHooks.resolveQuery(deviceManagerQueryResolver)
      ],
      patch: [
        schemaHooks.validateData(deviceManagerPatchValidator),
        schemaHooks.resolveData(deviceManagerPatchResolver)
      ]
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
    [deviceManagerPath]: DeviceManagerService
  }
}
