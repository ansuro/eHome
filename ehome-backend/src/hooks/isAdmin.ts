import { Forbidden, NotAuthenticated } from "@feathersjs/errors";
import { HookContext } from "@feathersjs/feathers";
import { logger } from "../logger";


export const isAdmin = async (context: HookContext) => {
  const { user } = context.params;
  if (user == undefined) {
    throw new NotAuthenticated();
  }

  if (!user.isAdmin) {
    // find all..
    logger.info('only admin allowed.');
    throw new Forbidden();
  }

  return context;
}
