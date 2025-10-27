import type { ID } from '#v0/types'
import type { PermissionContext, PermissionTicket } from '..'

export interface PermissionAdapterInterface {
  can: <Z extends PermissionTicket = PermissionTicket>(
    role: ID,
    action: string,
    subject: string,
    context: Record<string, any>,
    permissions: PermissionContext<Z>,
  ) => boolean
}

export abstract class PermissionAdapter implements PermissionAdapterInterface {
  abstract can<Z extends PermissionTicket = PermissionTicket> (
    role: ID,
    action: string,
    subject: string,
    context: Record<string, any>,
    permissions: PermissionContext<Z>
  ): boolean
}
