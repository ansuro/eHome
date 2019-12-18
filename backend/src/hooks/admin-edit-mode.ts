// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

/*
If the user is admin, he can edit the whole dataset or
get just his specific data
*/
export default (options = {}): Hook => {
  return async (context: HookContext) => {
    if (context.params.query && context.params.query.hasOwnProperty('$edit')) {
      context.params.edit = context.params.query.$edit;
      delete context.params.query.$edit;
    }
    return context;
  };
}
