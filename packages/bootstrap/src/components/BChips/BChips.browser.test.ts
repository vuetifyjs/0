import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BChips } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

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

describe('bChips', () => {
  it('should conform to a static chip', async () => {
    const host = mount(() => h(BChips, {
      items: [{ value: 'basic', text: 'Basic chip' }],
    }))
    await settle()

    conform(host.querySelector('.chip')!, 'chips:basic')
    expect(host.innerHTML).not.toContain('data-bs-chips')
  })

  it('should conform to a chip with an image', async () => {
    const host = mount(() => h(BChips, {
      items: [{ value: 'ava', text: 'With avatar', src: 'https://github.com/mdo.png' }],
    }))
    await settle()

    conform(host.querySelector('.chip')!, 'chips:image')
  })

  it('should conform to an active choice chip and toggle it', async () => {
    const model = shallowRef(['on'])
    const host = mount(() => h(BChips, {
      'items': [{ value: 'on', text: 'Active' }],
      'modelValue': model.value,
      'onUpdate:modelValue': (value: string[]) => {
        model.value = value
      },
      'theme': 'primary',
    }))
    await settle()

    conform(host.querySelector('.chip')!, 'chips:active')

    await userEvent.click(host.querySelector('.chip')!)
    await settle()

    expect(model.value).toEqual([])
    expect(host.querySelector('.chip')!.classList.contains('active')).toBe(false)

    await userEvent.keyboard('{Enter}')
    await settle()

    expect(model.value).toEqual(['on'])
    expect(host.querySelector('.chip')!.classList.contains('active')).toBe(true)
  })

  it('should conform to the input face, commit on Enter, and dismiss', async () => {
    const model = shallowRef(['JavaScript'])
    const host = mount(() => h(BChips, {
      'input': true,
      'modelValue': model.value,
      'onUpdate:modelValue': (value: string[]) => {
        model.value = value
      },
      'placeholder': 'Add more…',
      'theme': 'primary',
    }))
    await settle()

    conform(host.querySelector('.chip-input')!, 'chips:input')

    await userEvent.click(host.querySelector('.form-ghost')!)
    await userEvent.keyboard('Vue{Enter}')
    await settle()

    expect(model.value).toEqual(['JavaScript', 'Vue'])

    await userEvent.click(host.querySelector('.chip-dismiss')!)
    await settle()

    expect(model.value).toEqual(['Vue'])

    await userEvent.click(host.querySelector('.form-ghost')!)
    await userEvent.keyboard('React{Enter}')
    await settle()
    expect(model.value).toEqual(['Vue', 'React'])

    await userEvent.keyboard('{Backspace}')
    await settle()
    expect(host.querySelectorAll('.chip')[1].classList.contains('active')).toBe(true)

    await userEvent.keyboard('{Backspace}')
    await settle()
    expect(model.value).toEqual(['Vue'])
  })
})
