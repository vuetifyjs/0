/// <reference types="node" />
import * as fs from 'node:fs'
import * as path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { instanceExists, instanceName } from './instance'

// Utilities
import { isUndefined } from './helpers'

// Importing real `vue` registers Vue's own setter. Mock only `getCurrentInstance`.
const mocks = vi.hoisted(() => {
  const setters: Array<(value: unknown) => void> = []
  const holders = globalThis as Record<string, unknown>
  holders.__VUE_INSTANCE_SETTERS__ = setters

  return {
    getCurrentInstance: vi.fn(),
    setters,
  }
})

vi.mock('vue', () => ({
  getCurrentInstance: mocks.getCurrentInstance,
}))

const SRC = path.resolve(import.meta.dirname, '..')

const NAMESPACE_VUE = /import\s+\*\s+as\s+\w+\s+from\s+['"]vue['"]/

function isSkipped (name: string): boolean {
  return name.endsWith('.test.ts')
    || name.endsWith('.browser.test.ts')
    || name.endsWith('.ssr.test.ts')
}

function collect (dir: string, out: string[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist') continue
      collect(full, out)
      continue
    }
    if (!entry.isFile() || isSkipped(entry.name)) continue
    out.push(full)
  }
}

function namespaceVueImports (): string[] {
  const files: string[] = []
  collect(SRC, files)
  const hits: string[] = []

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    if (NAMESPACE_VUE.test(source)) hits.push(path.relative(SRC, file))
  }

  return hits
}

function registeredListener (): (value: unknown) => void {
  const listener = mocks.setters[0]
  if (typeof listener !== 'function') throw new Error('setter listener was not registered')
  return listener
}

describe('instance', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should fall back to getCurrentInstance before the listener fires', async () => {
    const holders = globalThis as Record<string, unknown>
    holders.__VUE_INSTANCE_SETTERS__ = mocks.setters
    vi.resetModules()
    mocks.getCurrentInstance.mockReturnValue({ type: { name: 'Fallback' } })

    const loaded = await import('./instance')

    expect(loaded.instanceExists()).toBe(true)
    expect(loaded.instanceName()).toBe('Fallback')
    expect(mocks.getCurrentInstance).toHaveBeenCalled()
  })

  it('should trust a non-null listener value without calling getCurrentInstance', () => {
    registeredListener()({ type: { name: 'VaporComp' } })

    expect(instanceExists()).toBe(true)
    expect(instanceName()).toBe('VaporComp')
    expect(mocks.getCurrentInstance).not.toHaveBeenCalled()
  })

  it('should fall back to getCurrentInstance when the listener value is null', () => {
    registeredListener()(null)
    mocks.getCurrentInstance.mockReturnValue({ type: { name: 'Render' } })

    expect(instanceExists()).toBe(true)
    expect(instanceName()).toBe('Render')
    expect(mocks.getCurrentInstance).toHaveBeenCalled()
  })

  it('should report no instance when the listener value and getCurrentInstance are null', () => {
    registeredListener()(null)
    mocks.getCurrentInstance.mockReturnValue(null)

    expect(instanceExists()).toBe(false)
    expect(instanceName()).toBeUndefined()
    expect(mocks.getCurrentInstance).toHaveBeenCalled()
  })

  it('should use getCurrentInstance when the setter list is absent at module init', async () => {
    const holders = globalThis as Record<string, unknown>
    const previous = holders.__VUE_INSTANCE_SETTERS__
    delete holders.__VUE_INSTANCE_SETTERS__
    vi.resetModules()
    mocks.getCurrentInstance.mockReturnValue({ type: { name: 'Dom' } })

    try {
      const loaded = await import('./instance')

      expect(loaded.instanceExists()).toBe(true)
      expect(loaded.instanceName()).toBe('Dom')
      expect(mocks.getCurrentInstance).toHaveBeenCalled()
    } finally {
      if (isUndefined(previous)) delete holders.__VUE_INSTANCE_SETTERS__
      else holders.__VUE_INSTANCE_SETTERS__ = previous
    }
  })

  it('should find no namespace import of vue under packages/0/src', () => {
    expect(namespaceVueImports()).toEqual([])
  })

  it('should not match a type-only namespace import of vue', () => {
    expect(NAMESPACE_VUE.test('import type * as Vue from \'vue\'')).toBe(false)
    expect(NAMESPACE_VUE.test('import * as Vue from \'vue\'')).toBe(true)
    expect(NAMESPACE_VUE.test('import * as Vue from "vue"')).toBe(true)
  })
})
