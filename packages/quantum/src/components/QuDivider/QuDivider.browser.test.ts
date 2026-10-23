import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { QuDivider } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { QuDividerProps } from './QuDivider.vue'
import type { VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'

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

/** A divider inside a 320 px wide block, the width every geometry assertion below reads against. */
function divider (props: QuDividerProps & Record<string, unknown> = {}, dir?: string): HTMLElement {
  const host = mount(() => h('div', { style: 'width: 320px', dir }, [h(QuDivider, props)]))
  return host.querySelector('hr')!
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The top-level rule for a selector: the handset value, which no media block overrides at the test viewport. */
function rule (selector: string): CSSStyleRule | undefined {
  const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
  // CSSOM serialises attribute values with double quotes whatever the source wrote.
  return rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText.replaceAll('"', '\'') === selector)
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  vi.restoreAllMocks()
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('quDivider', () => {
  describe('anatomy', () => {
    it('should render a bare hr with the class and no explicit role, children or state hooks', async () => {
      const el = divider()
      await settle()

      expect(el.tagName).toBe('HR')
      expect(el.classList.contains('quantum-divider')).toBe(true)
      // The implicit separator role of <hr> is the semantics; nothing is written over it.
      expect(el.getAttribute('role')).toBeNull()
      expect(el.childNodes.length).toBe(0)
      expect(Object.hasOwn(el.dataset, 'inset')).toBe(false)
      expect(Object.keys(el.dataset)).toEqual([])
    })

    it('should warn nothing in dev: a static element has no parts to orphan', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      divider({ inset: true })
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })
  })

  describe('rule', () => {
    it('should draw 1 dp of 12% black as a top border with no margins and no height of its own', async () => {
      const el = divider()
      await settle()

      const rect = el.getBoundingClientRect()
      const computed = getComputedStyle(el)

      expect(rect.height).toBe(1)
      expect(computed.borderTopWidth).toBe('1px')
      expect(computed.borderTopStyle).toBe('solid')
      expect(computed.borderTopColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(computed.borderBottomWidth).toBe('0px')
      expect(computed.height).toBe('0px')
      expect(computed.marginTop).toBe('0px')
      expect(computed.marginBottom).toBe('0px')
      expect(computed.marginLeft).toBe('0px')
      expect(computed.marginRight).toBe('0px')
      expect(computed.backgroundColor).toBe('rgba(0, 0, 0, 0)')
    })

    it('should run edge to edge of its container when full bleed', async () => {
      const el = divider()
      await settle()

      const rect = el.getBoundingClientRect()
      const parent = el.parentElement!.getBoundingClientRect()

      expect(rect.left).toBe(parent.left)
      expect(rect.width).toBe(320)
    })

    it('should add exactly its 1 dp between two 48 dp tiles', async () => {
      const host = mount(() => h('div', { style: 'display: flex; flex-direction: column; width: 320px' }, [
        h('div', { style: 'height: 48px' }),
        h(QuDivider),
        h('div', { style: 'height: 48px' }),
      ]))
      await settle()

      const stack = host.firstElementChild!
      const el = stack.querySelector('hr')!

      expect(stack.getBoundingClientRect().height).toBe(97)
      // flex-shrink: 0 keeps the rule from collapsing inside a constrained flex column.
      expect(getComputedStyle(el).flexShrink).toBe('0')
      expect(el.getBoundingClientRect().width).toBe(320)
    })
  })

  describe('inset', () => {
    it('should expose data-inset and start the rule at the 80 dp content keyline from 600 px', async () => {
      // The test viewport is 1280 px wide: the tablet side of the keylines page's split.
      expect(matchMedia('(min-width: 600px)').matches).toBe(true)

      const el = divider({ inset: true })
      await settle()

      const rect = el.getBoundingClientRect()
      const parent = el.parentElement!.getBoundingClientRect()
      const computed = getComputedStyle(el)

      expect(Object.hasOwn(el.dataset, 'inset')).toBe(true)
      expect(computed.marginLeft).toBe('80px')
      expect(computed.marginRight).toBe('0px')
      expect(rect.left).toBe(parent.left + 80)
      expect(rect.right).toBe(parent.right)
      expect(rect.width).toBe(240)
    })

    it('should start at the 72 dp keyline on handsets, the rule outside every media block', async () => {
      divider({ inset: true })
      await settle()

      // Headless Chromium cannot shrink the viewport under 600 px inside one page, so the
      // handset value is read from the stylesheet: the inset rule that sits outside @media.
      const inset = rule('.quantum-divider[data-inset]')

      expect(inset).toBeDefined()
      expect(inset!.style.marginInlineStart.replaceAll(/\s+/g, ' ')).toBe('var(--quantum-keyline-content, 72px)')
    })

    it('should mirror the inset to the end edge under dir="rtl"', async () => {
      const el = divider({ inset: true }, 'rtl')
      await settle()

      const rect = el.getBoundingClientRect()
      const parent = el.parentElement!.getBoundingClientRect()
      const computed = getComputedStyle(el)

      expect(computed.marginRight).toBe('80px')
      expect(computed.marginLeft).toBe('0px')
      expect(rect.left).toBe(parent.left)
      expect(rect.right).toBe(parent.right - 80)
    })
  })

  describe('interaction', () => {
    it('should never take focus: Tab moves across it to the next control', async () => {
      const host = mount(() => h('div', [
        h('button', { id: 'before' }, 'Before'),
        h(QuDivider),
        h('button', { id: 'after' }, 'After'),
      ]))
      await settle()

      const [before, after] = host.querySelectorAll('button')
      const el = host.querySelector('hr')!

      expect(el.tabIndex).toBe(-1)

      before!.focus()
      await userEvent.tab()

      expect(document.activeElement).toBe(after)

      el.focus()

      expect(document.activeElement).not.toBe(el)
    })

    it('should pass consumer attributes and listeners through to the hr', async () => {
      let clicks = 0
      const el = divider({ 'aria-hidden': 'true', 'id': 'rule', 'onClick': () => clicks++ })
      await settle()

      // Decorative use between list items that are already separated semantically (dividers page).
      expect(el.getAttribute('aria-hidden')).toBe('true')
      expect(el.id).toBe('rule')

      await userEvent.click(el)

      expect(clicks).toBe(1)
    })

    it('should accept role="presentation" for a purely decorative rule', async () => {
      const el = divider({ role: 'presentation' })
      await settle()

      expect(el.getAttribute('role')).toBe('presentation')
    })
  })

  describe('theme', () => {
    it('should take the divider ink from the adapter sheet: 12% black on light, 12% white on dark', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const host = mount(() => h('div', { style: 'width: 320px' }, [
        h('div', { 'data-theme': 'quantum-light' }, [h(QuDivider)]),
        h('div', { 'data-theme': 'quantum-dark' }, [h(QuDivider), h(QuDivider, { inset: true })]),
      ]))
      await settle()

      const [light, dark, inset] = host.querySelectorAll('hr')

      expect(getComputedStyle(light!).borderTopColor).toBe('rgba(0, 0, 0, 0.12)')
      expect(getComputedStyle(dark!).borderTopColor).toBe('rgba(255, 255, 255, 0.12)')
      // The foundations publish the tablet keyline at this viewport; the fallback and the token agree.
      expect(getComputedStyle(inset!).marginLeft).toBe('80px')
    })
  })
})
