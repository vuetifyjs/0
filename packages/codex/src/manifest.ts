// Types
import type { Component } from 'vue'

export interface DSTokens {
  [key: string]: unknown
  borderRadius?: Record<string, string>
  boxShadow?: Record<string, string>
  colors?: Record<string, string | Record<string, string>>
  fontFamily?: Record<string, string>
  fontSize?: Record<string, unknown>
  spacing?: Record<string, string>
}

export interface DSExample {
  title: string
  description?: string
  component: () => Promise<{ default: Component }>
}

export interface DSComposableReturn {
  name: string
  type: string
  description?: string
}

export interface DSComposable {
  name: string
  description: string
  category: string
  signature?: string
  returns?: DSComposableReturn[]
  examples?: DSExample[]
  v0?: string
}

export interface DSProp {
  name: string
  type: string
  default?: string
  description?: string
  options?: string[]
}

export interface DSComponent {
  name: string
  description?: string
  category: string
  subComponents?: string[]
  examples?: DSExample[]
  props?: DSProp[]
  v0?: string
}

export interface DSSection {
  /** Section title shown in nav */
  title: string
  /** URL slug for this section */
  slug: string
  /** Lazy-loaded page component */
  component: () => Promise<{ default: Component }>
}

export interface DSManifest {
  /** Display name of the design system */
  name: string
  /** URL slug */
  slug: string
  /** Component prefix (Em, Cx, Ox, etc.) */
  prefix: string
  /** Short description */
  description?: string
  /** Package name for install instructions */
  package?: string
  /** Design tokens */
  tokens: DSTokens
  /** Component inventory */
  components: DSComponent[]
  /** Custom sections (rendered after overview, shown in nav) */
  sections?: DSSection[]
  /** Optional plugin installer */
  plugin?: (app: any) => void
  /** Composable inventory */
  composables?: DSComposable[]
  /** v0 primitive links by name */
  v0Links?: Record<string, string>
  /** Build-time analyzer configuration */
  analyzer?: {
    package: string
    importMap?: string
  }
}
