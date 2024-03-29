// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  passwordDataValidator,
  passwordPatchValidator,
  passwordQueryValidator,
  passwordResolver,
  passwordExternalResolver,
  passwordDataResolver,
  passwordPatchResolver,
  passwordQueryResolver
} from './password.schema'

import type { Application } from '../../declarations'
import { PasswordService, getOptions } from './password.class'
import { passwordPath, passwordMethods } from './password.shared'

export * from './password.class'
export * from './password.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const password = (app: Application) => {
  // Register our service on the Feathers application
  app.use(passwordPath, new PasswordService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: passwordMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(passwordPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(passwordExternalResolver),
        schemaHooks.resolveResult(passwordResolver)
      ]
    },
    before: {
      all: [
        schemaHooks.validateQuery(passwordQueryValidator),
        schemaHooks.resolveQuery(passwordQueryResolver)
      ],
      find: [],
      get: [],
      create: [
        schemaHooks.validateData(passwordDataValidator),
        schemaHooks.resolveData(passwordDataResolver)
      ],
      patch: [
        schemaHooks.validateData(passwordPatchValidator),
        schemaHooks.resolveData(passwordPatchResolver)
      ],
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
    [passwordPath]: PasswordService
  }
}
