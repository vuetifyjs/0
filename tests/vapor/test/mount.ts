// Utilities
import { createVaporApp, vaporInteropPlugin } from '@vue/runtime-vapor'

// Types
import type { Component } from 'vue'

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
