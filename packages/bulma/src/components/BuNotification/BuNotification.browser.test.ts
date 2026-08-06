import { afterEach, describe, expect, it } from 'vitest'

import { BuNotification } from './index'

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

const body = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor. ',
  h('strong', 'Pellentesque risus mi'),
  ', tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum ',
  h('a', 'felis venenatis'),
  ' efficitur.',
]

// v0's delete button correctly carries type="button"; the docs fixture omits it.
const TYPE = { ignoreAttrs: ['type'] }

describe('buNotification', () => {
  it('should conform to the basic notification fixture', () => {
    const host = mount(() => h(BuNotification, {}, { default: () => body }))

    conform(host.firstElementChild!, 'notification', TYPE)
  })

  it('should conform to the color variant fixture', () => {
    const host = mount(() => h(BuNotification, { color: 'primary' }, {
      default: () => [
        'Primar lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor. ',
        h('strong', 'Pellentesque risus mi'),
        ', tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum ',
        h('a', 'felis venenatis'),
        ' efficitur.',
      ],
    }))

    conform(host.firstElementChild!, 'notification:color', TYPE)
  })

  it('should close and unmount when the delete button is clicked', async () => {
    const open = shallowRef(true)
    const host = mount(() => h(BuNotification, {
      'modelValue': open.value,
      'onUpdate:modelValue': (value: boolean) => {
        open.value = value
      },
    }, { default: () => 'content' }))

    host.querySelector<HTMLButtonElement>('.delete')!.click()
    await nextTick()

    expect(open.value).toBe(false)

    await nextTick()
    await nextTick()

    expect(host.querySelector('.notification')).toBeNull()
  })
})
