// Initializes the `DeviceManager` service on path `/devicemanager`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { DeviceManager } from './device-manager.class';
import hooks from './device-manager.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'devicemanager': DeviceManager & ServiceAddons<any>;
  }
}

export default function (app: Application) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/devicemanager', new DeviceManager(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('devicemanager');

  service.hooks(hooks);
}
