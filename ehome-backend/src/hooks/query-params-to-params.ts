// For more information about this file see https://dove.feathersjs.com/guides/cli/hook.html
import type { HookContext } from '../declarations'
import { logger } from '../logger';

export const queryParamsToParams = async (context: HookContext) => {
  console.log(`Running hook QueryParamsToParams on ${context.path}.${context.method}`)

  if (context.params.query?.hasOwnProperty('$withGroups')) {
    logger.info('$withGroups');
    context.params.$withGroups = context.params.query.$withGroups;
    delete context.params.query.$withGroups;
  }

}
