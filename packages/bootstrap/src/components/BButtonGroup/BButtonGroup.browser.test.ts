import { afterEach, describe, expect, it } from 'vitest'

import { BButtonGroup } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'
// Components
import { BButton } from '../BButton'

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }
})

async function settle () {
  await nextTick()
  await nextTick()
}

function face (text: string) {
  return h(BButton, { variant: 'solid', theme: 'primary' }, () => text)
}

describe('bButtonGroup', () => {
  it('should conform to the basic group fixture', async () => {
    const host = mount(() => h(BButtonGroup, { label: 'Basic example' }, () => [
      face('Left'),
      face('Middle'),
      face('Right'),
    ]))
    await settle()

    conform(host.querySelector('div')!, 'button-group:basic')
  })

  it('should use the vertical class without btn-group', async () => {
    const host = mount(() => h(BButtonGroup, { vertical: true, divider: true }, () => face('Left')))
    await settle()

    const element = host.querySelector('div')!

    expect(element.classList.contains('btn-group-vertical')).toBe(true)
    expect(element.classList.contains('btn-group-divider')).toBe(true)
    expect(element.classList.contains('btn-group')).toBe(false)
    expect(element.getAttribute('role')).toBe('group')
  })
})
