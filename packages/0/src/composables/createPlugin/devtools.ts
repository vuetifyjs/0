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
import { isFunction, isObject } from '#v0/utilities'

// Types
import type { App } from 'vue'

interface PluginRecord {
  namespace: string
  context?: unknown
  devtools: boolean
}

const INSPECTOR_ID = 'v0-plugins'

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
      logo: 'https://cdn.vuetifyjs.com/docs/images/one/logos/vzero.png',
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
            { key: 'context', value: snapshot(record.context) },
          ],
        }
      })
    },
  )
}

function snapshot (context: unknown): unknown {
  if (!isObject(context)) return context

  const out: Record<string, unknown> = {}
  for (const key of Object.keys(context)) {
    const value = (context as Record<string, unknown>)[key]
    if (isFunction(value)) continue
    out[key] = value
  }
  return out
}
