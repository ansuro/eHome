import { NotAuthenticated } from '@feathersjs/errors';
import type { HookContext } from '../declarations'
import { logger } from '../logger';

export const findAll = async (context: HookContext) => {
  // logger.info("%o", context.toJSON());
  // logger.info("%o", context.params.query);

  const { findAll } = context.params.query;
  delete context.params.query.findAll;

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
}