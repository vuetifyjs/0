// Conformance: BuNumberField and its three parts against the SELF-AUTHORED
// number-field fixture (Bulma ships no number input — see the fixture header
// for the per-class provenance rule), plus the behavior v0's NumberField
// supplies: stepping, bounds, keyboard, spin-on-hold, validation, and the
// ambient-root branch.
import { afterEach, describe, expect, it, vi } from 'vitest'

// Framework
import { isNull, NumberFieldRoot } from '@vuetify/v0'

// Context
import BuNumberField from './BuNumberField.vue'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

import { conform } from '../../../harness/conform'
import { BuField } from '../BuField'
import { BuHelp } from '../BuHelp'
import { BuLabel } from '../BuLabel'
import { BuNumberFieldDecrement } from '../BuNumberFieldDecrement'
import { BuNumberFieldIncrement } from '../BuNumberFieldIncrement'
import { BuNumberFieldInput } from '../BuNumberFieldInput'

// v0's NumberField.Control binds the display string plus the browser-hygiene
// attrs the docs markup has no reason to carry. `value` is the same tolerance
// BuInput/BuField already use; the other three are input hygiene, not Bulma
// contract.
const CONTROL = { ignoreAttrs: ['value', 'autocomplete', 'autocorrect', 'spellcheck'] }

const NS = 'v0:number-field:root'

const cleanups: (() => void)[] = []

function mount (render: () => unknown): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render })
  app.mount(host)
  cleanups.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

/** The three parts in fixture order — decrement, input, increment. */
function parts (props: Record<string, unknown> = {}) {
  return [
    h(BuNumberFieldDecrement),
    h(BuNumberFieldInput, props),
    h(BuNumberFieldIncrement),
  ]
}

function press (el: Element) {
  el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0 }))
}

/** v0 stops spin-on-hold from a document listener, so a drag-off still stops. */
function release () {
  document.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
}

function key (el: Element, init: KeyboardEventInit) {
  el.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, ...init }))
}

afterEach(() => {
  release()
  while (cleanups.length > 0) cleanups.pop()!()
})

