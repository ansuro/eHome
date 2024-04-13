// For more information about this file see https://dove.feathersjs.com/guides/cli/service.shared.html
import type { Params } from '@feathersjs/feathers'
import type { ClientApplication } from '../../client'
import type {
  Membership,
  MembershipData,
  MembershipPatch,
  MembershipQuery,
  MembershipService
} from './membership.class'

export type { Membership, MembershipData, MembershipPatch, MembershipQuery }

export type MembershipClientService = Pick<
  MembershipService<Params<MembershipQuery>>,
  (typeof membershipMethods)[number]
>

export const membershipPath = 'membership'

export const membershipMethods = ['find', 'get', 'create', 'patch', 'remove'] as const

export const membershipClient = (client: ClientApplication) => {
  const connection = client.get('connection')

  client.use(membershipPath, connection.service(membershipPath), {
    methods: membershipMethods
  })
}

// Add this service to the client service type index
declare module '../../client' {
  interface ServiceTypes {
    [membershipPath]: MembershipClientService
  }
}
