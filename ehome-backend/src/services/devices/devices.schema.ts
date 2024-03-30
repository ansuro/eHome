// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { DeviceService } from './devices.class'

// Main data model schema
export const deviceSchema = Type.Object(
  {
    id: Type.Number(),
    MAC: Type.String(),
    name: Type.String(),
    isOnline: Type.Boolean()
  },
  { $id: 'Device', additionalProperties: false }
)
export type Device = Static<typeof deviceSchema>
export const deviceValidator = getValidator(deviceSchema, dataValidator)
export const deviceResolver = resolve<Device, HookContext<DeviceService>>({})

export const deviceExternalResolver = resolve<Device, HookContext<DeviceService>>({})

// Schema for creating new entries
export const deviceDataSchema = Type.Pick(deviceSchema, ['name', 'MAC', 'isOnline'], {
  $id: 'DeviceData'
})
export type DeviceData = Static<typeof deviceDataSchema>
export const deviceDataValidator = getValidator(deviceDataSchema, dataValidator)
export const deviceDataResolver = resolve<Device, HookContext<DeviceService>>({})

// Schema for updating existing entries
export const devicePatchSchema = Type.Partial(deviceSchema, {
  $id: 'DevicePatch'
})
export type DevicePatch = Static<typeof devicePatchSchema>
export const devicePatchValidator = getValidator(devicePatchSchema, dataValidator)
export const devicePatchResolver = resolve<Device, HookContext<DeviceService>>({})

// Schema for allowed query properties
export const deviceQueryProperties = Type.Pick(deviceSchema, ['id', 'name', 'MAC', 'isOnline'])
export const deviceQuerySchema = Type.Intersect(
  [
    querySyntax(deviceQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type DeviceQuery = Static<typeof deviceQuerySchema>
export const deviceQueryValidator = getValidator(deviceQuerySchema, queryValidator)
export const deviceQueryResolver = resolve<DeviceQuery, HookContext<DeviceService>>({})
