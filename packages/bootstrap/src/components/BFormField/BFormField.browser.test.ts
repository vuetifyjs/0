import { afterEach, describe, expect, it } from 'vitest'

import { BFormField } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { VNode } from 'vue'

import { conform } from '../../../harness/conform'
// Components
import { BFormControl } from '../BFormControl'
import { BFormFeedback } from '../BFormFeedback'
import { BFormLabel } from '../BFormLabel'
import { BFormText } from '../BFormText'

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

const help = 'We’ll never share your email with anyone else.'

describe('bFormField', () => {
  it('should conform to the basic field fixture', async () => {
    const host = mount(() => h(BFormField, () => [
      h(BFormLabel, { for: 'fieldText' }, () => 'Email address'),
      h(BFormControl, { id: 'fieldText', type: 'email', placeholder: 'name@example.com' }),
      h(BFormText, () => help),
    ]))
    await settle()

    conform(host.querySelector('.form-field')!, 'form-field:basic')
  })

  it('should add form-floating when floating', async () => {
    const host = mount(() => h(BFormField, { floating: true }))
    await settle()

    const element = host.querySelector('div')!

    expect(element.classList.contains('form-field')).toBe(true)
    expect(element.classList.contains('form-floating')).toBe(true)
    expect(element.classList.contains('form-floating-always')).toBe(false)
  })

  it('should add form-floating-always only with floating', async () => {
    const floated = mount(() => h(BFormField, { floating: true, always: true }))
    await settle()

    expect(floated.querySelector('div')!.classList.contains('form-floating-always')).toBe(true)

    const plain = mount(() => h(BFormField, { always: true }))
    await settle()

    const element = plain.querySelector('div')!

    expect(element.classList.contains('form-floating')).toBe(false)
    expect(element.classList.contains('form-floating-always')).toBe(false)
  })

  it('should render invalid and valid feedback classes', async () => {
    const host = mount(() => h(BFormField, () => [
      h(BFormFeedback, () => 'Full name is required'),
      h(BFormFeedback, { valid: true }, () => 'Looks great!'),
    ]))
    await settle()

    expect(host.querySelector('.invalid-feedback')!.textContent).toContain('Full name is required')
    expect(host.querySelector('.valid-feedback')!.textContent).toContain('Looks great!')
  })
})
