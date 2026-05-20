// apps/builder/src/plugins/permissions/defaults.ts

export interface PermissionRule {
  actions: string[] // e.g. ['read', 'write'] or a single ['*']
  subjects: string[] // e.g. ['Post', 'Comment']
  // condition omitted — code-only escape hatch
}

export interface PermissionsConfig {
  roles: Record<string, PermissionRule[]>
}

export const defaultConfig: PermissionsConfig = {
  roles: {
    admin: [{ actions: ['*'], subjects: ['*'] }],
    user: [{ actions: ['read'], subjects: ['*'] }],
  },
}
