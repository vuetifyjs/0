import { describe, expect, it, vi, beforeEach } from 'vitest'
import { h } from 'vue'

import { hydrate } from '#v0/test-utils/hydrate'
import { createStackPlugin } from '#v0/composables/useStack'

import { Dialog } from './index'

// Types
import type { Component } from 'vue'

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn()
  HTMLDialogElement.prototype.close = vi.fn()
})

describe('Dialog SSR hydration', () => {
  it('hydrates a closed Dialog without mismatch warnings', async () => {
    const { html, mismatches } = await hydrate(
      () =>
        h(Dialog.Root as unknown as Component, { id: 'test-dialog' }, () => [
          h(Dialog.Activator as unknown as Component, {}, () => 'Open'),
          h(Dialog.Content as unknown as Component, {}, () => [
            h(Dialog.Title as unknown as Component, {}, () => 'Dialog Title'),
            h(Dialog.Description as unknown as Component, {}, () => 'Dialog description.'),
            h(Dialog.Close as unknown as Component, {}, () => 'Close'),
          ]),
        ]),
      {
        setup: app => app.use(createStackPlugin()),
      },
    )

    expect(html).toContain('Open')
    expect(html).toContain('Dialog Title')
    expect(mismatches).toEqual([])
  })
})
