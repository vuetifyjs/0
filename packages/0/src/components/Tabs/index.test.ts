import { describe, expect, it, vi } from 'vitest'

import { Tabs } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { h, nextTick, ref } from 'vue'

describe('tabs', () => {
  describe('renderless el focus target', () => {
    function key (name: string) {
      return new KeyboardEvent('keydown', { key: name })
    }

    function mountPair (options: {
      activation?: 'automatic' | 'manual'
      as?: null
      firstEl?: HTMLElement
      secondEl?: HTMLElement
      firstDisabled?: boolean
      secondDisabled?: boolean
      mandatory?: boolean | 'force'
    } = {}) {
      const selected = ref('tab-1')
      const captured: Record<string, { attrs: { onKeydown: (e: KeyboardEvent) => void } }> = {}

      mount(Tabs.Root, {
        props: {
          'activation': options.activation ?? 'automatic',
          'mandatory': options.mandatory,
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Tabs.Item as never, {
              as: options.as,
              el: options.firstEl,
              value: 'tab-1',
              disabled: options.firstDisabled,
            }, {
              default: (props: { attrs: { onKeydown: (e: KeyboardEvent) => void } }) => {
                captured.tab1 = props
                return h('button', props.attrs, 'Tab 1')
              },
            }),
            h(Tabs.Item as never, {
              as: options.as,
              el: options.secondEl,
              value: 'tab-2',
              disabled: options.secondDisabled,
            }, {
              default: (props: { attrs: { onKeydown: (e: KeyboardEvent) => void } }) => {
                captured.tab2 = props
                return h('button', props.attrs, 'Tab 2')
              },
            }),
          ],
        },
      })

      return { selected, captured }
    }

    it('should call focus on the supplied el after ArrowRight', async () => {
      const first = document.createElement('button')
      const second = document.createElement('button')
      const focus = vi.spyOn(second, 'focus')

      const { selected, captured } = mountPair({ as: null, firstEl: first, secondEl: second })
      await nextTick()

      captured.tab1!.attrs.onKeydown(key('ArrowRight'))
      await nextTick()

      expect(selected.value).toBe('tab-2')
      expect(focus).toHaveBeenCalledTimes(1)
    })

    it('should call focus on the supplied el after Home in manual mode', async () => {
      const first = document.createElement('button')
      const second = document.createElement('button')
      const focus = vi.spyOn(first, 'focus')

      const { selected, captured } = mountPair({
        activation: 'manual',
        as: null,
        firstEl: first,
        secondEl: second,
      })
      await nextTick()

      captured.tab2!.attrs.onKeydown(key('Home'))
      await nextTick()

      expect(selected.value).toBe('tab-1')
      expect(focus).toHaveBeenCalledTimes(1)
    })

    it('should not call focus when as is null and el is omitted', async () => {
      const { selected, captured } = mountPair({ as: null })
      await nextTick()

      captured.tab1!.attrs.onKeydown(key('ArrowRight'))
      await nextTick()

      expect(selected.value).toBe('tab-2')
    })

    it('should not call focus on Home when as is null and el is omitted (manual)', async () => {
      const { selected, captured } = mountPair({ activation: 'manual', as: null })
      await nextTick()

      captured.tab2!.attrs.onKeydown(key('Home'))
      await nextTick()

      expect(selected.value).toBe('tab-1')
    })

    it('should not call focus on Home when every tab is disabled (manual)', async () => {
      const first = document.createElement('button')
      const second = document.createElement('button')
      const focusFirst = vi.spyOn(first, 'focus')
      const focusSecond = vi.spyOn(second, 'focus')

      const { captured } = mountPair({
        activation: 'manual',
        firstEl: first,
        secondEl: second,
        firstDisabled: true,
        secondDisabled: true,
        mandatory: false,
      })
      await nextTick()

      captured.tab1!.attrs.onKeydown(key('Home'))
      await nextTick()

      expect(focusFirst).not.toHaveBeenCalled()
      expect(focusSecond).not.toHaveBeenCalled()
    })
  })
})
