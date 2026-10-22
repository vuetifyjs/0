import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import { BStepper } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { ShallowRef, VNode } from 'vue'

import { conform } from '../../../harness/conform'
// Components
import { BStepperItem } from '../BStepperItem'

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

function items () {
  return [
    h(BStepperItem, () => 'Create account'),
    h(BStepperItem, () => 'Confirm email'),
    h(BStepperItem, () => 'Update profile'),
    h(BStepperItem, () => 'Finish'),
  ]
}

function example (current: ShallowRef<number>, extra: { overflow?: boolean } = {}) {
  return () => h(BStepper, {
    ...extra,
    'modelValue': current.value,
    'onUpdate:modelValue': (value: number) => {
      current.value = value
    },
  }, () => items())
}

async function settle () {
  await nextTick()
  await nextTick()
}

function activeCount (host: HTMLElement) {
  return host.querySelectorAll('.stepper-item.active').length
}

describe('bStepper', () => {
  it('should conform to the stepper fixture when the second step is current', async () => {
    const host = mount(example(shallowRef(1)))
    await settle()

    conform(host.querySelector('.stepper')!, 'stepper:basic')
  })

  it('should wrap the list when overflow is set', async () => {
    const host = mount(example(shallowRef(1), { overflow: true }))
    await settle()

    conform(host.querySelector('.stepper-overflow')!, 'stepper:overflow')
  })

  it('should select a step on click and mark every reached step active', async () => {
    const current = shallowRef(0)
    const host = mount(example(current))
    await settle()

    expect(activeCount(host)).toBe(1)

    const steps = host.querySelectorAll('.stepper-item')
    await userEvent.click(steps[2]!)
    await settle()

    expect(current.value).toBe(2)
    expect(activeCount(host)).toBe(3)
    expect(steps[3]?.classList.contains('active')).toBe(false)
  })
})
