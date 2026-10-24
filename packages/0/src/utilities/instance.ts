// Utilities
import { isArray, isNull, isNullOrUndefined } from './helpers'
import { getCurrentInstance } from 'vue'

// A namespace import of `vue` retains `@vue/runtime-vapor` on Vue 3.6.
// `currentInstance` is not a public export on Vue 3.5.
interface InstanceLike {
  type?: { name?: string }
}

const SETTER_KEY = '__VUE_INSTANCE_SETTERS__'

let seen: InstanceLike | null = null

function onInstance (value: unknown) {
  seen = isNullOrUndefined(value) ? null : value as InstanceLike
}

function subscribe () {
  const holders = (globalThis as Record<string, unknown>)[SETTER_KEY]
  if (!isArray(holders)) return
  const list = holders as Array<(value: unknown) => void>
  if (list.includes(onInstance)) return
  list.push(onInstance)
}

subscribe()

// A null setter value is not authoritative: Vue 3.5 render writes
// currentRenderingInstance without notifying the setter, and
// getCurrentInstance() still sees it. A non-null setter value wins because
// getCurrentInstance() is null for a live Vapor instance.
function getInstanceCompat (): InstanceLike | null {
  if (!isNull(seen)) return seen
  return getCurrentInstance() as InstanceLike | null
}

// @internal
/* #__NO_SIDE_EFFECTS__ */
export function instanceExists () {
  return !isNull(getInstanceCompat())
}

// @internal
/* #__NO_SIDE_EFFECTS__ */
export function instanceName () {
  return getInstanceCompat()?.type?.name
}
