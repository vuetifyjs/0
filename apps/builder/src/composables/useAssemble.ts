/**
 * @module useAssemble
 *
 * Vuetify One subscriber-gated "Describe what you need" feature.
 * Sends natural language requirements to an LLM and returns structured
 * plugin + component IDs that can be applied to the builder store.
 */

// Framework
import { IN_BROWSER } from '@vuetify/v0'

import { isSelectable } from '@/data/components'
import { PLUGINS } from '@/data/plugins'

// Utilities
import { readonly, shallowRef } from 'vue'

// Types
import type { Ref, ShallowRef } from 'vue'

export interface AssembleResult {
  plugins: string[]
  components: string[]
}

export interface ValidationResult {
  valid: AssembleResult
  invalid: {
    plugins: string[]
    components: string[]
  }
}

export interface UseAssembleReturn {
  isLoading: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | null>>
  lastResult: Readonly<ShallowRef<AssembleResult | null>>
  assemble: (requirements: string) => Promise<AssembleResult | null>
  validate: (result: AssembleResult) => ValidationResult
}

const API_URL = `${import.meta.env.VITE_API_SERVER_URL || 'https://api.vuetifyjs.com'}/builder/assemble`

const VALID_PLUGIN_IDS = new Set(PLUGINS.map(p => p.id))

/**
 * Validate plugin IDs against the known catalog.
 */
export function isValidPlugin (id: string): boolean {
  return VALID_PLUGIN_IDS.has(id)
}

/**
 * Filter an array of plugin IDs to only those in the catalog.
 */
export function keepValidPlugins (ids: string[]): string[] {
  return ids.filter(id => VALID_PLUGIN_IDS.has(id))
}

/**
 * Filter an array of component IDs to only those that are selectable.
 */
export function keepValidComponents (ids: string[]): string[] {
  return ids.filter(id => isSelectable(id))
}

/**
 * Parse a raw LLM response into an AssembleResult.
 * Handles both direct JSON and markdown-wrapped JSON.
 */
export function parseAssembleResponse (text: string): AssembleResult {
  let json = text.trim()

  const fenceMatch = json.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
  if (fenceMatch) {
    json = fenceMatch[1]
  }

  const parsed: unknown = JSON.parse(json)

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Response is not a valid object')
  }

  const result = parsed as Record<string, unknown>

  const plugins = Array.isArray(result.plugins)
    ? result.plugins.filter((p): p is string => typeof p === 'string')
    : []

  const components = Array.isArray(result.components)
    ? result.components.filter((c): c is string => typeof c === 'string')
    : []

  return { plugins, components }
}

/**
 * Validate an AssembleResult against the plugin/component catalogs.
 * Returns both valid and invalid IDs for transparency.
 */
export function validateAssembleResult (result: AssembleResult): ValidationResult {
  const validPlugins = keepValidPlugins(result.plugins)
  const validComponents = keepValidComponents(result.components)

  const invalidPlugins = result.plugins.filter(id => !VALID_PLUGIN_IDS.has(id))
  const invalidComponents = result.components.filter(id => !isSelectable(id))

  return {
    valid: {
      plugins: validPlugins,
      components: validComponents,
    },
    invalid: {
      plugins: invalidPlugins,
      components: invalidComponents,
    },
  }
}

/**
 * Composable for the "Describe what you need" feature.
 * Requires Vuetify One subscription — caller is responsible for gating.
 */
export function useAssemble (): UseAssembleReturn {
  const isLoading = shallowRef(false)
  const error = shallowRef<string | null>(null)
  const lastResult = shallowRef<AssembleResult | null>(null)

  let abortController: AbortController | null = null

  async function assemble (requirements: string): Promise<AssembleResult | null> {
    if (!IN_BROWSER) return null
    if (!requirements.trim()) return null
    if (isLoading.value) return null

    error.value = null
    isLoading.value = true
    lastResult.value = null

    abortController = new AbortController()

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ requirements: requirements.trim() }),
        signal: abortController.signal,
      })

      if (response.status === 401) {
        throw new Error('Sign in required to use this feature.')
      }

      if (response.status === 403) {
        throw new Error('A Vuetify One subscription is required to use this feature.')
      }

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.')
      }

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`)
      }

      const text = await response.text()
      const result = parseAssembleResponse(text)
      const validated = validateAssembleResult(result)

      lastResult.value = validated.valid
      return validated.valid
    } catch (error_) {
      if ((error_ as Error).name === 'AbortError') {
        return null
      }

      error.value = error_ instanceof Error ? error_.message : 'An unexpected error occurred'
      return null
    } finally {
      isLoading.value = false
      abortController = null
    }
  }

  function validate (result: AssembleResult): ValidationResult {
    return validateAssembleResult(result)
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    lastResult: readonly(lastResult),
    assemble,
    validate,
  }
}

/**
 * Check if a user role indicates a Vuetify One subscriber.
 * Subscribers have roles like 'sponsor', 'admin', or tier-based roles.
 */
export function isSubscriber (role: string | undefined | null): boolean {
  if (!role) return false

  const subscriberRoles = new Set([
    'sponsor',
    'admin',
    'solo',
    'team',
  ])

  return subscriberRoles.has(role.toLowerCase())
}

/**
 * Get the list of valid plugin IDs for the system prompt.
 */
export function getPluginCatalog (): string[] {
  return PLUGINS.map(p => p.id)
}

/**
 * Get plugin metadata for display purposes.
 */
export function getPluginInfo (id: string): { title: string, category: string } | undefined {
  const plugin = PLUGINS.find(p => p.id === id)
  return plugin ? { title: plugin.title, category: plugin.category } : undefined
}
