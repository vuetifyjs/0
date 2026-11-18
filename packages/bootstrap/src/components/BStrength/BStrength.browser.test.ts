import { afterEach, describe, expect, it } from 'vitest'

// Components
import { BStrength } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'

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

describe('bStrength', () => {
  it('should conform to one active segment', async () => {
    const host = mount(() => h(BStrength, { value: 1 }))
    await settle()

    conform(host.querySelector('.strength')!, 'strength:segments')
    expect((host.querySelector('.strength') as HTMLElement).dataset.bsStrength).toBe('weak')
  })

  it('should light every segment at 4 and at 100', async () => {
    const host = mount(() => h(BStrength, { value: 4 }))
    await settle()

    expect(host.querySelectorAll('.strength-segment.active')).toHaveLength(4)

    host.remove()
    const percent = mount(() => h(BStrength, { value: 100 }))
    await settle()

    expect(percent.querySelectorAll('.strength-segment.active')).toHaveLength(4)
  })

  it('should conform to the bar face and set its width', async () => {
    const host = mount(() => h(BStrength, { value: 100, variant: 'bar' }))
    await settle()

    const bar = host.querySelector('.strength-bar')! as HTMLElement
    conform(bar, 'strength:bar', { ignoreAttrs: ['style'] })
    expect(bar.dataset.bsStrength).toBe('strong')
    expect(bar.style.getPropertyValue('--bs-strength-width')).toBe('100%')
    expect(bar.style.width).toBe('')
  })
})
