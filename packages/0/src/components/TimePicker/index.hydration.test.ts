import { describe, expect, it } from 'vitest'

// Composables
import { createLocalePlugin } from '#v0/composables/useLocale'

import { hydrate } from '#v0/test-utils/hydrate'

import { TimePicker } from './index'

// Utilities
import { createApp, h, shallowRef } from 'vue'

// Types
import type { Component, VNode } from 'vue'

function shown (Part: unknown): VNode {
  return h(Part as Component, {}, { default: ({ text }: { text: string }) => text })
}

function parts (): VNode[] {
  return [
    shown(TimePicker.Hour),
    shown(TimePicker.Minute),
    shown(TimePicker.Second),
    shown(TimePicker.Period),
  ]
}

// The handler makes the model controlled, as `v-model` does. A server render
// cannot re-render its parent, so the prop keeps the value it was given.
function refusing (modelValue: string) {
  const props = { modelValue, 'minuteStep': 15, 'name': 'alarm', 'onUpdate:modelValue': () => {} }

  return h(TimePicker.Root as unknown as Component, props, parts)
}

// State shared by the server and the client app, the way an app carries it
// across: the server's write is in the model before the client starts.
function stateful (start: string, options: Record<string, unknown>) {
  const model = shallowRef<string | null>(start)

  function render () {
    return h(TimePicker.Root as unknown as Component, {
      ...options,
      'name': 'alarm',
      'modelValue': model.value,
      'onUpdate:modelValue': (value: string | null) => {
        model.value = value
      },
    }, parts)
  }

  return { model, render }
}

function attribute (html: string, part: string, name: string): string | undefined {
  const tag = new RegExp(`<[^>]*data-part="${part}"[^>]*>`).exec(html)?.[0] ?? ''
  return new RegExp(` ${name}="([^"]*)"`).exec(tag)?.[1]
}

describe('timePicker SSR hydration', () => {
  it('should render the hidden input from the fields, not the raw model', async () => {
    const { html, mismatches } = await hydrate(() => refusing('09:07'))

    expect(attribute(html, 'minute', 'aria-valuenow')).toBe('0')
    expect(html).toContain('value="09:00"')
    expect(html).not.toContain('09:07')
    expect(mismatches).toEqual([])
  })

  it('should give server and client the same markup for a model one normalizes and the other receives normalized', async () => {
    let side = 0
    const { html, mismatches } = await hydrate(() => refusing(side === 1 ? '09:07' : '09:00'), {
      setup: () => {
        side++
      },
    })

    expect(html).toContain('value="09:00"')
    expect(mismatches).toEqual([])
  })

  it.each([
    ['a step', '09:07', { minuteStep: 15 }, '09:00'],
    ['seconds', '09:07:50', { seconds: true, secondStep: 20 }, '09:07:40'],
    ['a bound', '08:00', { minuteStep: 15, min: '09:10' }, '09:15'],
    ['a 12-hour cycle', '15:07', { hourCycle: 'h12', minuteStep: 15 }, '15:00'],
  ])('should hydrate a model the server normalized for %s', async (_, start, options, wanted) => {
    const { model, render } = stateful(start, options)
    const { html, mismatches } = await hydrate(render)

    expect(model.value).toBe(wanted)
    expect(html).toContain(`value="${wanted}"`)
    expect(mismatches).toEqual([])
  })

  it('should speak the 12-hour hour the same way on the server and the client', async () => {
    const { render } = stateful('15:07', { hourCycle: 'h12', minuteStep: 15 })
    const server = await hydrate(render)

    const container = document.createElement('div')
    const app = createApp({ render })
    app.mount(container)

    const client = container.querySelector('[data-part="hour"]')?.getAttribute('aria-valuetext')
    app.unmount()

    expect(attribute(server.html, 'hour', 'aria-valuetext')).toBe('3 PM')
    expect(client).toBe('3 PM')
    expect(server.mismatches).toEqual([])
  })

  it('should show the digits of a locale with its own numerals on both sides', async () => {
    const { model, render } = stateful('15:07', { hourCycle: 'h12' })
    const { html, mismatches } = await hydrate(render, {
      setup: app => {
        app.use(createLocalePlugin({ default: 'ar-EG', messages: { 'ar-EG': {} } }))
      },
    })

    const digits = new Intl.NumberFormat('ar-EG')

    expect(html).toContain(`>${digits.format(0)}${digits.format(3)}<`)
    expect(html).toContain(`>${digits.format(0)}${digits.format(7)}<`)
    expect(attribute(html, 'hour', 'aria-valuetext')).toContain(digits.format(3))
    expect(html).toContain('value="15:07"')
    expect(model.value).toBe('15:07')
    expect(mismatches).toEqual([])
  })
})
