/**
 * @module createPlugin/devtools
 *
 * @remarks
 * Vue DevTools inspector for v0 plugins. Wired from `createPlugin` install
 * in development only — plugins that pass `devtools: true` land as a node
 * under a single "v0" inspector. `@vue/devtools-api` is an optional peer;
 * missing it is a silent no-op so production and apps without DevTools
 * are unaffected.
 */

// Utilities
import { isArray, isFunction, isNullOrUndefined, isObject } from '#v0/utilities'
import { isRef } from 'vue'

// Types
import type { App } from 'vue'

interface PluginRecord {
  namespace: string
  context?: unknown
  devtools: boolean
  inspect?: (context: unknown) => unknown
}

const INSPECTOR_ID = 'v0-plugins'

// TabIcon only treats `/…` or `https?://…` as images. data: URIs become a CSS class and vanish.
function pluginLogo (): string {
  const origin = globalThis.location?.origin ?? ''
  if (/^https?:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d+)?$/.test(origin)) {
    return `${origin}/vzero.svg`
  }
  return 'https://0.vuetifyjs.com/vzero.svg'
}

interface Hook {
  api: {
    sendInspectorTree: (id: string) => void
    sendInspectorState: (id: string) => void
  }
  records: Map<string, PluginRecord>
}

const hooked = new WeakMap<App, Hook>()
const pending = new WeakMap<App, Promise<void>>()

export function sync (app: App, records: Map<string, PluginRecord>) {
  const existing = hooked.get(app)
  if (existing) {
    existing.records = records
    existing.api.sendInspectorTree(INSPECTOR_ID)
    existing.api.sendInspectorState(INSPECTOR_ID)
    return
  }

  const inFlight = pending.get(app)
  if (inFlight) {
    void inFlight.then(() => sync(app, records))
    return
  }

  const task = connect(app, records)
  pending.set(app, task)
  void task.finally(() => pending.delete(app))
}

async function connect (app: App, records: Map<string, PluginRecord>) {
  let api
  try {
    api = await import('@vue/devtools-api')
  } catch {
    return
  }

  if (hooked.has(app) || !api.setupDevtoolsPlugin) return

  api.setupDevtoolsPlugin(
    {
      id: 'dev.vuetify.v0',
      label: 'Vuetify0',
      packageName: '@vuetify/v0',
      homepage: 'https://0.vuetifyjs.com',
      logo: pluginLogo(),
      app,
    },
    api => {
      const hook: Hook = { api, records }
      hooked.set(app, hook)

      api.addInspector({
        id: INSPECTOR_ID,
        label: 'v0',
        icon: 'widgets',
      })

      api.on.getInspectorTree(payload => {
        if (payload.inspectorId !== INSPECTOR_ID) return

        const current = hooked.get(app)?.records ?? records
        payload.rootNodes = [...current.values()]
          .filter(record => record.devtools)
          .map(record => ({
            id: record.namespace,
            label: record.namespace,
          }))
      })

      api.on.getInspectorState(payload => {
        if (payload.inspectorId !== INSPECTOR_ID) return

        const current = hooked.get(app)?.records ?? records
        const record = current.get(payload.nodeId)
        if (!record?.devtools) return

        payload.state = {
          plugin: [
            { key: 'namespace', value: record.namespace },
            { key: 'context', value: display(record) },
          ],
        }
      })
    },
  )
}

function display (record: PluginRecord): unknown {
  const base = snapshot(record.context)
  if (!record.inspect) return base

  const overlay = snapshot(record.inspect(record.context))
  if (!isObject(overlay) || isArray(overlay)) return overlay
  if (!isObject(base) || isArray(base)) return overlay

  return { ...base, ...overlay }
}

function isPlainObject (value: object) {
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

function typeName (value: object) {
  const name = value.constructor?.name
  if (!name || name === 'Object' || name === 'Array') return undefined
  return name
}

function snapshot (value: unknown, depth = 0): unknown {
  if (depth > 4) return value
  if (isRef(value)) return snapshot(value.value, depth + 1)
  if (isFunction(value) || !isObject(value)) return value
  if (typeof Element !== 'undefined' && value instanceof Element) return value.constructor.name
  if (value instanceof Map) {
    return Object.fromEntries([...value].map(([key, item]) => [String(key), snapshot(item, depth + 1)]))
  }
  if (value instanceof Set) {
    return [...value].map(item => snapshot(item, depth + 1))
  }
  if (isArray(value)) return value.map(item => snapshot(item, depth + 1))

  const out: Record<string, unknown> = {}
  const seen = new Set<string>()

  for (const key of Object.keys(value)) {
    seen.add(key)
    const current = (value as Record<string, unknown>)[key]
    if (isFunction(current) || isNullOrUndefined(current)) continue
    out[key] = snapshot(current, depth + 1)
  }

  let proto = Object.getPrototypeOf(value)
  while (proto && proto !== Object.prototype) {
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key === 'constructor' || seen.has(key)) continue
      const desc = Object.getOwnPropertyDescriptor(proto, key)
      if (!desc?.get) continue
      seen.add(key)
      try {
        const current = desc.get.call(value)
        if (isFunction(current) || isNullOrUndefined(current)) continue
        out[key] = snapshot(current, depth + 1)
      } catch {
        // getter threw — skip
      }
    }
    proto = Object.getPrototypeOf(proto)
  }

  const name = typeName(value)
  if (!isPlainObject(value) && name) {
    if (Object.keys(out).length === 0) return name
    return { type: name, ...out }
  }

  return out
}
