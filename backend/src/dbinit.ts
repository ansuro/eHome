import { Application } from "./declarations";
import logger from "./logger";
import { Paginated } from "@feathersjs/feathers";
import { UserData } from "./services/users/users.class";


export default async function (app: Application) {
  const userService = app.service('users');

  const usercount = await userService.find({
    query: {
      $limit: 0
    }
  }) as Paginated<UserData>;

  if (usercount.total == 0) {
    logger.info('Creating default users...');
    await userService.create({ username: 'admin', password: 'password', admin: true });
    await userService.create({ username: 'user', password: 'password', admin: false });
  }
}
