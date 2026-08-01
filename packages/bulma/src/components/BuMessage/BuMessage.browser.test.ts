import { afterEach, describe, expect, it } from 'vitest'

import { BuMessage } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

import { conform } from '../../../harness/conform'

let teardown: (() => void) | undefined

function mount (node: () => any): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.mount(host)
  teardown = () => {
    app.unmount()
    host.remove()
  }
  return host
}

afterEach(() => {
  teardown?.()
  teardown = undefined
})

function body () {
  return [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    h('strong', 'Pellentesque risus mi'),
    ', tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum ',
    h('a', 'felis venenatis'),
    ' efficitur.',
  ]
}

describe('buMessage', () => {
  it('should conform to the header and delete fixture', () => {
    const host = mount(() => h(BuMessage, {}, {
      header: () => h('p', 'Hello World'),
      default: body,
    }))

    // v0's delete button correctly carries type="button"; the docs fixture omits it.
    conform(host.firstElementChild!, 'message', { ignoreAttrs: ['type'] })
  })

  it('should conform to the body-only fixture', () => {
    const host = mount(() => h(BuMessage, {}, { default: body }))

    conform(host.firstElementChild!, 'message:body only')
  })

  it('should close and unmount when the delete button is clicked', async () => {
    const open = shallowRef(true)
    const host = mount(() => h(BuMessage, {
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }, {
      header: () => h('p', 'Hello World'),
      default: () => 'content',
    }))

    host.querySelector<HTMLButtonElement>('.delete')!.click()
    await nextTick()

    expect(open.value).toBe(false)

    await nextTick()
    await nextTick()

    expect(host.querySelector('.message')).toBeNull()
  })
})
