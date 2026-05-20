export interface DependencyGraph {
  composables: Record<string, string[]>
  components: Record<string, string[]>
}

export interface ResolvedSet {
  selected: string[]
  autoIncluded: string[]
  reasons: Record<string, string>
  warnings: Warning[]
}

export interface Warning {
  featureId: string
  type: 'draft' | 'missing'
  message: string
}

export type Intent = 'spa' | 'component-library' | 'design-system' | 'admin-dashboard' | 'content-site' | 'mobile-first'

export interface FrameworkManifest {
  intent?: string
  features: string[]
  resolved: string[]
  adapters: Record<string, string>
}
