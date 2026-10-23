import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createStackPlugin } from '@vuetify/v0'

import { QuDialog, QuDialogActions } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { QuDialogProps, QuDialogSlotProps } from './QuDialog.vue'
import type { ShallowRef, VNode, VNodeChild } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'
// Components
import { QuButton } from '../QuButton'

/** Vuetify 1.5's pixel recipe for the 24 dp level (spec/elevation.md). */
const ELEVATION_24 = '0px 11px 15px -7px rgba(0, 0, 0, 0.2), 0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12)'

/** The 22 dp level: the dialog's 24 dp less the desktop 2 dp (elevation page). */
const ELEVATION_22 = '0px 10px 14px -6px rgba(0, 0, 0, 0.2), 0px 22px 35px 3px rgba(0, 0, 0, 0.14), 0px 8px 42px 7px rgba(0, 0, 0, 0.12)'

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

interface Options extends QuDialogProps {
  open?: ShallowRef<boolean>
  value?: ShallowRef<unknown>
  onConfirm?: (value: unknown) => void
  parts?: (slot: QuDialogSlotProps) => VNodeChild
}

/** A dialog on a two-way model, with the alert anatomy unless `parts` replaces the content's children. */
function dialog (options: Options = {}): HTMLElement {
  const { open = shallowRef(true), value = shallowRef<unknown>(undefined), onConfirm, parts, ...props } = options

  return mount(() => h(QuDialog, {
    ...props,
    'modelValue': open.value,
    'onUpdate:modelValue': (next: boolean) => {
      open.value = next
    },
    'value': value.value,
    'onUpdate:value': (next: unknown) => {
      value.value = next
    },
  }, {
    default: (slot: QuDialogSlotProps) => [
      h(QuDialog.Activator, null, {
        default: ({ attrs }: { attrs: Record<string, unknown> }) => h(QuButton, { ...attrs, id: 'activator' }, () => 'Open'),
      }),
      h(QuDialog.Content, null, () => parts
        ? parts(slot)
        : [
            h(QuDialog.Title, null, () => 'Use location service?'),
            h(QuDialog.Text, null, () => 'Let the app determine location.'),
            h(QuDialog.Actions, null, () => [
              h(QuDialog.Cancel),
              h(QuDialog.Confirm, { onConfirm }),
            ]),
          ]),
    ],
  }))
}

function element (host: HTMLElement): HTMLDialogElement {
  return host.querySelector<HTMLDialogElement>('dialog.quantum-dialog')!
}

function buttons (host: HTMLElement): HTMLButtonElement[] {
  return [...element(host).querySelectorAll<HTMLButtonElement>('.quantum-dialog__actions > button')]
}

/** A press on the backdrop: native backdrop hits target the <dialog>, outside its box. */
function backdrop (el: HTMLDialogElement) {
  for (const type of ['pointerdown', 'pointerup', 'click']) {
    const Event = type === 'click' ? MouseEvent : PointerEvent
    el.dispatchEvent(new Event(type, { bubbles: true, composed: true, button: 0, clientX: 2, clientY: 2 }))
  }
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The browser's own serialization of a shadow, so assertions never guess at its formatting. */
function serialize (value: string): string {
  const probe = document.createElement('div')
  probe.style.boxShadow = value
  document.body.append(probe)
  const result = getComputedStyle(probe).boxShadow
  probe.remove()
  return result
}

/** Every rule in the page's sheets whose selector and enclosing media condition match. */
function rules (selector: string, media: string): CSSStyleRule[] {
  const found: CSSStyleRule[] = []

  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules) {
      if (!(rule instanceof CSSMediaRule) || !rule.conditionText.includes(media)) continue

      for (const inner of rule.cssRules) {
        if (inner instanceof CSSStyleRule && inner.selectorText === selector) found.push(inner)
      }
    }
  }

  return found
}

