import { afterEach, describe, expect, it } from 'vitest'

// Framework
import { isString } from '@vuetify/v0'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Components
import { BListGroup } from '../BListGroup'

const teardowns: (() => void)[] = []

function mount (render: () => ReturnType<typeof h>): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render })
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

describe('bListGroupItem', () => {
  it('should select the row on Enter and leave a child control alone', async () => {
    const selected = shallowRef<string>()
    const host = mount(() => h(BListGroup, {
      'selectable': true,
      'modelValue': selected.value,
      'onUpdate:modelValue': (value: unknown) => {
        if (isString(value)) selected.value = value
      },
    }, {
      default: () => h(BListGroup.Item, { value: 'one' }, {
        default: () => h('button', { type: 'button', class: 'inner' }, 'Inner'),
      }),
    }))
    await settle()

    const row = host.querySelector('li')!
    const inner = host.querySelector<HTMLButtonElement>('.inner')!

    inner.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await settle()

    expect(selected.value).toBeUndefined()

    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await settle()

    expect(selected.value).toBe('one')
  })
})
