import { state } from './states/states'
import { password } from './password/password'
import { group } from './groups/groups'
import { device } from './devices/devices'
import { deviceManager } from './device-manager/device-manager'
import { user } from './users/users'
// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions
import type { Application } from '../declarations'

export const services = (app: Application) => {
  app.configure(state)
  app.configure(password)
  app.configure(group)
  app.configure(device)
  app.configure(deviceManager)
  app.configure(user)
  // All services will be registered here
}
