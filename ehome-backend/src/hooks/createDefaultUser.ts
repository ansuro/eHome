import { HookContext, NextFunction, Paginated } from "@feathersjs/feathers";
import { User } from "../services/users/users.shared";
import { logger } from "../logger";


export const createDefaultUser = async (context: HookContext, next: NextFunction) => {
  const userService = context.app.service('users');

  const usercount = await userService.find({
    query: {
      $limit: 0
    }
  }) as Paginated<User>;
logger.info("user count: %s", usercount);
  if (usercount.total == 0) {
    logger.info('Creating default users...');
    await userService.create({ username: 'admin', password: 'password', isAdmin: true });
    await userService.create({ username: 'admin2', password: 'password', isAdmin: true });
    await userService.create({ username: 'user', password: 'password', isAdmin: false });
    logger.info('Default users created');
  } else {
    logger.info('Users found. Not creating default users...');
  }

  await next();
}