// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type { Password, PasswordData, PasswordPatch, PasswordQuery, PasswordService } from './password.class'

export type { Password, PasswordData, PasswordPatch, PasswordQuery }

export type PasswordClientService = Pick<
  PasswordService<Params<PasswordQuery>>,
  (typeof passwordMethods)[number]
>

export const passwordPath = 'password'

export const passwordMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const passwordClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(passwordPath, connection.service(passwordPath), {
    methods: passwordMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [passwordPath]: PasswordClientService
  }
}
