// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import { Forbidden } from '@feathersjs/errors';
import logger from '../logger';

// TODO check again later..
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    const { provider, user } = context.params;

    if (provider && user) {
      if (!user.admin) {
        throw new Forbidden();
      }
    }

    return context;
  };
}
