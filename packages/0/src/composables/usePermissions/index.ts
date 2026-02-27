/**
 * @module usePermissions
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-permissions
 *
 * @remarks
 * Permission management composable with support for RBAC and ABAC patterns.
 *
 * Key features:
 * - Role-Based Access Control (RBAC) support
 * - Attribute-Based Access Control (ABAC) with context
 * - Functional permission conditions
 * - Token-based permission storage
 * - Adapter pattern for custom permission systems
 *
 * Built on useTokens for flexible permission configuration.
 */

// Foundational
import { createPluginContext } from '#v0/composables/createPlugin'

// Composables
import { createTokens } from '#v0/composables/createTokens'

// Adapters
import { Vuetify0PermissionAdapter } from '#v0/composables/usePermissions/adapters'

// Transformers
import { toArray } from '#v0/composables/toArray'

// Types
import type { TokenContext, TokenOptions, TokenTicket } from '#v0/composables/createTokens'
import type { PermissionAdapter } from '#v0/composables/usePermissions/adapters'
import type { ID } from '#v0/types'

// Exports
export { PermissionAdapter } from '#v0/composables/usePermissions/adapters'

export type { PermissionAdapterInterface } from '#v0/composables/usePermissions/adapters'

export interface PermissionTicket extends TokenTicket<boolean | ((context: Record<string, any>) => boolean)> {}

export interface PermissionContext<Z extends PermissionTicket = PermissionTicket> extends TokenContext<Z> {
  can: (id: ID, action: string, subject: string, context?: Record<string, any>) => boolean
}

export interface PermissionOptions extends TokenOptions {
  adapter?: PermissionAdapter
  permissions?: Record<ID, any>
}

export interface PermissionContextOptions extends PermissionOptions {
  namespace?: string
}

export interface PermissionPluginOptions extends PermissionContextOptions {}

/**
 * Creates a new permissions instance.
 *
 * @param options The options for the permissions instance.
 * @template Z The type of the permission ticket.
 * @template E The type of the permission context.
 * @returns A new permissions instance.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-permissions
 *
 * @example
 * ```ts
 * import { createPermissions } from '@vuetify/v0'
 *
 * const [usePermissions, providePermissions] = createPermissions({
 *   namespace: 'v0:permissions',
 *   permissions: {
 *     admin: [['read', 'users']],
 *     editor: [['edit', 'posts']],
 *   },
 * })
 * ```
 */
export function createPermissions<
  Z extends PermissionTicket = PermissionTicket,
  E extends PermissionContext<Z> = PermissionContext<Z>,
> (_options: PermissionOptions = {}): E {
  const { adapter = new Vuetify0PermissionAdapter(), permissions = {}, ...options } = _options

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

  const tokens = createTokens<Z, E>(record, options)

  function can (id: ID, action: string, subject: string, context: Record<string, any> = {}) {
    return adapter.can(id, action, subject, context, tokens)
  }

  return {
    ...tokens,
    can,
  } as E
}

/**
 * Creates a new permissions context.
 *
 * @param options The options for the permissions context.
 * @template Z The type of the permission ticket.
 * @template E The type of the permission context.
 * @returns A new permissions context.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-permissions
 *
 * @example
 * ```ts
 * import { createPermissionsContext } from '@vuetify/v0'
 *
 * export const [usePermissions, providePermissions, context] = createPermissionsContext({
 *   namespace: 'app:permissions',
 *   permissions: {
 *     admin: [['read', 'users'], ['edit', 'users']],
 *     editor: [['edit', 'posts']],
 *   },
 * })
 * ```
 */
function createPermissionsFallback<
  Z extends PermissionTicket = PermissionTicket,
  E extends PermissionContext<Z> = PermissionContext<Z>,
> (): E {
  return {
    size: 0,
    can: () => false,
  } as unknown as E
}

export const [createPermissionsContext, createPermissionsPlugin, usePermissions] =
  createPluginContext<PermissionContextOptions, PermissionContext>(
    'v0:permissions',
    options => createPermissions(options),
    { fallback: () => createPermissionsFallback() },
  )

/**
 * Creates a new permissions plugin.
 *
 * @param options The options for the permissions plugin.
 * @template Z The type of the permission ticket.
 * @template E The type of the permission context.
 * @returns A new permissions plugin.
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-permissions
 *
 * @example
 * ```ts
 * import { createApp } from 'vue'
 * import { createPermissionsPlugin } from '@vuetify/v0'
 * import App from './App.vue'
 *
 * const app = createApp(App)
 *
 * app.use(
 *   createPermissionsPlugin({
 *     permissions: {
 *       admin: [['read', 'users']],
 *       editor: [['edit', 'posts']],
 *     },
 *   })
 * )
 *
 * app.mount('#app')
 * ```
 */
