export const NAMESPACE = 'demo:permissions'

export type Role = 'admin' | 'editor' | 'viewer'

export interface Section {
  id: string
  label: string
  description: string
}

export interface DocAction {
  id: string
  label: string
  tone: 'neutral' | 'primary' | 'danger'
}

type Condition = boolean | ((context: Record<string, unknown>) => boolean)
type Rule = [string | string[], string | string[], Condition?]

export const roles: Role[] = ['admin', 'editor', 'viewer']

export const sections: Section[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Activity overview' },
  { id: 'documents', label: 'Documents', description: 'Drafts and published files' },
  { id: 'users', label: 'Users', description: 'Team and seats' },
  { id: 'settings', label: 'Settings', description: 'Workspace configuration' },
]

export const actions: DocAction[] = [
  { id: 'create', label: 'New document', tone: 'primary' },
  { id: 'edit', label: 'Edit', tone: 'neutral' },
  { id: 'publish', label: 'Publish', tone: 'neutral' },
  { id: 'delete', label: 'Delete', tone: 'danger' },
]

export const permissions: Record<Role, Rule[]> = {
  admin: [
    ['view', ['dashboard', 'documents', 'users', 'settings'], true],
    [['create', 'edit', 'publish', 'delete'], 'documents', true],
  ],
  editor: [
    ['view', ['dashboard', 'documents', 'users'], true],
    [['create', 'edit'], 'documents', true],
    ['publish', 'documents', context => context.isOwner === true],
  ],
  viewer: [
    ['view', ['dashboard', 'documents'], true],
  ],
}
