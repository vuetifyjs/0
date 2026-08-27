import { beforeEach, describe, expect, it, vi } from 'vitest'

// Composables
import { createPlugin, createPluginContext } from './index'

// Utilities
import { createApp } from 'vue'

const mocks = vi.hoisted(() => {
  const sendInspectorTree = vi.fn()
  const sendInspectorState = vi.fn()
  const addInspector = vi.fn()
  const on = {
    getInspectorTree: vi.fn(),
    getInspectorState: vi.fn(),
  }
  const setupDevtoolsPlugin = vi.fn((_descriptor: unknown, setup: (api: unknown) => void) => {
    setup({
      addInspector,
      on,
      sendInspectorTree,
      sendInspectorState,
    })
  })

  return { addInspector, on, sendInspectorState, sendInspectorTree, setupDevtoolsPlugin }
})

vi.mock('@vue/devtools-api', () => ({
  setupDevtoolsPlugin: mocks.setupDevtoolsPlugin,
}))

describe('createPlugin vue-devtools', () => {
  beforeEach(() => {
    mocks.setupDevtoolsPlugin.mockClear()
    mocks.addInspector.mockClear()
    mocks.sendInspectorTree.mockClear()
    mocks.sendInspectorState.mockClear()
    mocks.on.getInspectorTree.mockClear()
    mocks.on.getInspectorState.mockClear()
  })

  it('should not register a DevTools inspector when devtools is omitted', async () => {
    const app = createApp({ render: () => null })
    createPlugin({
      namespace: 'v0:theme',
      provide: () => {},
    }).install(app)

    await Promise.resolve()
    expect(mocks.setupDevtoolsPlugin).not.toHaveBeenCalled()
  })

  it('should register a v0 inspector on first install when devtools is true', async () => {
    const app = createApp({ render: () => null })
    createPlugin({
      namespace: 'v0:theme',
      provide: () => {},
      devtools: true,
    }).install(app)

    await vi.waitFor(() => expect(mocks.setupDevtoolsPlugin).toHaveBeenCalledTimes(1))

    expect(mocks.setupDevtoolsPlugin.mock.calls[0]![0]).toMatchObject({
      id: 'dev.vuetify.v0',
      label: 'Vuetify0',
      packageName: '@vuetify/v0',
      app,
    })
    expect(mocks.addInspector).toHaveBeenCalledWith(expect.objectContaining({
      id: 'v0-plugins',
      label: 'v0',
    }))
  })

  it('should not call setupDevtoolsPlugin twice for a second plugin on the same app', async () => {
    const app = createApp({ render: () => null })
    createPlugin({ namespace: 'v0:theme', provide: () => {}, devtools: true }).install(app)
    await vi.waitFor(() => expect(mocks.setupDevtoolsPlugin).toHaveBeenCalledTimes(1))

    createPlugin({ namespace: 'v0:locale', provide: () => {}, devtools: true }).install(app)
    await vi.waitFor(() => expect(mocks.sendInspectorTree).toHaveBeenCalled())

    expect(mocks.setupDevtoolsPlugin).toHaveBeenCalledTimes(1)
  })

  it('should list installed namespaces on the inspector tree', async () => {
    const app = createApp({ render: () => null })
    createPlugin({ namespace: 'v0:theme', provide: () => {}, devtools: true }).install(app)
    createPlugin({ namespace: 'v0:locale', provide: () => {} }).install(app)
    createPlugin({ namespace: 'v0:logger', provide: () => {}, devtools: true }).install(app)

    await vi.waitFor(() => expect(mocks.on.getInspectorTree).toHaveBeenCalled())

    const handler = mocks.on.getInspectorTree.mock.calls.at(-1)![0] as (payload: {
      inspectorId: string
      rootNodes: unknown[]
    }) => void
    const payload = { inspectorId: 'v0-plugins', rootNodes: [] as unknown[] }
    handler(payload)

    expect(payload.rootNodes).toEqual([
      { id: 'v0:theme', label: 'v0:theme' },
      { id: 'v0:logger', label: 'v0:logger' },
    ])
  })

  it('should expose plugin context on inspector state and omit functions', async () => {
    const [, createXPlugin] = createPluginContext(
      'v0:inspect-test',
      () => ({
        count: 1,
        tick: () => {},
      }),
    )

    const app = createApp({ render: () => null })
    createXPlugin({ devtools: true }).install(app)

    await vi.waitFor(() => expect(mocks.on.getInspectorState).toHaveBeenCalled())

    const handler = mocks.on.getInspectorState.mock.calls.at(-1)![0] as (payload: {
      inspectorId: string
      nodeId: string
      state: unknown
    }) => void
    const payload: { inspectorId: string, nodeId: string, state: unknown } = {
      inspectorId: 'v0-plugins',
      nodeId: 'v0:inspect-test',
      state: undefined,
    }
    handler(payload)

    expect(payload.state).toEqual({
      plugin: [
        { key: 'namespace', value: 'v0:inspect-test' },
        { key: 'context', value: { count: 1 } },
      ],
    })
  })

  it('should skip inspector callbacks for a different inspector id', async () => {
    const app = createApp({ render: () => null })
    createPlugin({ namespace: 'v0:theme', provide: () => {}, devtools: true }).install(app)
    await vi.waitFor(() => expect(mocks.on.getInspectorTree).toHaveBeenCalled())

    const handler = mocks.on.getInspectorTree.mock.calls[0]![0] as (payload: {
      inspectorId: string
      rootNodes?: unknown[]
    }) => void
    const payload = { inspectorId: 'other' }
    handler(payload)

    expect(payload).toEqual({ inspectorId: 'other' })
  })

  it('should use config.devtools as the author default, overridable at install', async () => {
    const [, createXPlugin] = createPluginContext(
      'v0:default-on',
      () => ({ ok: true }),
      { devtools: true },
    )

    const app = createApp({ render: () => null })
    createXPlugin().install(app)
    await vi.waitFor(() => expect(mocks.setupDevtoolsPlugin).toHaveBeenCalledTimes(1))

    const hidden = createApp({ render: () => null })
    createXPlugin({ devtools: false }).install(hidden)
    await Promise.resolve()
    expect(mocks.setupDevtoolsPlugin).toHaveBeenCalledTimes(1)
  })
})
