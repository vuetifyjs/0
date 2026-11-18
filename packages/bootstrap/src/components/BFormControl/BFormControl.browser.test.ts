import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BFormControl } from './index'

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

describe('bFormControl', () => {
  it('should render an input with form-control', async () => {
    const host = mount(() => h(BFormControl))
    await settle()

    const element = host.querySelector('input')!

    expect(element.classList.contains('form-control')).toBe(true)
    expect(element.classList.contains('form-select')).toBe(false)
    expect(Object.hasOwn(element.dataset, 'bsToggle')).toBe(false)
  })

  it('should render a select with form-control and not form-select', async () => {
    const host = mount(() => h(BFormControl, { as: 'select' }))
    await settle()

    const element = host.querySelector('select')!

    expect(element.classList.contains('form-control')).toBe(true)
    expect(element.classList.contains('form-select')).toBe(false)
  })

  it('should add is-invalid when invalid', async () => {
    const host = mount(() => h(BFormControl, { invalid: true }))
    await settle()

    expect(host.querySelector('input')!.classList.contains('is-invalid')).toBe(true)
  })

  it('should conform to the basic input fixture', async () => {
    const host = mount(() => h(BFormControl, {
      id: 'exampleFormControlInput',
      type: 'email',
      placeholder: 'name@example.com',
    }))
    await settle()

    conform(host.querySelector('input')!, 'form-control:basic')
  })

  it('should conform to the select fixture', async () => {
    const host = mount(() => h(BFormControl, { as: 'select', id: 'exampleFormControlSelect2' }, () => [
      h('option', 'Choose one…'),
      h('option', { value: '1' }, 'One'),
      h('option', { value: '2' }, 'Two'),
      h('option', { value: '3' }, 'Three'),
    ]))
    await settle()

    conform(host.querySelector('select')!, 'form-control:select')
  })

  it('should conform to the valid input fixture', async () => {
    const host = mount(() => h(BFormControl, {
      'id': 'validationServer01',
      'type': 'text',
      'modelValue': 'Mark Otto',
      'valid': true,
      'aria-describedby': 'validationServer01Valid validationServer01Invalid',
    }))
    await settle()

    conform(host.querySelector('input')!, 'form-control:is-valid')
  })

  it('should conform to the invalid textarea fixture', async () => {
    const host = mount(() => h(BFormControl, {
      'as': 'textarea',
      'id': 'validationTextarea',
      'invalid': true,
      'placeholder': 'Required example textarea',
      'required': true,
      'aria-describedby': 'validationTextareaFeedback',
    }))
    await settle()

    conform(host.querySelector('textarea')!, 'form-control:is-invalid')
  })

  it('should add the small and large size classes', async () => {
    const small = mount(() => h(BFormControl, {
      'id': 'sizesInputSmall',
      'size': 'sm',
      'type': 'text',
      'placeholder': 'Small input',
      'aria-label': 'Small input example',
    }))
    await settle()
    conform(small.querySelector('input')!, 'form-control:sm')

    const large = mount(() => h(BFormControl, {
      'id': 'sizesInputLarge',
      'size': 'lg',
      'type': 'text',
      'placeholder': 'Large input',
      'aria-label': 'Large input example',
    }))
    await settle()
    conform(large.querySelector('input')!, 'form-control:lg')
  })

  it('should add form-control-plaintext only when plaintext and readonly', async () => {
    const host = mount(() => h(BFormControl, { plaintext: true, readonly: true }))
    await settle()

    const element = host.querySelector('input')!

    expect(element.classList.contains('form-control')).toBe(true)
    expect(element.classList.contains('form-control-plaintext')).toBe(true)
    expect(element.hasAttribute('readonly')).toBe(true)
  })

  it('should write the model from the input event', async () => {
    const value = shallowRef('')
    const host = mount(() => h(BFormControl, {
      'modelValue': value.value,
      'onUpdate:modelValue': (next: string) => {
        value.value = next
      },
    }))
    await settle()

    await userEvent.type(host.querySelector('input')!, 'ab')

    expect(value.value).toBe('ab')
  })
})
