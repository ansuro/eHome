// For more information about this file see https://dove.feathersjs.com/guides/cli/service.html
import { authenticate } from '@feathersjs/authentication'

import { hooks as schemaHooks } from '@feathersjs/schema'

import {
  groupDataValidator,
  groupPatchValidator,
  groupQueryValidator,
  groupResolver,
  groupExternalResolver,
  groupDataResolver,
  groupPatchResolver,
  groupQueryResolver,
  Group
} from './groups.schema'

import type { Application, HookContext } from '../../declarations'
import { GroupService, getOptions } from './groups.class'
import { groupPath, groupMethods } from './groups.shared'
import { logger } from '../../logger'
import { NotAuthenticated } from '@feathersjs/errors'
import { Membership } from '../membership/membership.schema'

export * from './groups.class'
export * from './groups.schema'

// A configure function that registers the service and its hooks via `app.configure`
export const group = (app: Application) => {
  // Register our service on the Feathers application
  app.use(groupPath, new GroupService(getOptions(app)), {
    // A list of all methods this service exposes externally
    methods: groupMethods,
    // You can add additional custom events to be sent to clients here
    events: []
  })
  // Initialize hooks
  app.service(groupPath).hooks({
    around: {
      all: [
        authenticate('jwt'),
        schemaHooks.resolveExternal(groupExternalResolver),
        schemaHooks.resolveResult(groupResolver)
      ]
    },
    before: {
      all: [schemaHooks.validateQuery(groupQueryValidator), schemaHooks.resolveQuery(groupQueryResolver)],
      find: [async (context: HookContext) => {
        // logger.info("%o", context.toJSON());
        // logger.info("%o", context.params.query);

        const { findAll } = context.params.query;
        delete context.params.query.findAll;
        logger.info('findAll: %s', findAll);

        const { user } = context.params;
        if (user == undefined) {
          throw new NotAuthenticated();
        }
// logger.info('USER ID: %s', user.id);
        if (user.isAdmin && findAll !== undefined && findAll) {
          // find all..
          logger.info('found findAll on admin request. returning all groups.');
          return;
        }

        const gids = await context.app.service('membership').find({
          paginate: false,
          query: {
            uid: user.id,
            $select: ['gid']
          }
        });

        // logger.info('returning user groups: %o', gids);

        context.params.query = {
          ...context.params.query,
          id: {
            $in: gids.flatMap(i => i.gid)
          }
        };

        // logger.info("%o", context.params.query);
      }],
      get: [],
      create: [schemaHooks.validateData(groupDataValidator), schemaHooks.resolveData(groupDataResolver)],
      patch: [schemaHooks.validateData(groupPatchValidator), schemaHooks.resolveData(groupPatchResolver)],
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
    [groupPath]: GroupService
  }
}
