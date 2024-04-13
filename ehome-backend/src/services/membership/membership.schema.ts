// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { MembershipService } from './membership.class'

// Main data model schema
export const membershipSchema = Type.Object(
  {
    id: Type.Number(),
    uid: Type.Number(),
    gid: Type.Number()
  },
  { $id: 'Membership', additionalProperties: false }
)
export type Membership = Static<typeof membershipSchema>
export const membershipValidator = getValidator(membershipSchema, dataValidator)
export const membershipResolver = resolve<Membership, HookContext<MembershipService>>({})

export const membershipExternalResolver = resolve<Membership, HookContext<MembershipService>>({})

// Schema for creating new entries
export const membershipDataSchema = Type.Pick(membershipSchema, ['uid', 'gid'], {
  $id: 'MembershipData'
})
export type MembershipData = Static<typeof membershipDataSchema>
export const membershipDataValidator = getValidator(membershipDataSchema, dataValidator)
export const membershipDataResolver = resolve<Membership, HookContext<MembershipService>>({})

// Schema for updating existing entries
export const membershipPatchSchema = Type.Partial(membershipSchema, {
  $id: 'MembershipPatch'
})
export type MembershipPatch = Static<typeof membershipPatchSchema>
export const membershipPatchValidator = getValidator(membershipPatchSchema, dataValidator)
export const membershipPatchResolver = resolve<Membership, HookContext<MembershipService>>({})

// Schema for allowed query properties
export const membershipQueryProperties = Type.Pick(membershipSchema, ['id', 'uid', 'gid'])
export const membershipQuerySchema = Type.Intersect(
  [
    querySyntax(membershipQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)
export type MembershipQuery = Static<typeof membershipQuerySchema>
export const membershipQueryValidator = getValidator(membershipQuerySchema, queryValidator)
export const membershipQueryResolver = resolve<MembershipQuery, HookContext<MembershipService>>({})
