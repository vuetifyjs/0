// Utilities
import { isNull } from './helpers'
import * as Vue from 'vue'

/**
 * Vue 3.6+ exposes `currentInstance` for Vapor mode compatibility.
 * `getCurrentInstance()` returns null in Vapor components by design,
 * so we access `currentInstance` directly when available.
 *
 * Uses dynamic key to avoid bundler static analysis warnings.
 *
 * @see https://github.com/orgs/vuejs/discussions/13629
 * @internal
 */
const INSTANCE_KEY = /* @__PURE__ */ 'current' + 'Instance'

function getInstanceCompat () {
  const vueExports = Vue as Record<string, unknown>
  // Vue 3.6+ exports currentInstance for Vapor mode
  if (INSTANCE_KEY in vueExports) {
    return vueExports[INSTANCE_KEY] as { type?: { name?: string } } | null
  }
  // Vue 3.5 and earlier
  return Vue.getCurrentInstance()
}

// @internal
export function instanceExists () {
  return !isNull(getInstanceCompat())
}

// @internal
export function instanceName () {
  return getInstanceCompat()?.type?.name
}
