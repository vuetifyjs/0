// Utilities
import { createVaporApp, vaporInteropPlugin } from '@vue/runtime-vapor'

// Types
import type { Component, Plugin } from 'vue'

export interface VaporMount {
  host: HTMLElement
  app: ReturnType<typeof createVaporApp>
  html: () => string
  unmount: () => void
}

export interface MountOptions {
  props?: Record<string, unknown>
  // Install vaporInteropPlugin so classic (vdom) v0 components can render
  // inside this Vapor app — required for any test that mounts a v0 SFC.
  interop?: boolean
  // App plugins to install before mount — v0's createXPlugin() objects go
  // through the same app.use() path they take in a real app.
  plugins?: Plugin[]
  // App-level provides, applied before mount the way v0 plugins provide
  // their contexts.
  provide?: Record<string, unknown>
}

// @vue/test-utils has no Vapor support yet (vuejs/core#13687), so mount
// manually: create a host, boot a vapor app, expose the rendered DOM, and
// tear down. Pattern adapted from the runtime-vapor test utils.
export function mountVapor (component: Component, options: MountOptions = {}): VaporMount {
  const host = document.createElement('div')
  document.body.append(host)

  const app = createVaporApp(component as Parameters<typeof createVaporApp>[0], options.props)
  if (options.interop) {
    app.use(vaporInteropPlugin)
  }
  for (const plugin of options.plugins ?? []) {
    app.use(plugin)
  }
  for (const [key, value] of Object.entries(options.provide ?? {})) {
    app.provide(key, value)
  }
  app.mount(host)

  return {
    host,
    app,
    html: () => host.innerHTML,
    unmount () {
      app.unmount()
      host.remove()
    },
  }
}
