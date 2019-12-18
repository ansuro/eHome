import { Application } from '../declarations';
import users from './users/users.service';
import devices from './devices/devices.service';
import deviceManager from './device-manager/device-manager.service';
import log from './log/log.service';
import groups from './groups/groups.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application) {
  app.configure(users);
  app.configure(devices);
  app.configure(deviceManager);
  app.configure(log);
  app.configure(groups);
}
