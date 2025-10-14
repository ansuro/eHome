import { HookContext } from '@feathersjs/feathers'

export const logPayload = async (context: HookContext) => {
  console.log('Service:', context.path);
  console.log('Method:', context.method);
  console.log('Payload:', {
    params: context.params,
    data: context.data,
    result: context.result
  });
  return context;
};
