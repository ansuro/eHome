// Initializes the `password` service on path `/password`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Password } from './password.class';
import hooks from './password.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'password': Password & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/password', new Password(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('password');

  service.hooks(hooks);
}
