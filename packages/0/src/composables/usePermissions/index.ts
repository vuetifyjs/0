// Factories
import { createContext, useContext } from '#v0/composables/createContext'
import { createPlugin } from '#v0/composables/createPlugin'
import { createTrinity } from '#v0/composables/createTrinity'

// Composables
import { useTokens } from '#v0/composables/useTokens'

// Adapters
import { Vuetify0PermissionAdapter } from '#v0/composables/usePermissions/adapters/v0'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { TokenContext, TokenTicket } from '#v0/composables/useTokens'
import type { PermissionAdapter } from '#v0/composables/usePermissions/adapters/adapter'
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
 * Creates a new permissions instance.
 *
 * @param namespace The namespace for the permissions instance.
 * @param options The options for the permissions instance.
 * @template Z The type of the permission ticket.
 * @template E The type of the permission context.
 * @returns A new permissions instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/create-permissions
 * @example
 * ```ts
 * const { can } = createPermissions('v0:permissions', {
 *   permissions: {
 *     admin: [['read', 'users']],
 *     editor: [['edit', 'posts']],
 *   }
 * })
 *
 * console.log(can('admin', 'read', 'users')) // true
 * console.log(can('editor', 'delete', 'posts')) // false
 * ```
 *
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
 * Returns the current permissions instance.
 *
 * @template Z The type of the permission ticket.
 * @returns The current permissions instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-permissions
 * @example
 * ```ts
 * const { can } = usePermissions()
 *
 * console.log(can('admin', 'read', 'users'))
 * ```
 */
export function usePermissions<Z extends PermissionTicket = PermissionTicket> (): PermissionContext<Z> {
  return useContext<PermissionContext<Z>>('v0:permissions')
}

/**
 * Creates a new permissions plugin.
 *
 * @param options The options for the permissions plugin.
 * @template Z The type of the permission ticket.
 * @template E The type of the permission context.
 * @returns A new permissions plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-permissions
 * @example
 * ```ts
 *   app.use(
 *     createPermissionsPlugin({
 *       permissions: {
 *         admin: [['read', 'users']],
 *       },
 *     }),
 *   )
 * ```
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
