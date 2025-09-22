// Adapters
import { PermissionAdapter } from './adapter'

// Utilities
import { isFunction } from '#v0/utilities'

// Types
import type { PermissionContext, PermissionTicket } from '..'
import type { ID } from '#v0/types'

export class Vuetify0PermissionAdapter extends PermissionAdapter {
  constructor () {
    super()
  }

  can<Z extends PermissionTicket = PermissionTicket> (
    role: ID,
    action: string,
    subject: string,
    context: Record<string, any>,
    permissions: PermissionContext<Z>,
  ): boolean {
    const access = `${role}.${action}.${subject}`

    const ticket = permissions.get(access)

    if (!ticket || !ticket.value) return false

    return isFunction(ticket.value) ? ticket.value(context) : ticket.value
  }
}
