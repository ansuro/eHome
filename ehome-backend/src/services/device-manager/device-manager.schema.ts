// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { DeviceManagerService } from './device-manager.class'

// Main data model schema
export const deviceManagerSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'DeviceManager', additionalProperties: false }
)
export type DeviceManager = Static<typeof deviceManagerSchema>
export const deviceManagerValidator = getValidator(deviceManagerSchema, dataValidator)
export const deviceManagerResolver = resolve<DeviceManager, HookContext<DeviceManagerService>>({})

export const deviceManagerExternalResolver = resolve<DeviceManager, HookContext<DeviceManagerService>>({})

// Schema for creating new entries
export const deviceManagerDataSchema = Type.Pick(deviceManagerSchema, ['text'], {
  $id: 'DeviceManagerData'
})
export type DeviceManagerData = Static<typeof deviceManagerDataSchema>
export const deviceManagerDataValidator = getValidator(deviceManagerDataSchema, dataValidator)
export const deviceManagerDataResolver = resolve<DeviceManager, HookContext<DeviceManagerService>>({})

// Schema for updating existing entries
export const deviceManagerPatchSchema = Type.Partial(deviceManagerSchema, {
  $id: 'DeviceManagerPatch'
})
export type DeviceManagerPatch = Static<typeof deviceManagerPatchSchema>
export const deviceManagerPatchValidator = getValidator(deviceManagerPatchSchema, dataValidator)
export const deviceManagerPatchResolver = resolve<DeviceManager, HookContext<DeviceManagerService>>({})

// Schema for allowed query properties
export const deviceManagerQueryProperties = Type.Pick(deviceManagerSchema, ['id', 'text'])
export const deviceManagerQuerySchema = Type.Intersect(
  [
    querySyntax(deviceManagerQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type DeviceManagerQuery = Static<typeof deviceManagerQuerySchema>
export const deviceManagerQueryValidator = getValidator(deviceManagerQuerySchema, queryValidator)
export const deviceManagerQueryResolver = resolve<DeviceManagerQuery, HookContext<DeviceManagerService>>({})
