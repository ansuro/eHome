// // For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import { resolve, virtual } from '@feathersjs/schema'
import { Type, getValidator, querySyntax } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'
import { passwordHash } from '@feathersjs/authentication-local'

import type { HookContext } from '../../declarations'
import { dataValidator, queryValidator } from '../../validators'
import type { UserService } from './users.class'
import { logger } from '../../logger'
import { Group, groupSchema } from '../groups/groups.schema'


// Main data model schema
export const userSchema = Type.Object(
  {
    id: Type.Number(),
    username: Type.String(),
    password: Type.Optional(Type.String()),
    isAdmin: Type.Boolean(),
    userGroups: Type.Optional(Type.Array(Type.Ref(groupSchema)))
  },
  { $id: 'User', additionalProperties: false }
)
export type User = Static<typeof userSchema>
export const userValidator = getValidator(userSchema, dataValidator)
export const userResolver = resolve<User, HookContext<UserService>>({
  // userGroups: virtual(async (user, context) => {
  //   logger.info('%o', context.params.query);

  //   if (!context.params.$withGroups) {
  //     // logger.info('$withGroups');
  //     return;
  //   }

  //   const gids = await context.app.service('membership').find({
  //     user: user,
  //     paginate: false,
  //     query: {
  //       uid: user.id,
  //       $select: ['gid']
  //     }
  //   });

  //   const groups = await context.app.service('groups').find({
  //     user: user,
  //     paginate: false,
  //     query: {
  //       id: {
  //         $in: gids.flatMap(g => g.gid)
  //       }
  //     }
  //   });

  //   return groups;
  // })
})

export const userExternalResolver = resolve<User, HookContext<UserService>>({
  // The password should never be visible externally
  password: async () => undefined
})

// Schema for creating new entries
export const userDataSchema = Type.Pick(userSchema, ['username', 'password', 'isAdmin', 'userGroups'], {
  $id: 'UserData'
})
export type UserData = Static<typeof userDataSchema>
export const userDataValidator = getValidator(userDataSchema, dataValidator)
export const userDataResolver = resolve<User, HookContext<UserService>>({
  password: passwordHash({ strategy: 'local' })
})

// Schema for updating existing entries
export const userPatchSchema = Type.Partial(userSchema, {
  $id: 'UserPatch'
})
export type UserPatch = Static<typeof userPatchSchema>
export const userPatchValidator = getValidator(userPatchSchema, dataValidator)
export const userPatchResolver = resolve<User, HookContext<UserService>>({
  password: passwordHash({ strategy: 'local' })
})

// Schema for allowed query properties
export const userQueryProperties = Type.Pick(userSchema, ['id', 'username'])
export const userQuerySchema = Type.Intersect(
  [
    querySyntax(userQueryProperties),
    // Add additional query properties here
    Type.Object({
      $paginate: Type.Optional(Type.Boolean()),
      $withGroups: Type.Optional(Type.Boolean())
    }, { additionalProperties: true })
  ],
  { additionalProperties: true }
)
export type UserQuery = Static<typeof userQuerySchema>
export const userQueryValidator = getValidator(userQuerySchema, queryValidator)
export const userQueryResolver = resolve<UserQuery, HookContext<UserService>>({
  // If there is a user (e.g. with authentication), they are only allowed to see their own data
  id: async (value, user, context) => {
    if (context.params.user) {
      if (context.params.user.isAdmin) {
        return value;
      } else {
        return context.params.user.id
      }
    }

    return value
  }
})