/** Every top-level rule (outside any media query) whose selector matches. */
function base (selector: string): CSSStyleRule[] {
  const found: CSSStyleRule[] = []

  for (const sheet of document.styleSheets) {
    for (const rule of sheet.cssRules) {
      if (rule instanceof CSSStyleRule && rule.selectorText === selector) found.push(rule)
    }
  }

  return found
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

describe('quDialog', () => {
  describe('anatomy', () => {
    it('should render a modal alertdialog with the sheet, title, text and two flat actions', async () => {
      const host = dialog()
      await settle()

      const el = element(host)
      const sheet = el.firstElementChild as HTMLElement
      const title = el.querySelector('.quantum-dialog__title')!
      const text = el.querySelector('.quantum-dialog__text')!
      const actions = el.querySelector<HTMLElement>('.quantum-dialog__actions')!

      expect(el.open).toBe(true)
      expect(el.matches(':modal')).toBe(true)
      expect(el.getAttribute('role')).toBe('alertdialog')
      expect(el.getAttribute('aria-modal')).toBe('true')
      expect(el.dataset.variant).toBe('alert')
      expect(el.dataset.open).toBe('true')
      expect(el.dataset.dismissible).toBe('true')
      expect(Object.hasOwn(el.dataset, 'scrolled')).toBe(false)

      expect(sheet.classList.contains('quantum-dialog__sheet')).toBe(true)
      expect([...sheet.children]).toEqual([title, text, actions])
      expect(title.tagName).toBe('H2')
      expect(text.tagName).toBe('DIV')
      expect(el.getAttribute('aria-labelledby')).toBe(title.id)
      expect(el.getAttribute('aria-describedby')).toBe(text.id)

      expect(Object.hasOwn(actions.dataset, 'stacked')).toBe(false)

      const [cancel, confirm] = buttons(host)

      expect(cancel.classList.contains('quantum-button')).toBe(true)
      expect(cancel.dataset.variant).toBe('flat')
      expect(cancel.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(cancel.textContent).toBe('Cancel')
      expect(confirm.dataset.variant).toBe('flat')
      expect(confirm.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(confirm.textContent).toBe('OK')
    })

    it('should name the actions by their visible labels, not the close fallback', async () => {
      const host = dialog({ variant: 'confirmation' })
      await settle()

      for (const button of buttons(host)) {
        expect(button.hasAttribute('aria-label')).toBe(false)
      }
    })

    it('should name an alert without a title by its text', async () => {
      const host = dialog({ parts: () => h(QuDialog.Text, null, () => 'Discard draft?') })
      await settle()

      const el = element(host)
      const text = el.querySelector('.quantum-dialog__text')!

      expect(el.getAttribute('aria-labelledby')).toBe(text.id)
      expect(el.hasAttribute('aria-describedby')).toBe(false)
    })

    it('should keep a consumer aria-label over the text fallback', async () => {
      const host = mount(() => h(QuDialog, { modelValue: true }, () => h(QuDialog.Content, { 'aria-label': 'Draft' }, () => [
        h(QuDialog.Text, null, () => 'Discard draft?'),
      ])))
      await settle()

      const el = element(host)

      expect(el.getAttribute('aria-label')).toBe('Draft')
      expect(el.hasAttribute('aria-labelledby')).toBe(false)
      expect(el.getAttribute('aria-describedby')).toBe(el.querySelector('.quantum-dialog__text')!.id)
    })

    it('should render the other variants as role dialog on Dialog', async () => {
      for (const variant of ['simple', 'confirmation', 'full-screen'] as const) {
        const host = dialog({ variant })
        await settle()

        const el = element(host)

        expect(el.getAttribute('role')).toBe('dialog')
        expect(el.dataset.variant).toBe(variant)
        expect(el.getAttribute('aria-labelledby')).toBe(el.querySelector('h2')!.id)
      }
    })

    it('should let the default slots replace the action labels', async () => {
      const host = dialog({
        parts: () => h(QuDialog.Actions, null, () => [
          h(QuDialog.Cancel, null, () => 'Keep'),
          h(QuDialog.Confirm, null, () => 'Delete'),
        ]),
      })
      await settle()

      expect(buttons(host).map(button => button.textContent)).toEqual(['Keep', 'Delete'])
    })

    it('should not render the <dialog> open while the model is false', async () => {
      const host = dialog({ open: shallowRef(false) })
      await settle()

      const el = element(host)

      expect(el.open).toBe(false)
      expect(Object.hasOwn(el.dataset, 'open')).toBe(false)
      expect(getComputedStyle(el).display).toBe('none')
    })
  })

  describe('spec values', () => {
    it('should paint the 24 dp sheet on the surface between 280 px and 560 px', async () => {
      const host = dialog({ parts: () => h(QuDialog.Text, null, () => 'Hi') })
      await settle()

      const sheet = element(host).querySelector<HTMLElement>('.quantum-dialog__sheet')!
      const computed = getComputedStyle(sheet)
      const [resting] = base('.quantum-dialog__sheet')

      expect(resting.style.boxShadow).toContain('--quantum-elevation-24')
      expect(resting.style.boxShadow).toContain('0px 24px 38px 3px')
      expect(computed.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(computed.borderRadius).toBe('2px')
      expect(sheet.getBoundingClientRect().width).toBe(280)
      expect(computed.maxWidth).toBe('560px')
    })

    it('should rest 2 dp lower, at 22 dp, under a mouse and keyboard', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const host = dialog({ parts: () => h(QuDialog.Text, null, () => 'Hi') })
      await settle()

      const sheet = element(host).querySelector<HTMLElement>('.quantum-dialog__sheet')!
      const [desktop] = rules('.quantum-dialog__sheet', 'pointer: fine')

      expect(desktop.style.boxShadow).toContain('--quantum-elevation-22')
      expect(getComputedStyle(sheet).boxShadow).toBe(serialize(ELEVATION_22))
      expect(getComputedStyle(sheet).boxShadow).not.toBe(serialize(ELEVATION_24))
    })

    it('should paint the scrim through ::backdrop and keep the screen-edge distances', async () => {
      const host = dialog()
      await settle()

      const el = element(host)

      await expect.poll(() => getComputedStyle(el, '::backdrop').backgroundColor).toBe('rgba(33, 33, 33, 0.46)')
      expect(document.querySelector('.v0-scrim')).toBeNull()
      // At least 40 dp from the side edges and 24 dp from the top and bottom (1280 x 800 viewport).
      expect(getComputedStyle(el).maxWidth).toBe('calc(100% - 80px)')
      expect(getComputedStyle(el).maxHeight).toBe('calc(100% - 48px)')
    })

    it('should set the title in Medium 20 sp on a 28 dp line with 24 dp above and 20 dp below', async () => {
      const host = dialog()
      await settle()

      const computed = getComputedStyle(element(host).querySelector('.quantum-dialog__title')!)

      expect(computed.fontSize).toBe('20px')
      expect(computed.fontWeight).toBe('500')
      expect(computed.lineHeight).toBe('28px')
      expect(computed.paddingTop).toBe('24px')
      expect(computed.paddingBottom).toBe('20px')
      expect(computed.paddingLeft).toBe('24px')
      expect(computed.paddingRight).toBe('24px')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
    })

    it('should set the text in Body 1 at the secondary ink, 24 dp from the edges and the actions', async () => {
      const host = dialog()
      await settle()

      const computed = getComputedStyle(element(host).querySelector('.quantum-dialog__text')!)

      expect(computed.fontSize).toBe('14px')
      expect(computed.fontWeight).toBe('400')
      expect(computed.lineHeight).toBe('20px')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.54)')
      expect(computed.paddingTop).toBe('0px')
      expect(computed.paddingLeft).toBe('24px')
      expect(computed.paddingBottom).toBe('24px')
    })

    it('should give a text with no title the title\'s 24 dp from the top edge', async () => {
      const host = dialog({ parts: () => h(QuDialog.Text, null, () => 'Discard draft?') })
      await settle()

      expect(getComputedStyle(element(host).querySelector('.quantum-dialog__text')!).paddingTop).toBe('24px')
    })

    it('should lay the actions in a 52 dp area: 8 dp padding, 8 dp between, 36 dp buttons at least 64 dp wide', async () => {
      const host = dialog()
      await settle()

      const actions = element(host).querySelector<HTMLElement>('.quantum-dialog__actions')!
      const computed = getComputedStyle(actions)
      const [cancel, confirm] = buttons(host)

      expect(actions.getBoundingClientRect().height).toBe(52)
      expect(computed.paddingTop).toBe('8px')
      expect(computed.paddingRight).toBe('8px')
      expect(computed.columnGap).toBe('8px')
      expect(computed.justifyContent).toBe('flex-end')
      expect(cancel.getBoundingClientRect().height).toBe(36)
      expect(confirm.getBoundingClientRect().width).toBe(64)
      expect(getComputedStyle(confirm).paddingLeft).toBe('8px')
      // Dismissive directly before affirmative; the affirmative ends 8 dp from the right edge.
      expect(confirm.getBoundingClientRect().left - cancel.getBoundingClientRect().right).toBe(8)
      expect(actions.getBoundingClientRect().right - confirm.getBoundingClientRect().right).toBe(8)
      expect(getComputedStyle(confirm).color).toBe('rgb(255, 64, 129)')
    })

    it('should fill the viewport under 600 px for the full-screen variant', async () => {
      dialog({ variant: 'full-screen' })
      await settle()

      const [shell] = rules('.quantum-dialog[data-variant="full-screen"]', 'max-width: 599.98px')
      const [sheet] = rules('.quantum-dialog[data-variant="full-screen"] .quantum-dialog__sheet', 'max-width: 599.98px')

      expect(shell.style.width).toBe('100%')
      expect(shell.style.height).toBe('100%')
      expect(shell.style.maxWidth).toBe('none')
      expect(shell.style.margin).toBe('0px')
      expect(sheet.style.borderRadius).toBe('0px')
      expect(sheet.style.boxShadow).toBe('none')
    })

    it('should drop every transition under reduced motion', async () => {
      expect(matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(true)

      const host = dialog()
      await settle()

      expect(getComputedStyle(element(host)).transitionProperty).toBe('none')
    })
  })

  describe('theme', () => {
    it('should take the dark surface and ink from the adapter sheet', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const open = shallowRef(true)
      const host = mount(() => h('div', { 'data-theme': 'quantum-dark' }, [
        h(QuDialog, { 'modelValue': open.value, 'onUpdate:modelValue': (next: boolean) => {
          open.value = next
        } }, () => h(QuDialog.Content, null, () => [
          h(QuDialog.Title, null, () => 'Title'),
          h(QuDialog.Text, null, () => 'Text'),
        ])),
      ]))
      await settle()

      const el = element(host)

      expect(getComputedStyle(el.querySelector('.quantum-dialog__sheet')!).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(el.querySelector('.quantum-dialog__title')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(el.querySelector('.quantum-dialog__text')!).color).toBe('rgba(255, 255, 255, 0.7)')
    })
  })

  describe('activator and focus', () => {
    it('should open from the activator, move focus inside, and return it on close', async () => {
      const open = shallowRef(false)
      const host = dialog({ open, variant: 'confirmation' })
      await settle()

      const activator = host.querySelector<HTMLButtonElement>('#activator')!

      expect(activator.getAttribute('aria-haspopup')).toBe('dialog')
      expect(activator.getAttribute('aria-expanded')).toBe('false')
      expect(activator.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)

      await userEvent.click(activator)
      await settle()

      const el = element(host)

      expect(open.value).toBe(true)
      expect(el.open).toBe(true)
      expect(activator.getAttribute('aria-expanded')).toBe('true')
      expect(el.contains(document.activeElement)).toBe(true)

      await userEvent.keyboard('{Escape}')
      await settle()

      expect(open.value).toBe(false)
      expect(document.activeElement).toBe(activator)
    })

    it('should focus the dismissive action first in an alert and keep Tab inside the dialog', async () => {
      const open = shallowRef(false)
      const host = dialog({ open })
      await settle()

      await userEvent.click(host.querySelector('#activator')!)
      await settle()

      const [cancel, confirm] = buttons(host)

      expect(document.activeElement).toBe(cancel)

      await userEvent.tab()

      expect(document.activeElement).toBe(confirm)

      await userEvent.tab()

      expect(element(host).contains(document.activeElement) || document.activeElement === document.body).toBe(true)
      expect(document.activeElement).not.toBe(host.querySelector('#activator'))
    })
  })

  describe('dismissal', () => {
    it('should close on Escape and on a backdrop press while dismissible', async () => {
      for (const variant of ['alert', 'simple', 'confirmation'] as const) {
        const open = shallowRef(true)
        const host = dialog({ open, variant })
        await settle()

        element(host).focus()
        await userEvent.keyboard('{Escape}')
        await settle()

        expect(open.value).toBe(false)
        expect(element(host).open).toBe(false)

        open.value = true
        await settle()

        backdrop(element(host))
        await settle()

        expect(open.value).toBe(false)
        expect(element(host).open).toBe(false)
      }
    })

    it('should ignore Escape and the backdrop when not dismissible, leaving the actions as the way out', async () => {
      for (const variant of ['alert', 'confirmation'] as const) {
        const open = shallowRef(true)
        const host = dialog({ open, variant, dismissible: false })
        await settle()

        const el = element(host)

        expect(Object.hasOwn(el.dataset, 'dismissible')).toBe(false)

        el.focus()
        await userEvent.keyboard('{Escape}')
        backdrop(el)
        await settle()

        expect(open.value).toBe(true)
        expect(el.open).toBe(true)

        await userEvent.click(buttons(host)[0])
        await settle()

        expect(open.value).toBe(false)
      }
    })

    it('should not close when a press starts and ends inside the sheet', async () => {
      const open = shallowRef(true)
      const host = dialog({ open, variant: 'confirmation' })
      await settle()

      await userEvent.click(element(host).querySelector('.quantum-dialog__text')!)
      await settle()

      expect(open.value).toBe(true)
    })
  })

  describe('actions', () => {
    it('should close from Cancel without touching the committed value', async () => {
      for (const variant of ['alert', 'confirmation'] as const) {
        const open = shallowRef(true)
        const value = shallowRef<unknown>('a')
        let held: QuDialogSlotProps | undefined
        const host = dialog({
          open,
          value,
          variant,
          parts: slot => {
            held = slot
            return h(QuDialog.Actions, null, () => [h(QuDialog.Cancel), h(QuDialog.Confirm)])
          },
        })
        await settle()

        held!.commit('b')
        await settle()

        await userEvent.click(buttons(host)[0])
        await settle()

        expect(open.value).toBe(false)
        expect(value.value).toBe('a')
      }
    })

    it('should commit, emit confirm with the value and close from Confirm', async () => {
      const open = shallowRef(true)
      const value = shallowRef<unknown>(undefined)
      const confirmed: unknown[] = []
      let held: QuDialogSlotProps | undefined
      const host = dialog({
        open,
        value,
        variant: 'confirmation',
        parts: slot => {
          held = slot
          return h(QuDialog.Actions, null, () => [
            h(QuDialog.Cancel),
            h(QuDialog.Confirm, { onConfirm: (next: unknown) => confirmed.push(next) }),
          ])
        },
      })
      await settle()

      const [, confirm] = buttons(host)

      // The affirmative action waits until a choice is made.
      expect(confirm.disabled).toBe(true)
      expect(confirm.getAttribute('aria-disabled')).toBe('true')
      expect(getComputedStyle(confirm).color).toBe('rgba(0, 0, 0, 0.26)')

      confirm.click()
      await settle()

      expect(open.value).toBe(true)
      expect(confirmed).toEqual([])

      held!.commit('ringtone')
      await settle()

      // The consumer's model moves only on OK.
      expect(value.value).toBeUndefined()
      expect(confirm.disabled).toBe(false)

      await userEvent.click(confirm)
      await settle()

      expect(confirmed).toEqual(['ringtone'])
      expect(value.value).toBe('ringtone')
      expect(open.value).toBe(false)
    })

    it('should confirm an alert once and close it', async () => {
      const open = shallowRef(true)
      const confirmed: unknown[] = []
      const host = dialog({ open, onConfirm: next => confirmed.push(next) })
      await settle()

      buttons(host)[1].focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(confirmed).toEqual([undefined])
      expect(open.value).toBe(false)
    })

    it('should keep a disabled Confirm inert', async () => {
      const open = shallowRef(true)
      const confirmed: unknown[] = []
      const host = dialog({
        open,
        parts: () => h(QuDialog.Actions, null, () => [
          h(QuDialog.Cancel),
          h(QuDialog.Confirm, { disabled: true, onConfirm: (next: unknown) => confirmed.push(next) }),
        ]),
      })
      await settle()

      const confirm = buttons(host)[1]

      expect(confirm.disabled).toBe(true)

      confirm.click()
      await settle()

      expect(confirmed).toEqual([])
      expect(open.value).toBe(true)
    })

    it('should commit and close at once when a simple dialog choice is made', async () => {
      const open = shallowRef(true)
      const value = shallowRef<unknown>(undefined)
      const host = dialog({
        open,
        value,
        variant: 'simple',
        parts: slot => [
          h(QuDialog.Title, null, () => 'Set backup account'),
          h('button', { id: 'choice', type: 'button', onClick: () => slot.commit('user@example.com') }, 'user@example.com'),
        ],
      })
      await settle()

      await userEvent.click(host.querySelector('#choice')!)
      await settle()

      expect(value.value).toBe('user@example.com')
      expect(open.value).toBe(false)
    })
  })

  describe('stacking', () => {
    it('should stack when a label exceeds (width - 24) / 2, affirmative above dismissive on 48 dp rows', async () => {
      const host = dialog({
        parts: () => [
          h(QuDialog.Text, null, () => 'Turn on location history?'),
          h(QuDialog.Actions, null, () => [
            h(QuDialog.Cancel, null, () => 'Not now'),
            h(QuDialog.Confirm, null, () => 'Turn on location history'),
          ]),
        ],
      })
      await settle()

      const actions = element(host).querySelector<HTMLElement>('.quantum-dialog__actions')!

      await expect.poll(() => actions.dataset.stacked).toBe('true')

      const [cancel, confirm] = buttons(host)

      expect(confirm.getBoundingClientRect().bottom).toBeLessThanOrEqual(cancel.getBoundingClientRect().top)
      expect(confirm.getBoundingClientRect().height).toBe(48)
      expect(confirm.getBoundingClientRect().width).toBe(actions.clientWidth - 16)
      expect(actions.getBoundingClientRect().bottom - cancel.getBoundingClientRect().bottom).toBe(8)
    })

    it('should honour an explicit stacked prop either way', async () => {
      const host = mount(() => h(QuDialog, { modelValue: true }, () => h(QuDialog.Content, null, () => [
        h(QuDialogActions, { stacked: true }, () => [h(QuDialog.Cancel), h(QuDialog.Confirm)]),
        h(QuDialogActions, { stacked: false }, () => [h(QuDialog.Cancel, null, () => 'Not now'), h(QuDialog.Confirm, null, () => 'Turn on location history and more')]),
      ])))
      await settle()

      const [forced, held] = element(host).querySelectorAll<HTMLElement>('.quantum-dialog__actions')

      expect(forced.dataset.stacked).toBe('true')
      expect(getComputedStyle(forced).flexDirection).toBe('column-reverse')
      expect(Object.hasOwn(held.dataset, 'stacked')).toBe(false)
    })

    it('should warn once in dev when a dialog carries a third action', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      dialog({
        parts: () => h(QuDialog.Actions, null, () => [h(QuDialog.Cancel), h(QuButton, null, () => 'Learn more'), h(QuDialog.Confirm)]),
      })
      await settle()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('at most two actions'))
    })
  })

  describe('scrolling', () => {
    it('should mark the scrolled state, pin the title over the list and draw the 12% stroke above the actions', async () => {
      const host = dialog({
        variant: 'confirmation',
        parts: () => [
          h(QuDialog.Title, null, () => 'Phone ringtone'),
          h(QuDialog.Text, null, () => Array.from({ length: 60 }, (_, index) => h('div', `Ringtone ${index + 1}`))),
          h(QuDialog.Actions, null, () => [h(QuDialog.Cancel), h(QuDialog.Confirm)]),
        ],
      })
      await settle()

      const el = element(host)
      const sheet = el.querySelector<HTMLElement>('.quantum-dialog__sheet')!
      const title = el.querySelector<HTMLElement>('.quantum-dialog__title')!
      const actions = el.querySelector<HTMLElement>('.quantum-dialog__actions')!

      await expect.poll(() => el.dataset.scrolled).toBe('true')

      // The sheet stays 24 dp inside the top and bottom edges.
      expect(sheet.getBoundingClientRect().height).toBeLessThanOrEqual(innerHeight - 48)
      expect(getComputedStyle(actions).borderTopWidth).toBe('1px')
      expect(getComputedStyle(actions).borderTopColor).toBe('rgba(0, 0, 0, 0.12)')

      sheet.scrollTop = sheet.scrollHeight
      await settle()

      // Title pinned to the top, actions to the bottom, while the list scrolls between them.
      expect(Math.round(title.getBoundingClientRect().top)).toBe(Math.round(sheet.getBoundingClientRect().top))
      expect(Math.round(actions.getBoundingClientRect().bottom)).toBe(Math.round(sheet.getBoundingClientRect().bottom))
    })

    it('should draw no stroke while the content fits', async () => {
      const host = dialog()
      await settle()

      const actions = element(host).querySelector<HTMLElement>('.quantum-dialog__actions')!

      expect(getComputedStyle(actions).borderTopWidth).toBe('0px')
    })
  })

  describe('full-screen', () => {
    it('should prompt before discarding a dirty full-screen dialog and close on the discard', async () => {
      const open = shallowRef(true)
      const host = dialog({
        open,
        variant: 'full-screen',
        dirty: true,
        parts: () => [
          h(QuDialog.Title, null, () => 'New event'),
          h(QuDialog.Actions, null, () => [h(QuDialog.Cancel), h(QuDialog.Confirm, null, () => 'Save')]),
        ],
      })
      await settle()

      await userEvent.click(buttons(host)[0])
      await settle()

      const prompt = element(host).querySelector<HTMLDialogElement>('dialog.quantum-dialog__discard')!

      expect(open.value).toBe(true)
      expect(prompt.open).toBe(true)
      expect(prompt.getAttribute('role')).toBe('alertdialog')
      expect(prompt.textContent).toContain('Discard changes?')

      const [keep, discard] = [...prompt.querySelectorAll<HTMLButtonElement>('.quantum-dialog__actions > button')]

      expect(discard.textContent).toBe('Discard')

      await userEvent.click(keep)
      await settle()

      expect(prompt.open).toBe(false)
      expect(open.value).toBe(true)

      // Escape is the dismissive gesture: it prompts too.
      element(host).focus()
      await userEvent.keyboard('{Escape}')
      await settle()

      expect(open.value).toBe(true)
      expect(prompt.open).toBe(true)

      await userEvent.click(discard)
      await settle()

      expect(open.value).toBe(false)
    })

    it('should close a clean full-screen dialog from Cancel at once and ignore backdrop presses', async () => {
      const open = shallowRef(true)
      const host = dialog({ open, variant: 'full-screen' })
      await settle()

      backdrop(element(host))
      await settle()

      expect(open.value).toBe(true)

      await userEvent.click(buttons(host)[0])
      await settle()

      expect(open.value).toBe(false)
      expect(element(host).querySelector<HTMLDialogElement>('dialog.quantum-dialog__discard')!.open).toBe(false)
    })

    it('should warn in dev when dirty is set on a variant that never prompts', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      dialog({ variant: 'confirmation', dirty: true })
      await settle()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('dirty'))
    })
  })

  describe('orphans', () => {
    it('should warn once when a part renders outside QuDialog', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(QuDialogActions, null, () => 'Inert'))
      await settle()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('QuDialogActions'))
    })

    it('should not warn when every part is nested', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      dialog()
      await settle()

      expect(spy).toHaveBeenCalledTimes(0)
    })
  })
})
