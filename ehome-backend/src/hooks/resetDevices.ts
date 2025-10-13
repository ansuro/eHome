import { HookContext, NextFunction, Paginated } from "@feathersjs/feathers";
import { User } from "../services/users/users.shared";
import { logger } from "../logger";


export const resetDevices = async (context: HookContext, next: NextFunction) => {
  const deviceService = context.app.service('devices');

  await deviceService.patch(null, { isOnline: false });
  logger.info('All devices have been reset to offline status.');

  await next();
}