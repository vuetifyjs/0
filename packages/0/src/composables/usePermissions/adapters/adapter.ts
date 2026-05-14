// Types
import type { ID } from '#v0/types'
import type { PermissionContext, PermissionTicket } from '..'

export abstract class PermissionsAdapter {
  abstract can<Z extends PermissionTicket = PermissionTicket> (
    role: ID,
    action: string,
    subject: string,
    context: Record<string, unknown>,
    permissions: PermissionContext<Z>
  ): boolean
}
