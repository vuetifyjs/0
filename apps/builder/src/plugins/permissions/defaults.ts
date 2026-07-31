// apps/builder/src/plugins/permissions/defaults.ts

// Mirrors PermissionOptions['permissions'] in packages/0/src/composables/usePermissions.
// Each rule is a positional tuple: [actions, subjects, condition?]. The condition slot is
// omitted here — it is a predicate function, so it can only be supplied in code.
export type PermissionRule = [string[], string[], boolean?]

export interface PermissionsConfig {
  permissions: Record<string, PermissionRule[]>
}

export const defaultConfig: PermissionsConfig = {
  permissions: {
    admin: [[['*'], ['*']]],
    user: [[['read'], ['*']]],
  },
}
