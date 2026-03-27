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

export interface DSComponent {
  name: string
  description?: string
  category: string
  subComponents?: string[]
  examples?: DSExample[]
}

export interface DSManifest {
  /** Display name of the design system */
  name: string
  /** URL slug */
  slug: string
  /** Component prefix (Em, Cx, Ox, etc.) */
  prefix: string
  /** Design tokens */
  tokens: DSTokens
  /** Component inventory */
  components: DSComponent[]
  /** Optional plugin installer */
  plugin?: (app: any) => void
}
