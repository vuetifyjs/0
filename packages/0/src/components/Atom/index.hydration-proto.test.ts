import { describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from 'vue/server-renderer'

import { Atom } from './index'

// Types
import type { Component } from 'vue'

// PROTOTYPE / parked follow-up — a *real* hydration-mismatch check.
//
// The existing `should hydrate without mismatches` tests across the component
// suites render to string and then client-mount a fresh app; they never
// hydrate the SSR DOM and never assert on mismatch warnings, so they cannot
// fail on a mismatch. This helper does the real thing:
//   1. render once on the "server",
//   2. hydrate that exact HTML with createSSRApp().mount() — the only path
//      that actually hydrates,
//   3. capture Vue's hydration-mismatch console output and return it.
//
// Validated against Atom: Atom hydrates clean, and the CONTROL case proves the
// helper genuinely detects a real mismatch (so the green is trustworthy).
//
// NEXT (see memory `ssr-hydration-mismatch-helper`): lift `hydrate` into a
// shared test util and sweep it across the components that generate ids, inject
// theme/RTL, or read browser state at render — that's where a real mismatch,
// if one exists, would surface.
async function hydrate (render: () => unknown) {
  const messages: string[] = []
  const capture = (...args: unknown[]) => void messages.push(args.map(String).join(' '))
  const warn = vi.spyOn(console, 'warn').mockImplementation(capture)
  const error = vi.spyOn(console, 'error').mockImplementation(capture)

  const html = await renderToString(createSSRApp(defineComponent({ render })))

  const container = document.createElement('div')
  container.innerHTML = html
  const app = createSSRApp(defineComponent({ render }))
  app.mount(container)
  await nextTick()

  warn.mockRestore()
  error.mockRestore()
  app.unmount()

  const mismatches = messages.filter(m => /hydrat|mismatch/i.test(m))
  return { html, mismatches, messages }
}

describe('Atom hydration (prototype)', () => {
  it('should hydrate a stable Atom with zero mismatch warnings', async () => {
    const { html, mismatches } = await hydrate(
      () => h(Atom as unknown as Component, { as: 'span' }, () => 'Hydrated'),
    )

    expect(html).toContain('Hydrated')
    expect(mismatches).toEqual([])
  })

  it('should detect a deliberate server/client mismatch (CONTROL — proves the helper is not blind)', async () => {
    let n = 0
    const { mismatches } = await hydrate(() => h('span', String(n++)))

    // Captures Vue's real warning: "Hydration text content mismatch on
    // <span>0</span> - rendered on server: 0 - expected on client: 1".
    expect(mismatches.length).toBeGreaterThan(0)
    expect(mismatches.some(m => /hydration.*mismatch/i.test(m))).toBe(true)
  })
})
