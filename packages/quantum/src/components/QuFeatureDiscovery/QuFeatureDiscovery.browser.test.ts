import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createStackPlugin } from '@vuetify/v0'

import { QuFeatureDiscovery, QuFeatureDiscoveryTarget, QuFeatureDiscoveryText, QuFeatureDiscoveryTitle } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { QuFeatureDiscoveryProps } from './QuFeatureDiscovery.vue'
import type { ShallowRef, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'
// Components
import { QuButton } from '../QuButton'

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.use(createStackPlugin())
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

interface Options extends QuFeatureDiscoveryProps {
  open?: ShallowRef<boolean>
  /** Where the promoted action sits, from the viewport's top left. */
  at?: { x: number, y: number }
  dir?: 'ltr' | 'rtl'
  /** Wrap the action in a card of this size, centred on the action. */
  card?: { width: number, height: number }
  onComplete?: () => void
  onDismiss?: () => void
  onAction?: () => void
}

/** A prompt over one icon-only QuButton, positioned absolutely so the edge rules are deterministic. */
function prompt (options: Options = {}): HTMLElement {
  const {
    open = shallowRef(true),
    at = { x: 640, y: 400 },
    dir = 'ltr',
    card,
    onComplete,
    onDismiss,
    onAction,
    ...props
  } = options

  function action () {
    return h(QuFeatureDiscovery.Target, null, () => h(QuButton, { ariaLabel: 'Search', icon: 'search', id: 'action', onClick: onAction }))
  }

  function tree () {
    return h(QuFeatureDiscovery, {
      ...props,
      'modelValue': open.value,
      'onUpdate:modelValue': (next: boolean) => {
        open.value = next
      },
      onComplete,
      onDismiss,
    }, () => [
      card
        ? h('div', {
            class: 'quantum-card',
            id: 'card',
            style: {
              position: 'absolute',
              left: `${-card.width / 2 + 24}px`,
              top: `${-card.height / 2 + 24}px`,
              width: `${card.width}px`,
              height: `${card.height}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
          }, [action()])
        : action(),
      h(QuFeatureDiscovery.Title, null, () => 'Find mail fast'),
      h(QuFeatureDiscovery.Text, null, () => 'Search by sender, subject or date.'),
    ])
  }

  return mount(() => h('div', [
    h('button', { id: 'opener', type: 'button', style: { position: 'absolute', left: '0px', top: '0px' } }, 'Opener'),
    h('div', {
      dir,
      style: { position: 'absolute', left: `${at.x - 24}px`, top: `${at.y - 24}px` },
    }, [tree()]),
  ]))
}

function layer (): HTMLElement | null {
  return document.querySelector<HTMLElement>('.quantum-feature-discovery')
}

function background (): HTMLElement {
  return document.querySelector<HTMLElement>('.quantum-feature-discovery__background')!
}

function disc (): HTMLElement {
  return document.querySelector<HTMLElement>('.quantum-feature-discovery__target')!
}

function content (): HTMLElement | null {
  return document.querySelector<HTMLElement>('.quantum-feature-discovery__content')
}

function centre (el: Element) {
  const rect = el.getBoundingClientRect()

  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height }
}

/** The browser's own serialization of a clip path, so assertions never guess at its formatting. */
function serialize (value: string): string {
  const probe = document.createElement('div')
  probe.style.clipPath = value

  return probe.style.clipPath
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** Every rule in the page's sheets whose selector matches, inside or outside media blocks. */
function rules (selector: string): CSSStyleRule[] {
  const found: CSSStyleRule[] = []

  function visit (list: CSSRuleList) {
    for (const rule of list) {
      if (rule instanceof CSSStyleRule && rule.selectorText === selector) found.push(rule)
      else if (rule instanceof CSSMediaRule) visit(rule.cssRules)
    }
  }

  for (const sheet of document.styleSheets) visit(sheet.cssRules)

  return found
}

/** A full press outside every prompt element: pointerdown, pointerup and click on the opener. */
async function outside () {
  await userEvent.click(document.querySelector('#opener')!)
}

/** The prompt has measured: both circles are placed and the text is in. */
async function ready () {
  await expect.poll(() => document.querySelector('.quantum-feature-discovery__target')).not.toBeNull()
  await expect.poll(() => content()?.querySelector('.quantum-feature-discovery__title')).toBeTruthy()
  await nextTick()
}

async function settle () {
  await nextTick()
  await nextTick()
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  vi.restoreAllMocks()
})

describe('quFeatureDiscovery', () => {
  describe('anatomy', () => {
    it('should attach the parts to the root and keep the flat names', () => {
      expect(QuFeatureDiscovery.Target).toBe(QuFeatureDiscoveryTarget)
      expect(QuFeatureDiscovery.Title).toBe(QuFeatureDiscoveryTitle)
      expect(QuFeatureDiscovery.Text).toBe(QuFeatureDiscoveryText)
    })

    it('should render only the action while closed', async () => {
      const host = prompt({ open: shallowRef(false) })
      await settle()

      expect(host.querySelector('#action')).not.toBeNull()
      expect(host.querySelector('.quantum-feature-discovery__action')!.contains(host.querySelector('#action'))).toBe(true)
      expect(layer()).toBeNull()
      expect(content()).toBeNull()
      expect(document.querySelector('.quantum-feature-discovery__title')).toBeNull()
      expect(document.querySelector('.quantum-feature-discovery__text')).toBeNull()
    })

    it('should draw the background and the target disc, with the ripple first in the disc', async () => {
      prompt()
      await ready()

      const el = layer()!

      expect(el.dataset.open).toBe('true')
      expect(el.querySelector('.quantum-feature-discovery__background')!.getAttribute('aria-hidden')).toBe('true')
      expect(disc().getAttribute('aria-hidden')).toBe('true')
      expect(disc().firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
    })

    it('should render the title and text inside a non-modal dialog that they name and describe', async () => {
      prompt()
      await ready()

      const dialog = content()!
      const title = dialog.querySelector('h2.quantum-feature-discovery__title')!
      const text = dialog.querySelector('p.quantum-feature-discovery__text')!

      expect(dialog.getAttribute('role')).toBe('dialog')
      expect(dialog.hasAttribute('aria-modal')).toBe(false)
      expect(title.textContent).toBe('Find mail fast')
      expect(text.textContent).toBe('Search by sender, subject or date.')
      await expect.poll(() => dialog.getAttribute('aria-labelledby')).toBe(title.id)
      expect(dialog.getAttribute('aria-describedby')).toBe(text.id)
    })

    it('should keep the title above the text whatever order they are written in', async () => {
      mount(() => h(QuFeatureDiscovery, { modelValue: true }, () => [
        h(QuFeatureDiscovery.Text, null, () => 'Body'),
        h(QuFeatureDiscovery.Target, null, () => h(QuButton, { ariaLabel: 'Add', icon: 'add' })),
        h(QuFeatureDiscovery.Title, null, () => 'Headline'),
      ]))
      await ready()

      const title = content()!.querySelector('.quantum-feature-discovery__title')!
      const text = content()!.querySelector('.quantum-feature-discovery__text')!

      expect(title.getBoundingClientRect().top).toBeLessThan(text.getBoundingClientRect().top)
    })

    it('should keep the action named and operable while the prompt shows', async () => {
      prompt()
      await ready()

      const action = document.querySelector<HTMLButtonElement>('#action')!

      expect(action.getAttribute('aria-label')).toBe('Search')
      expect(action.disabled).toBe(false)
      expect(action.closest('[inert]')).toBeNull()
    })
  })

  describe('spec values', () => {
    it('should paint the background in the primary colour at 96% and the disc white', async () => {
      prompt()
      await ready()

      expect(layer()!.dataset.color).toBe('primary')
      expect(getComputedStyle(background()).backgroundColor).toBe('rgba(63, 81, 181, 0.96)')
      expect(getComputedStyle(background()).borderRadius).toBe('50%')
      expect(getComputedStyle(disc()).backgroundColor).toBe('rgb(255, 255, 255)')
    })

    it('should paint the background in the accent colour at 96% with color="accent"', async () => {
      prompt({ color: 'accent' })
      await ready()

      expect(layer()!.dataset.color).toBe('accent')
      expect(content()!.dataset.color).toBe('accent')
      expect(getComputedStyle(background()).backgroundColor).toBe('rgba(255, 64, 129, 0.96)')
    })

    it('should set the title in Title 20 sp white and the text in Subheading 16 sp white at 70%', async () => {
      prompt()
      await ready()

      const title = getComputedStyle(content()!.querySelector('.quantum-feature-discovery__title')!)
      const text = getComputedStyle(content()!.querySelector('.quantum-feature-discovery__text')!)

      expect(title.fontSize).toBe('20px')
      expect(title.fontWeight).toBe('500')
      expect(title.color).toBe('rgb(255, 255, 255)')
      expect(text.fontSize).toBe('16px')
      expect(text.fontWeight).toBe('400')
      expect(text.lineHeight).toBe('24px')
      expect(text.color).toBe('rgba(255, 255, 255, 0.7)')
    })

    it('should draw an 88 dp target disc centred on the action and a background at least 2.5 times it', async () => {
      prompt()
      await ready()

      const action = centre(document.querySelector('#action')!)
      const target = centre(disc())

      expect(target.width).toBe(88)
      expect(target.height).toBe(88)
      expect(target.x).toBeCloseTo(action.x, 0)
      expect(target.y).toBeCloseTo(action.y, 0)
      expect(centre(background()).width).toBeGreaterThanOrEqual(220)
    })

    it('should size the background to hold the whole text', async () => {
      prompt()
      await ready()
      await expect.poll(() => {
        const field = centre(background())
        const box = content()!.getBoundingClientRect()
        const corners = [[box.left, box.top], [box.right, box.top], [box.left, box.bottom], [box.right, box.bottom]]

        return corners.every(([x, y]) => Math.hypot(x - field.x, y - field.y) <= field.width / 2)
      }).toBe(true)
    })

    it('should put the text below a target in the upper half and above one in the lower half', async () => {
      prompt({ at: { x: 640, y: 300 } })
      await ready()

      await expect.poll(() => content()!.getBoundingClientRect().top).toBeGreaterThan(document.querySelector('#action')!.getBoundingClientRect().bottom)
      teardowns.pop()!()

      prompt({ at: { x: 640, y: 560 } })
      await ready()

      await expect.poll(() => content()!.getBoundingClientRect().bottom).toBeLessThan(document.querySelector('#action')!.getBoundingClientRect().top)
    })

    it('should keep the text inside the screen beside its edge', async () => {
      prompt({ at: { x: 1250, y: 400 }, contained: false })
      await ready()

      await expect.poll(() => content()!.getBoundingClientRect().right).toBeLessThanOrEqual(innerWidth - 16)
    })

    it('should clear the target disc with the text', async () => {
      prompt({ at: { x: 640, y: 300 } })
      await ready()

      await expect.poll(() => content()!.getBoundingClientRect().top).toBeGreaterThanOrEqual(disc().getBoundingClientRect().bottom)
    })
  })

  describe('edge rules', () => {
    it('should centre the background on a target within 88 dp of the screen top', async () => {
      prompt({ at: { x: 1000, y: 40 }, contained: false })
      await ready()

      expect(layer()!.dataset.placement).toBe('center')
      expect(centre(background()).x).toBeCloseTo(centre(disc()).x, 0)
    })

    it('should centre the background on a target within 88 dp of the screen bottom', async () => {
      prompt({ at: { x: 1000, y: 760 }, contained: false })
      await ready()

      expect(layer()!.dataset.placement).toBe('center')
    })

    it('should offset the background 20 dp to the left of a target right of centre', async () => {
      prompt({ at: { x: 1000, y: 400 }, contained: false })
      await ready()

      expect(layer()!.dataset.placement).toBe('start')
      expect(centre(background()).x).toBeCloseTo(centre(disc()).x - 20, 0)
      expect(centre(background()).y).toBeCloseTo(centre(disc()).y, 0)
    })

    it('should offset the background 20 dp to the right of a target left of centre', async () => {
      prompt({ at: { x: 300, y: 400 }, contained: false })
      await ready()

      expect(layer()!.dataset.placement).toBe('end')
      expect(centre(background()).x).toBeCloseTo(centre(disc()).x + 20, 0)
    })

    it('should offset the background toward the writing direction for a centred target', async () => {
      prompt({ at: { x: 640, y: 400 }, contained: false })
      await ready()

      expect(layer()!.dataset.placement).toBe('end')
      expect(centre(background()).x).toBeCloseTo(centre(disc()).x + 20, 0)
      teardowns.pop()!()

      prompt({ at: { x: 640, y: 400 }, contained: false, dir: 'rtl' })
      await ready()

      expect(layer()!.dataset.placement).toBe('end')
      expect(centre(background()).x).toBeCloseTo(centre(disc()).x - 20, 0)
    })

    it('should mirror the offset side under dir="rtl"', async () => {
      prompt({ at: { x: 1000, y: 400 }, contained: false, dir: 'rtl' })
      await ready()

      // Right of centre still moves the background left, which is the end side in RTL.
      expect(layer()!.dataset.placement).toBe('end')
      expect(centre(background()).x).toBeCloseTo(centre(disc()).x - 20, 0)
    })

    it('should force the offset side with placement', async () => {
      prompt({ at: { x: 300, y: 400 }, contained: false, placement: 'start' })
      await ready()

      expect(layer()!.dataset.placement).toBe('start')
      expect(centre(background()).x).toBeCloseTo(centre(disc()).x - 20, 0)
    })

    it('should let the screen edge rule win over placement', async () => {
      prompt({ at: { x: 300, y: 40 }, contained: false, placement: 'start' })
      await ready()

      expect(layer()!.dataset.placement).toBe('center')
    })
  })

  describe('contained', () => {
    it('should limit the prompt to the card the target rests on from 600 px up', async () => {
      prompt({ at: { x: 640, y: 400 }, card: { width: 600, height: 400 } })
      await ready()

      const el = layer()!
      const card = document.querySelector('#card')!.getBoundingClientRect()

      expect(el.dataset.contained).toBe('true')
      expect(el.style.clipPath).toBe(serialize(`inset(${card.top}px ${innerWidth - card.right}px ${innerHeight - card.bottom}px ${card.left}px)`))
    })

    it('should centre the background on a target within 88 dp of the card edge', async () => {
      // The card's top edge sits 24 dp above the action's.
      prompt({ at: { x: 640, y: 400 }, card: { width: 600, height: 400 } })
      await ready()

      expect(layer()!.dataset.placement).toBe('end')
      teardowns.pop()!()

      mount(() => h('div', {
        class: 'quantum-card',
        id: 'card',
        style: { position: 'absolute', left: '340px', top: '250px', width: '600px', height: '400px' },
      }, [
        h('div', { style: { position: 'absolute', left: '400px', top: '24px' } }, [
          h(QuFeatureDiscovery, { modelValue: true }, () => [
            h(QuFeatureDiscovery.Target, null, () => h(QuButton, { ariaLabel: 'Add', icon: 'add' })),
            h(QuFeatureDiscovery.Title, null, () => 'Add'),
          ]),
        ]),
      ]))
      await ready()

      expect(layer()!.dataset.contained).toBe('true')
      expect(layer()!.dataset.placement).toBe('center')

      // The action sits near the card's end edge; the text is kept on the card.
      const card = document.querySelector('#card')!.getBoundingClientRect()

      await expect.poll(() => content()!.getBoundingClientRect().right).toBeLessThanOrEqual(card.right - 16)
      expect(content()!.getBoundingClientRect().left).toBeGreaterThanOrEqual(card.left + 16)
    })

    it('should let the prompt extend past a card smaller than 280 dp tall and 360 dp wide', async () => {
      prompt({ at: { x: 640, y: 400 }, card: { width: 300, height: 200 } })
      await ready()

      expect(layer()!.dataset.contained).toBeUndefined()
      expect(layer()!.style.clipPath).toBe('')
    })

    it('should centre an unconfined background within the 200 dp side band of the screen', async () => {
      prompt({ at: { x: 120, y: 400 }, card: { width: 200, height: 400 } })
      await ready()

      expect(layer()!.dataset.contained).toBeUndefined()
      expect(layer()!.dataset.placement).toBe('center')
    })

    it('should not contain the prompt when contained is false', async () => {
      prompt({ at: { x: 640, y: 400 }, card: { width: 600, height: 400 }, contained: false })
      await ready()

      expect(layer()!.dataset.contained).toBeUndefined()
    })

    it('should contain the prompt in the parent element when contained is set and no card is found', async () => {
      mount(() => h('div', {
        id: 'surface',
        style: { position: 'absolute', left: '340px', top: '250px', width: '600px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
      }, [
        h(QuFeatureDiscovery, { modelValue: true, contained: true }, () => [
          h(QuFeatureDiscovery.Target, null, () => h(QuButton, { ariaLabel: 'Add', icon: 'add' })),
          h(QuFeatureDiscovery.Title, null, () => 'Add'),
        ]),
      ]))
      await ready()

      expect(layer()!.dataset.contained).toBe('true')
      expect(layer()!.style.clipPath).toBe(serialize(`inset(250px ${innerWidth - 940}px ${innerHeight - 650}px 340px)`))
    })
  })

  describe('stacking and motion', () => {
    it('should lift the action one layer above the circles while the prompt shows', async () => {
      prompt()
      await ready()

      const wrap = document.querySelector<HTMLElement>('.quantum-feature-discovery__action')!
      const depth = Number(layer()!.style.zIndex)

      expect(depth).toBeGreaterThan(0)
      await expect.poll(() => getComputedStyle(wrap).zIndex).toBe(String(depth + 1))
      expect(getComputedStyle(wrap).position).toBe('relative')
      expect(wrap.dataset.active).toBe('true')
      expect(document.elementFromPoint(centre(wrap).x, centre(wrap).y)!.closest('#action')).not.toBeNull()
    })

    it('should declare the 10% idle pulse on the action and the ripple on the disc', () => {
      prompt({ open: shallowRef(false) })

      const pulse = rules('.quantum-feature-discovery__action[data-active]')
        .find(rule => rule.style.animation.includes('quantum-feature-discovery-pulse'))

      // The shorthands hold var() tokens, so the browser keeps them unparsed: assert on the declared text.
      expect(pulse).toBeDefined()
      expect(pulse!.style.animation).toContain('2s')
      expect(pulse!.style.animation).toContain('infinite')
      expect(rules('.quantum-feature-discovery[data-state="present"] .quantum-feature-discovery__target::after')[0].style.animation).toContain('quantum-feature-discovery-ripple')
    })

    it('should drop the pulse and the scaling under reduced motion and fade instead', async () => {
      prompt()
      await ready()

      expect(getComputedStyle(document.querySelector('.quantum-feature-discovery__action')!).animationName).toBe('none')
      expect(getComputedStyle(background()).animationName).toBe('quantum-feature-discovery-fade')
    })

    it('should appear on the standard curve over the enter duration and leave on the decelerate curve', () => {
      prompt({ open: shallowRef(false) })

      const appear = rules('.quantum-feature-discovery__background')[0].style
      const dismiss = rules('.quantum-feature-discovery[data-state="leaving"][data-exit="dismiss"] .quantum-feature-discovery__background, .quantum-feature-discovery[data-state="leaving"][data-exit="dismiss"] .quantum-feature-discovery__target')[0].style
      const complete = rules('.quantum-feature-discovery[data-state="leaving"][data-exit="complete"] .quantum-feature-discovery__background, .quantum-feature-discovery[data-state="leaving"][data-exit="complete"] .quantum-feature-discovery__target')[0].style

      expect(appear.animation).toContain('quantum-feature-discovery-appear')
      expect(appear.animation).toContain('--quantum-easing-standard')
      expect(appear.animation).toContain('--quantum-duration-enter')
      expect(dismiss.animation).toContain('quantum-feature-discovery-dismiss')
      expect(dismiss.animation).toContain('--quantum-easing-decelerate')
      expect(dismiss.animation).toContain('--quantum-duration-leave')
      expect(complete.animation).toContain('quantum-feature-discovery-complete')
      expect(complete.animation).toContain('--quantum-easing-decelerate')
      expect(complete.animation).toContain('--quantum-duration-leave')
    })
  })

  describe('completion and dismissal', () => {
    it('should complete when the action is tapped, running the action and closing the model', async () => {
      const open = shallowRef(true)
      const onComplete = vi.fn()
      const onDismiss = vi.fn()
      const onAction = vi.fn()
      prompt({ open, onComplete, onDismiss, onAction })
      await ready()

      await userEvent.click(document.querySelector('#action')!)
      await settle()

      expect(onAction).toHaveBeenCalledTimes(1)
      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(onDismiss).not.toHaveBeenCalled()
      expect(open.value).toBe(false)
      expect(layer()!.dataset.exit).toBe('complete')
      expect(layer()!.dataset.state).toBe('leaving')
      await expect.poll(() => layer()).toBeNull()
      expect(content()).toBeNull()
    })

    it('should complete when the target disc around the action is tapped', async () => {
      const onComplete = vi.fn()
      const onAction = vi.fn()
      const onDismiss = vi.fn()
      prompt({ onComplete, onAction, onDismiss })
      await ready()

      // A real press on the disc's rim, outside the lifted action: pointerdown and
      // pointerup must not read as a tap outside, and the click must reach the action.
      const rect = disc().getBoundingClientRect()

      expect(document.elementFromPoint(rect.left + 6, rect.top + rect.height / 2)!.closest('.quantum-feature-discovery__target')).not.toBeNull()

      await userEvent.click(disc(), { position: { x: 6, y: rect.height / 2 } })
      await settle()

      expect(onAction).toHaveBeenCalledTimes(1)
      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(onDismiss).not.toHaveBeenCalled()
    })

    it('should complete from the keyboard on the focused action, with Enter or Space', async () => {
      for (const key of ['{Enter}', ' ']) {
        const onComplete = vi.fn()
        prompt({ onComplete })
        await ready()

        document.querySelector<HTMLButtonElement>('#action')!.focus()
        await userEvent.keyboard(key)
        await settle()

        expect(onComplete).toHaveBeenCalledTimes(1)
        teardowns.pop()!()
        await expect.poll(() => layer()).toBeNull()
      }
    })

    it('should report a dismissal after a completed run when the prompt is shown again', async () => {
      const open = shallowRef(true)
      const onComplete = vi.fn()
      const onDismiss = vi.fn()
      prompt({ open, onComplete, onDismiss })
      await ready()

      await userEvent.click(document.querySelector('#action')!)
      await expect.poll(() => layer()).toBeNull()

      open.value = true
      await ready()

      expect(layer()!.dataset.open).toBe('true')

      await userEvent.keyboard('{Escape}')
      await settle()

      expect(onComplete).toHaveBeenCalledTimes(1)
      expect(onDismiss).toHaveBeenCalledTimes(1)
      expect(layer()!.dataset.exit).toBe('dismiss')
    })

    it('should dismiss on a tap outside the background', async () => {
      const open = shallowRef(true)
      const onComplete = vi.fn()
      const onDismiss = vi.fn()
      prompt({ open, at: { x: 1000, y: 600 }, onComplete, onDismiss })
      await ready()

      await outside()
      await settle()

      expect(onDismiss).toHaveBeenCalledTimes(1)
      expect(onComplete).not.toHaveBeenCalled()
      expect(open.value).toBe(false)
      expect(layer()!.dataset.exit).toBe('dismiss')
      await expect.poll(() => layer()).toBeNull()
    })

    it('should not dismiss on a tap on the background or the text', async () => {
      const onDismiss = vi.fn()
      prompt({ onDismiss })
      await ready()

      const field = background().getBoundingClientRect()
      await userEvent.click(background(), { position: { x: field.width / 2, y: 12 } })
      await userEvent.click(content()!.querySelector('.quantum-feature-discovery__text')!)
      await settle()

      expect(onDismiss).not.toHaveBeenCalled()
      expect(layer()!.dataset.open).toBe('true')
    })

    it('should dismiss on Escape and return focus to the opener', async () => {
      const open = shallowRef(false)
      const onDismiss = vi.fn()
      prompt({ open, onDismiss })
      await settle()

      const opener = document.querySelector<HTMLButtonElement>('#opener')!
      opener.focus()
      open.value = true
      await ready()

      await expect.poll(() => document.activeElement).toBe(content())

      await userEvent.keyboard('{Escape}')
      await settle()

      expect(onDismiss).toHaveBeenCalledTimes(1)
      expect(open.value).toBe(false)
      expect(document.activeElement).toBe(opener)
    })

    it('should close without an event when the model is set to false', async () => {
      const open = shallowRef(true)
      const onComplete = vi.fn()
      const onDismiss = vi.fn()
      prompt({ open, onComplete, onDismiss })
      await ready()

      open.value = false
      await settle()

      expect(onComplete).not.toHaveBeenCalled()
      expect(onDismiss).not.toHaveBeenCalled()
      await expect.poll(() => layer()).toBeNull()
      expect(document.querySelector<HTMLElement>('.quantum-feature-discovery__action')!.style.zIndex).toBe('')
    })

    it('should open again after a dismissal', async () => {
      const open = shallowRef(true)
      prompt({ open })
      await ready()

      await userEvent.keyboard('{Escape}')
      await expect.poll(() => layer()).toBeNull()

      open.value = true
      await ready()

      expect(layer()!.dataset.open).toBe('true')
    })

    it('should keep two prompts on one page apart', async () => {
      const first = shallowRef(false)
      const second = shallowRef(false)

      mount(() => h('div', [
        h(QuFeatureDiscovery, { 'modelValue': first.value, 'onUpdate:modelValue': (next: boolean) => {
          first.value = next
        } }, () => [
          h(QuFeatureDiscovery.Target, null, () => h(QuButton, { ariaLabel: 'One', icon: 'add', id: 'one' })),
          h(QuFeatureDiscovery.Title, null, () => 'First'),
        ]),
        h(QuFeatureDiscovery, { 'modelValue': second.value, 'onUpdate:modelValue': (next: boolean) => {
          second.value = next
        } }, () => [
          h(QuFeatureDiscovery.Target, null, () => h(QuButton, { ariaLabel: 'Two', icon: 'search', id: 'two' })),
          h(QuFeatureDiscovery.Title, null, () => 'Second'),
        ]),
      ]))
      await settle()

      second.value = true
      await ready()

      expect(document.querySelectorAll('.quantum-feature-discovery')).toHaveLength(1)
      expect(content()!.textContent).toBe('Second')
      expect(first.value).toBe(false)
      expect(centre(disc()).x).toBeCloseTo(centre(document.querySelector('#two')!).x, 0)
    })
  })

  describe('theme', () => {
    it('should keep the primary background and white ink in the dark theme', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      mount(() => h('div', { 'data-theme': 'quantum-dark' }, [
        h(QuFeatureDiscovery, { modelValue: true }, () => [
          h(QuFeatureDiscovery.Target, null, () => h(QuButton, { ariaLabel: 'Add', icon: 'add' })),
          h(QuFeatureDiscovery.Title, null, () => 'Title'),
          h(QuFeatureDiscovery.Text, null, () => 'Text'),
        ]),
      ]))
      await ready()

      expect(getComputedStyle(background()).backgroundColor).toBe('rgba(63, 81, 181, 0.96)')
      expect(getComputedStyle(content()!.querySelector('.quantum-feature-discovery__text')!).color).toBe('rgba(255, 255, 255, 0.7)')
    })

    it('should ink a flat icon button in the prompt colour on the light disc', async () => {
      prompt()
      await ready()

      expect(getComputedStyle(document.querySelector('#action')!).color).toBe('rgb(63, 81, 181)')
      teardowns.pop()!()

      prompt({ color: 'accent' })
      await ready()

      expect(getComputedStyle(document.querySelector('#action')!).color).toBe('rgb(255, 64, 129)')
    })
  })

  describe('context', () => {
    it('should not warn when every part is inside the root', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      prompt()
      await ready()

      expect(spy).not.toHaveBeenCalled()
    })

    it('should warn once per orphaned part and render the target content inert', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h('div', [
        h(QuFeatureDiscoveryTarget, null, () => h(QuButton, { ariaLabel: 'Add', icon: 'add', id: 'stray' })),
        h(QuFeatureDiscoveryTitle, null, () => 'Title'),
        h(QuFeatureDiscoveryText, null, () => 'Text'),
      ]))
      await settle()

      expect(spy).toHaveBeenCalledTimes(3)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('[QuFeatureDiscoveryTarget] rendered outside <QuFeatureDiscovery>'))
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('[QuFeatureDiscoveryTitle] rendered outside <QuFeatureDiscovery>'))
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('[QuFeatureDiscoveryText] rendered outside <QuFeatureDiscovery>'))
      expect(host.querySelector('#stray')).not.toBeNull()
      expect(host.querySelector('.quantum-feature-discovery__action')).toBeNull()
      expect(host.textContent).not.toContain('Title')
    })
  })
})
