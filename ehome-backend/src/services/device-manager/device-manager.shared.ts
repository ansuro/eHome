// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  DeviceManager,
  DeviceManagerData,
  DeviceManagerPatch,
  DeviceManagerQuery,
  DeviceManagerService
} from './device-manager.class'

export type { DeviceManager, DeviceManagerData, DeviceManagerPatch, DeviceManagerQuery }

export type DeviceManagerClientService = Pick<
  DeviceManagerService<Params<DeviceManagerQuery>>,
  (typeof deviceManagerMethods)[number]
>

export const deviceManagerPath = 'device-manager'

export const deviceManagerMethods = ['patch'] as const

export const deviceManagerClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(deviceManagerPath, connection.service(deviceManagerPath), {
    methods: deviceManagerMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [deviceManagerPath]: DeviceManagerClientService
  }
}
