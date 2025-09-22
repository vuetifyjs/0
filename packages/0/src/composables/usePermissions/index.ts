// Factories
import { createContext, createPlugin, createTrinity, useContext } from '#v0/factories'

// Composables
import { useTokens } from '#v0/composables/useTokens'

// Adapters
import { Vuetify0PermissionAdapter } from './adapters/v0'

// Utilities
import { toArray } from '#v0/transformers'

// Types
import type { TokenContext, TokenTicket } from '#v0/composables/useTokens'
import type { PermissionAdapter } from './adapters/adapter'
import type { App } from 'vue'
import type { ID } from '#v0/types'

export interface PermissionTicket extends TokenTicket {
  value: boolean | ((context: Record<string, any>) => boolean)
}

export interface PermissionContext<Z extends PermissionTicket = PermissionTicket> extends TokenContext<Z> {
  can: (id: ID, action: string, subject: string, context?: Record<string, any>) => boolean
}

export interface PermissionOptions extends PermissionPluginOptions {}

export interface PermissionPluginOptions {
  adapter?: PermissionAdapter
  permissions?: Record<ID, any>
}

/**
 *
 * @param namespace The namespace for the permissions context
 * @param options Configure initial permissions and adapter
 * @template Z The type of permission ticket
 * @template E The type of permission context
 * @returns A context trinity for the permissions context
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-permissions
 */
export function createPermissions<
  Z extends PermissionTicket = PermissionTicket,
  E extends PermissionContext<Z> = PermissionContext<Z>,
> (
  namespace = 'v0:permissions',
  options: PermissionOptions = {},
) {
  const { adapter = new Vuetify0PermissionAdapter(), permissions = {} } = options
  const [usePermissionsContext, _providePermissionsContext] = createContext<E>(namespace)

  const record: Record<string, Record<string, Record<string, any>>> = {}
  for (const role in permissions) {
    if (!record[role]) record[role] = {}
    for (const [actions, subjects, condition = true] of permissions[role]!) {
      for (const action of toArray(actions)) {
        for (const subject of toArray(subjects)) {
          if (!record[role][action]) record[role][action] = {}

          record[role][action][subject] = condition
        }
      }
    }
  }

  const tokens = useTokens<Z, E>(record)

  function can (id: ID, action: string, subject: string, context: Record<string, any> = {}) {
    return adapter.can(id, action, subject, context, tokens)
  }

  const context = {
    ...tokens,
    can,
  } as E

  function providePermissionsContext (_context: E = context, app?: App) {
    return _providePermissionsContext(_context, app)
  }

  return createTrinity<E>(usePermissionsContext, providePermissionsContext, context)
}

/**
 * Simple hook to access the permissions context
 *
 * @returns The permissions context
 * @template Z The type of permission ticket
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-permissions
 */
export function usePermissions<Z extends PermissionTicket = PermissionTicket> (): PermissionContext<Z> {
  return useContext<PermissionContext<Z>>('v0:permissions')
}

/**
 * Factory function to create a permissions plugin
 *
 * @param options Configuration options for the permissions plugin
 * @template Z The type of permission ticket
 * @template E The type of permission context
 * @returns A Vue plugin object for permissions management
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-permissions
 */
export function createPermissionsPlugin<
  Z extends PermissionTicket = PermissionTicket,
  E extends PermissionContext<Z> = PermissionContext<Z>,
> (options: PermissionOptions = {}) {
  const [, providePermissionContext, context] = createPermissions<Z, E>('v0:permissions', options)

  return createPlugin({
    namespace: 'v0:permissions',
    provide: (app: App) => {
      providePermissionContext(context, app)
    },
  })
}
