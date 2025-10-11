// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { StateService } from './states.class'

// Main data model schema
export const stateSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String(),
    MAC: Type.String(),
    value: Type.Union([Type.String(), Type.Boolean()]),
    type: Type.Number(),
    options: Type.Optional(
      Type.Union([Type.String(), Type.Array(Type.String())])
    )
  },
  { $id: 'State', additionalProperties: false }
)
export type State = Static<typeof stateSchema>
export const stateValidator = getValidator(stateSchema, dataValidator)
export const stateResolver = resolve<State, HookContext<StateService>>({})

export const stateExternalResolver = resolve<State, HookContext<StateService>>({})

// Schema for creating new entries
export const stateDataSchema = Type.Pick(stateSchema, ['name', 'MAC', 'value', 'type', 'options'], {
  $id: 'StateData'
})
export type StateData = Static<typeof stateDataSchema>
export const stateDataValidator = getValidator(stateDataSchema, dataValidator)
export const stateDataResolver = resolve<State, HookContext<StateService>>({})

// Schema for updating existing entries
export const statePatchSchema = Type.Partial(stateSchema, {
  $id: 'StatePatch'
})
export type StatePatch = Static<typeof statePatchSchema>
export const statePatchValidator = getValidator(statePatchSchema, dataValidator)
export const statePatchResolver = resolve<State, HookContext<StateService>>({})

// Schema for allowed query properties
export const stateQueryProperties = Type.Pick(stateSchema, ['name', 'MAC'])
export const stateQuerySchema = Type.Intersect(
  [
    querySyntax(stateQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type StateQuery = Static<typeof stateQuerySchema>
export const stateQueryValidator = getValidator(stateQuerySchema, queryValidator)
export const stateQueryResolver = resolve<StateQuery, HookContext<StateService>>({})
