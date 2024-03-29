// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { PasswordService } from './password.class'

// Main data model schema
export const passwordSchema = Type.Object(
  {
    id: Type.Number(),
    text: Type.String()
  },
  { $id: 'Password', additionalProperties: false }
)
export type Password = Static<typeof passwordSchema>
export const passwordValidator = getValidator(passwordSchema, dataValidator)
export const passwordResolver = resolve<Password, HookContext<PasswordService>>({})

export const passwordExternalResolver = resolve<Password, HookContext<PasswordService>>({})

// Schema for creating new entries
export const passwordDataSchema = Type.Pick(passwordSchema, ['text'], {
  $id: 'PasswordData'
})
export type PasswordData = Static<typeof passwordDataSchema>
export const passwordDataValidator = getValidator(passwordDataSchema, dataValidator)
export const passwordDataResolver = resolve<Password, HookContext<PasswordService>>({})

// Schema for updating existing entries
export const passwordPatchSchema = Type.Partial(passwordSchema, {
  $id: 'PasswordPatch'
})
export type PasswordPatch = Static<typeof passwordPatchSchema>
export const passwordPatchValidator = getValidator(passwordPatchSchema, dataValidator)
export const passwordPatchResolver = resolve<Password, HookContext<PasswordService>>({})

// Schema for allowed query properties
export const passwordQueryProperties = Type.Pick(passwordSchema, ['id', 'text'])
export const passwordQuerySchema = Type.Intersect(
  [
    querySyntax(passwordQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type PasswordQuery = Static<typeof passwordQuerySchema>
export const passwordQueryValidator = getValidator(passwordQuerySchema, queryValidator)
export const passwordQueryResolver = resolve<PasswordQuery, HookContext<PasswordService>>({})
