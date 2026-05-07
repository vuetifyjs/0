// Utilities
import { isFunction } from '#v0/utilities'

// Types
import type { ID } from '#v0/types'
import type { PermissionContext, PermissionTicket } from '..'

import { PermissionsAdapter } from './adapter'

export class V0PermissionsAdapter extends PermissionsAdapter {
  constructor () {
    super()
  }

  can<Z extends PermissionTicket = PermissionTicket> (
    role: ID,
    action: string,
    subject: string,
    context: Record<string, unknown>,
    permissions: PermissionContext<Z>,
  ): boolean {
    const access = `${role}.${action}.${subject}`

    const ticket = permissions.get(access)

    if (!ticket || !ticket.value) return false

    return isFunction(ticket.value) ? ticket.value(context) : ticket.value
  }
}
