// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'

export const paginate = async (context: HookContext) => {
  // console.log(`Running hook paginate on ${context.path}.${context.method}`)

  if (context.params.query && context.params.query.hasOwnProperty('$paginate')) {
    context.params.paginate = context.params.query.$paginate === 'false' || context.params.query.$paginate === false;
    delete context.params.query.$paginate;
  }
}
