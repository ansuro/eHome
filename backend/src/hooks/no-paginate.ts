// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import logger from '../logger';
/*
Remove pagination via client
client.service('users').find({
      query: {
        $paginate: false
      }
    })
*/
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    if (context.params.query && context.params.query.hasOwnProperty('$paginate')) {
      context.params.paginate = context.params.query.$paginate;
      delete context.params.query.$paginate;
    }

    return context;
  };
}