describe('buNumberField', () => {
  it('conforms to the default composite', () => {
    const host = mount(() => h(BuNumberField, null, () => parts()))

    conform(host.firstElementChild!, 'number-field:default', CONTROL)
  })

  it('conforms to the expanded fixture', () => {
    const host = mount(() => h(BuNumberField, null, () => parts({ expanded: true })))

    conform(host.firstElementChild!, 'number-field:expanded', CONTROL)
  })

  it.each(['small', 'medium', 'large'] as const)('conforms to the %s size fixture', size => {
    const host = mount(() => h(BuNumberField, { size }, () => parts()))

    conform(host.firstElementChild!, `number-field:size ${size}`, CONTROL)
  })

  it('conforms to the color fixture — steppers only', () => {
    const host = mount(() => h(BuNumberField, { color: 'link' }, () => parts()))

    conform(host.firstElementChild!, 'number-field:color link', CONTROL)
  })

  it('conforms to the disabled fixture', () => {
    const host = mount(() => h(BuNumberField, { disabled: true }, () => parts()))

    conform(host.firstElementChild!, 'number-field:disabled', CONTROL)
  })

  it('conforms to the invalid fixture when a rule fails', async () => {
    const host = mount(() => h(BuNumberField, {
      rules: [() => 'Required'],
    }, () => parts()))

    const input = host.querySelector('input')!
    input.focus()
    input.blur()

    await vi.waitFor(() => expect(input.classList.contains('is-danger')).toBe(true))

    conform(host.firstElementChild!, 'number-field:invalid', CONTROL)
  })

  it('should increment and decrement by step on pointerdown', async () => {
    const model = shallowRef<number | null>(5)
    const host = mount(() => h(BuNumberField, {
      'modelValue': model.value,
      'onUpdate:modelValue': (value: number | null) => {
        model.value = value
      },
      'step': 2,
    }, () => parts()))

    const [decrement, increment] = [...host.querySelectorAll('button')]

    press(increment)
    release()
    expect(model.value).toBe(7)

    await nextTick()

    press(decrement)
    release()
    expect(model.value).toBe(5)
  })

  it('should disable the stepper at each bound and refuse to cross it', async () => {
    const model = shallowRef<number | null>(10)
    const host = mount(() => h(BuNumberField, {
      'modelValue': model.value,
      'onUpdate:modelValue': (value: number | null) => {
        model.value = value
      },
      'max': 10,
      'min': 0,
    }, () => parts()))

    const [decrement, increment] = [...host.querySelectorAll('button')]

    expect(increment.hasAttribute('disabled')).toBe(true)
    expect(decrement.hasAttribute('disabled')).toBe(false)

    press(increment)
    release()
    expect(model.value).toBe(10)

    model.value = 0
    await nextTick()

    expect(decrement.hasAttribute('disabled')).toBe(true)

    press(decrement)
    release()
    expect(model.value).toBe(0)
  })

  it('should step from the keyboard', async () => {
    const model = shallowRef<number | null>(10)
    const host = mount(() => h(BuNumberField, {
      'modelValue': model.value,
      'onUpdate:modelValue': (value: number | null) => {
        model.value = value
      },
      'leap': 5,
      'max': 100,
      'min': 0,
    }, () => parts()))

    const input = host.querySelector('input')!

    // The root reads its value from the bound prop, so each key needs a tick
    // to see the previous one's write.
    async function step (init: KeyboardEventInit, expected: number) {
      key(input, init)
      expect(model.value).toBe(expected)
      await nextTick()
    }

    await step({ key: 'ArrowUp' }, 11)
    await step({ key: 'ArrowDown' }, 10)
    await step({ key: 'ArrowUp', shiftKey: true }, 20)
    await step({ key: 'PageUp' }, 25)
    await step({ key: 'PageDown' }, 20)
    await step({ key: 'Home' }, 0)
    await step({ key: 'End' }, 100)
  })

  it('should commit typed text on Enter', () => {
    const model = shallowRef<number | null>(null)
    const host = mount(() => h(BuNumberField, {
      'modelValue': model.value,
      'onUpdate:modelValue': (value: number | null) => {
        model.value = value
      },
    }, () => parts()))

    const input = host.querySelector('input')!
    input.focus()
    input.value = '42'
    input.dispatchEvent(new Event('input', { bubbles: true }))

    key(input, { key: 'Enter' })

    expect(model.value).toBe(42)
  })

  it('should repeat while held and stop on a document pointerup', async () => {
    const model = shallowRef<number | null>(0)
    const host = mount(() => h(BuNumberField, {
      'modelValue': model.value,
      'onUpdate:modelValue': (value: number | null) => {
        model.value = value
      },
      'spinDelay': 30,
      'spinRate': 10,
    }, () => parts()))

    const increment = [...host.querySelectorAll('button')][1]

    press(increment)

    expect(model.value).toBe(1)

    await vi.waitFor(() => expect(model.value!).toBeGreaterThan(2))

    // Released off the button: only the document listener can see it.
    release()

    const settled = model.value
    await new Promise(resolve => setTimeout(resolve, 60))

    expect(model.value).toBe(settled)
  })

  it('should show the formatted value while blurred and the raw value while focused', async () => {
    const host = mount(() => h(BuNumberField, {
      format: { minimumFractionDigits: 2 },
      modelValue: 5,
    }, () => parts()))

    const input = host.querySelector('input')!

    await nextTick()
    expect(input.value).toBe('5.00')

    input.focus()
    await nextTick()
    expect(input.value).toBe('5')
  })

  it('should keep a readonly input focusable while the steppers stay inert', () => {
    const model = shallowRef<number | null>(3)
    const host = mount(() => h(BuNumberField, {
      'modelValue': model.value,
      'onUpdate:modelValue': (value: number | null) => {
        model.value = value
      },
      'readonly': true,
    }, () => parts()))

    const input = host.querySelector('input')!
    const [decrement, increment] = [...host.querySelectorAll('button')]

    expect(input.hasAttribute('readonly')).toBe(true)
    expect(input.hasAttribute('disabled')).toBe(false)
    expect(increment.hasAttribute('disabled')).toBe(true)
    expect(decrement.hasAttribute('disabled')).toBe(true)

    input.focus()
    expect(document.activeElement).toBe(input)

    press(increment)
    release()
    expect(model.value).toBe(3)
  })

  it('should wire BuHelp and aria-errormessage through the ambient root namespace', async () => {
    const host = mount(() => h(NumberFieldRoot, {
      renderless: true,
      rules: [(value: unknown) => !isNull(value) || 'Required'],
    }, () => h(BuField, null, () => [
      h(BuLabel, { namespace: NS }, () => 'Quantity'),
      h(BuNumberField, null, () => parts({ expanded: true })),
      h(BuHelp, { namespace: NS, validation: true }),
    ])))

    const input = host.querySelector('input')!
    input.focus()
    input.blur()

    await vi.waitFor(() => expect(input.classList.contains('is-danger')).toBe(true))

    const help = host.querySelector('p.help')!
    expect(help.classList.contains('is-danger')).toBe(true)
    expect(help.textContent).toContain('Required')
    expect(input.getAttribute('aria-errormessage')).toBe(help.getAttribute('id'))
  })

  it('should not create a second root inside an ambient NumberField.Root', async () => {
    const host = mount(() => h(NumberFieldRoot, {
      id: 'ambient-quantity',
      modelValue: 4,
      renderless: true,
    }, () => h(BuNumberField, null, () => parts())))

    await nextTick()

    expect(host.querySelectorAll('.field.has-addons')).toHaveLength(1)
    expect(host.querySelectorAll('input')).toHaveLength(1)
    expect(host.querySelector('input')!.id).toBe('ambient-quantity')
    expect(host.querySelector('input')!.value).toBe('4')
  })
})
