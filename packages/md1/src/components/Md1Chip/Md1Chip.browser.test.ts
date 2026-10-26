import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

// Components
import { Md1Chip, Md1ChipAddress, Md1ChipAddresses } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1ChipProps } from './Md1Chip.vue'
import type { App, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Icons
import { md1Icons } from '../../icons'

/** Vuetify 1.5's pixel recipe for the 2 dp level: the focused chip. */
const ELEVATION_2 = '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'
/** The 8 dp level: the open contact chip. */
const ELEVATION_8 = '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)'

/** A 1 x 1 PNG: the avatar's geometry is the stylesheet's, not the image's. */
const AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  // The tester document has no body margin; the hit-area tests probe above the chip, which must stay inside the viewport.
  host.style.padding = '24px'
  document.body.append(host)
  const app = createApp({ render: node })
  setup?.(app)
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

type Props = Md1ChipProps & Record<string, unknown>

function chip (props: Props = {}, label = 'Alice', setup?: (app: App) => void): HTMLElement {
  const host = mount(() => h(Md1Chip, props, () => label), setup)
  return host.querySelector<HTMLElement>('.md1-chip')!
}

/** A contact chip holding an Addresses sheet with two rows, the first one active. */
function contact (props: Props = {}, onAddress?: () => void): HTMLElement {
  const host = mount(() => h(Md1Chip, { contact: true, avatar: AVATAR, ...props }, () => [
    'Alice Jones',
    h(Md1ChipAddresses, null, () => [
      h(Md1ChipAddress, { active: true }, () => 'alice@example.com'),
      h(Md1ChipAddress, { onClick: onAddress }, () => 'a.jones@work.example'),
    ]),
  ]))
  return host.querySelector<HTMLElement>('.md1-chip')!
}

function sheet (): HTMLElement {
  return document.querySelector<HTMLElement>('.md1-chip__addresses')!
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The browser's own serialization of a value, so assertions never guess at colour or shadow formatting. */
function serialize (property: 'backgroundColor' | 'boxShadow', value: string): string {
  const probe = document.createElement('div')
  probe.style[property] = value
  document.body.append(probe)
  const result = getComputedStyle(probe)[property]
  probe.remove()
  return result
}

/** A synthetic pointerdown at (x, y) inside the element: enough for the ripple, never for `:active`. */
function down (el: HTMLElement, x: number, y: number) {
  const rect = el.getBoundingClientRect()
  el.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: rect.left + x,
    clientY: rect.top + y,
    pointerType: 'mouse',
  }))
}

function up (el: HTMLElement) {
  el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }))
}

function inks (el: HTMLElement): HTMLElement[] {
  return [...el.querySelectorAll<HTMLElement>('.md1-ripple__ink')]
}

function paths (svg: Element): (string | null)[] {
  return [...svg.querySelectorAll('path')].map(p => p.getAttribute('d'))
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  // The reduced-motion adapter writes the body attribute on install and never clears it.
  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('quChip', () => {
  describe('anatomy', () => {
    it('should render a text chip as a span holding the label, with no button and no ripple', async () => {
      const el = chip({}, 'Free text')
      await settle()

      const label = el.querySelector('.md1-chip__label')!

      expect(el.tagName).toBe('SPAN')
      expect(el.classList.contains('md1-chip')).toBe(true)
      expect(label.tagName).toBe('SPAN')
      expect(label.textContent?.trim()).toBe('Free text')
      expect(el.querySelector('button')).toBeNull()
      expect(el.querySelector('.md1-ripple')).toBeNull()
      expect(el.querySelector('.md1-chip__avatar')).toBeNull()
      expect(el.querySelector('.md1-chip__icon')).toBeNull()
      expect(el.querySelector('.md1-chip__delete')).toBeNull()

      for (const hook of ['deletable', 'contact', 'open', 'disabled', 'focused']) {
        expect(Object.hasOwn(el.dataset, hook)).toBe(false)
      }
    })

    it('should measure 32 dp tall with 12 dp side padding, a full pill radius and the 13 sp label at 87% on Grey 300', async () => {
      const el = chip({}, 'Free text')
      await settle()

      const rect = el.getBoundingClientRect()
      const computed = getComputedStyle(el)

      expect(rect.height).toBe(32)
      expect(computed.paddingLeft).toBe('12px')
      expect(computed.paddingRight).toBe('12px')
      expect(computed.borderRadius).toBe('16px')
      expect(computed.backgroundColor).toBe('rgb(224, 224, 224)')
      expect(computed.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(computed.fontFamily).toContain('Roboto')
      expect(computed.fontSize).toBe('13px')
      expect(computed.fontWeight).toBe('400')
      expect(computed.whiteSpace).toBe('nowrap')
      // Chips are absent from the elevation table: flat on the sheet.
      expect(computed.boxShadow).toBe('none')
    })

    it('should become a native button with the ripple first when a click is bound, and fire it once per activation', async () => {
      let clicks = 0
      const el = chip({ onClick: () => clicks++ }, 'Open')
      await settle()

      expect(el.tagName).toBe('BUTTON')
      expect((el as HTMLButtonElement).type).toBe('button')
      expect(el.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(el.firstElementChild!.getAttribute('aria-hidden')).toBe('true')
      expect(getComputedStyle(el).cursor).toBe('pointer')

      await userEvent.click(el)

      expect(clicks).toBe(1)

      await userEvent.keyboard('{Enter}')
      await userEvent.keyboard(' ')

      expect(clicks).toBe(3)
    })

    it('should answer to the 48 dp touch target around a pressable chip without growing the box', async () => {
      const el = chip({ onClick: () => {} }, 'Open')
      await settle()

      const rect = el.getBoundingClientRect()
      const x = rect.left + rect.width / 2

      expect(rect.height).toBe(32)
      expect(document.elementFromPoint(x, rect.top - 4)).toBe(el)
      expect(document.elementFromPoint(x, rect.bottom + 4)).toBe(el)
      expect(document.elementFromPoint(x, rect.top - 10)).not.toBe(el)
    })

    it('should draw the leading icon through Md1Icon at 24 dp in the active icon tier, 12 px before the label', async () => {
      const el = chip({ icon: 'label' }, 'Rule')
      await settle()

      const icon = el.querySelector<HTMLElement>('.md1-chip__icon')!
      const svg = icon.querySelector('svg')!

      expect(icon.getAttribute('aria-hidden')).toBe('true')
      expect(icon.nextElementSibling!.classList.contains('md1-chip__label')).toBe(true)
      expect(svg.classList.contains('md1-icon')).toBe(true)
      expect(paths(svg)).toEqual(md1Icons.label)
      expect(getComputedStyle(svg).width).toBe('24px')
      expect(getComputedStyle(icon).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(getComputedStyle(icon).marginRight).toBe('12px')
      expect(getComputedStyle(el).paddingLeft).toBe('4px')
      expect(getComputedStyle(el).paddingRight).toBe('12px')
    })

    it('should place the avatar at the start edge, as tall as the chip, with 8 dp to the label and 12 dp after it', async () => {
      const el = chip({ avatar: AVATAR, icon: 'label' }, 'Alice')
      await settle()

      const avatar = el.querySelector<HTMLImageElement>('.md1-chip__avatar')!
      const label = el.querySelector<HTMLElement>('.md1-chip__label')!
      const rect = avatar.getBoundingClientRect()

      expect(avatar.tagName).toBe('IMG')
      expect(avatar.getAttribute('src')).toBe(AVATAR)
      expect(avatar.getAttribute('alt')).toBe('')
      // The photo takes the icon's place.
      expect(el.querySelector('.md1-chip__icon')).toBeNull()
      expect(rect.width).toBe(32)
      expect(rect.height).toBe(32)
      expect(getComputedStyle(avatar).borderRadius).toBe('50%')
      expect(getComputedStyle(el).paddingLeft).toBe('0px')
      expect(getComputedStyle(el).paddingRight).toBe('12px')
      expect(getComputedStyle(label).marginLeft).toBe('8px')
      expect(rect.left).toBe(el.getBoundingClientRect().left)
    })

    it('should mirror the avatar gap and the start edge under dir="rtl"', async () => {
      const host = mount(() => h('div', { dir: 'rtl' }, [h(Md1Chip, { avatar: AVATAR }, () => 'Alice')]))
      await settle()

      const el = host.querySelector<HTMLElement>('.md1-chip')!
      const label = host.querySelector<HTMLElement>('.md1-chip__label')!

      expect(getComputedStyle(el).paddingRight).toBe('0px')
      expect(getComputedStyle(el).paddingLeft).toBe('12px')
      expect(getComputedStyle(label).marginRight).toBe('8px')
      expect(getComputedStyle(label).marginLeft).toBe('0px')
    })
  })

  describe('deletable', () => {
    it('should render the delete control as a button named after the chip, with the 24 dp cancel glyph at 54% and 4 dp margin', async () => {
      let deletes = 0
      const el = chip({ deletable: true, onDelete: () => deletes++ }, 'Alice')
      await settle()

      const remove = el.querySelector<HTMLButtonElement>('.md1-chip__delete')!
      const svg = remove.querySelector('svg')!
      const rect = remove.getBoundingClientRect()

      expect(el.tagName).toBe('SPAN')
      expect(Object.hasOwn(el.dataset, 'deletable')).toBe(true)
      expect(remove.tagName).toBe('BUTTON')
      expect(remove.type).toBe('button')
      expect(remove.getAttribute('aria-label')).toBe('Delete Alice')
      expect(remove.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(paths(svg)).toEqual(md1Icons.cancel)
      expect(rect.width).toBe(24)
      expect(rect.height).toBe(24)
      expect(getComputedStyle(svg).width).toBe('24px')
      expect(getComputedStyle(remove).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(getComputedStyle(remove).marginLeft).toBe('4px')
      expect(getComputedStyle(el).paddingLeft).toBe('12px')
      expect(getComputedStyle(el).paddingRight).toBe('4px')
      // Glyph edge to chip edge: the 4 dp margin.
      expect(el.getBoundingClientRect().right - rect.right).toBe(4)

      await userEvent.click(remove)

      expect(deletes).toBe(1)
    })

    it('should emit delete from the Delete and Backspace keys on the focused control and rise to 2 dp while focused', async () => {
      let deletes = 0
      const el = chip({ deletable: true, onDelete: () => deletes++ }, 'Alice')
      await settle()

      const remove = el.querySelector<HTMLButtonElement>('.md1-chip__delete')!

      await userEvent.tab()

      expect(document.activeElement).toBe(remove)
      await expect.poll(() => Object.hasOwn(el.dataset, 'focused')).toBe(true)
      await expect.poll(() => getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))

      await userEvent.keyboard('{Delete}')

      expect(deletes).toBe(1)

      await userEvent.keyboard('{Backspace}')

      expect(deletes).toBe(2)

      await userEvent.click(document.body)

      await expect.poll(() => Object.hasOwn(el.dataset, 'focused')).toBe(false)
      await expect.poll(() => getComputedStyle(el).boxShadow).toBe('none')
    })

    it('should keep a pressable deletable chip one button: an inert glyph whose press the root redirects to delete', async () => {
      let clicks = 0
      let deletes = 0
      const el = chip({ deletable: true, onClick: () => clicks++, onDelete: () => deletes++ }, 'Alice')
      await settle()

      const glyph = el.querySelector<HTMLElement>('.md1-chip__delete')!

      expect(el.tagName).toBe('BUTTON')
      expect(el.querySelectorAll('button').length).toBe(0)
      expect(glyph.tagName).toBe('SPAN')
      expect(glyph.getAttribute('aria-hidden')).toBe('true')
      expect(paths(glyph.querySelector('svg')!)).toEqual(md1Icons.cancel)
      expect(el.getAttribute('aria-keyshortcuts')).toBe('Delete')

      await userEvent.click(glyph)

      expect(deletes).toBe(1)
      expect(clicks).toBe(0)

      await userEvent.click(el.querySelector<HTMLElement>('.md1-chip__label')!)

      expect(clicks).toBe(1)
      expect(deletes).toBe(1)

      el.focus()
      await userEvent.keyboard('{Delete}')

      expect(deletes).toBe(2)
      expect(clicks).toBe(1)
    })

    it('should make a disabled deletable chip inert: the control disabled and out of the tab order, 38% ink, no pointer', async () => {
      let deletes = 0
      const el = chip({ deletable: true, disabled: true, onDelete: () => deletes++ }, 'Alice')
      await settle()

      const remove = el.querySelector<HTMLButtonElement>('.md1-chip__delete')!

      expect(Object.hasOwn(el.dataset, 'disabled')).toBe(true)
      expect(remove.disabled).toBe(true)
      expect(remove.getAttribute('aria-disabled')).toBe('true')
      expect(remove.getAttribute('tabindex')).toBe('-1')

      remove.focus()

      expect(document.activeElement).not.toBe(remove)

      remove.click()
      await settle()

      expect(deletes).toBe(0)
      expect(getComputedStyle(el).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(remove).color).toBe('rgba(0, 0, 0, 0.38)')

      // Vuetify 1.5 drops only the ink of a disabled chip: an avatar stays opaque.
      const avatar = chip({ avatar: AVATAR, disabled: true }, 'Ada').querySelector<HTMLElement>('.md1-chip__avatar')!
      expect(getComputedStyle(avatar).opacity).toBe('1')
      expect(getComputedStyle(el).pointerEvents).toBe('none')
      expect(getComputedStyle(el).boxShadow).toBe('none')
    })
  })

  describe('contact', () => {
    it('should render the contact chip as a button at 14 sp with the avatar flush, and no popover wiring without Addresses', async () => {
      const el = chip({ contact: true, avatar: AVATAR }, 'Alice Jones')
      await settle()

      const label = el.querySelector<HTMLElement>('.md1-chip__label')!

      expect(el.tagName).toBe('BUTTON')
      expect(Object.hasOwn(el.dataset, 'contact')).toBe(true)
      expect(getComputedStyle(el).fontSize).toBe('14px')
      expect(getComputedStyle(el).paddingLeft).toBe('0px')
      expect(getComputedStyle(el).paddingRight).toBe('12px')
      expect(getComputedStyle(label).marginLeft).toBe('8px')
      expect(el.hasAttribute('popovertarget')).toBe(false)
      expect(el.hasAttribute('aria-expanded')).toBe(false)
      expect(el.hasAttribute('aria-controls')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'open')).toBe(false)
    })

    it('should wire the chip as the activator of its Addresses sheet, teleported out of the button and closed at rest', async () => {
      const el = contact()
      await settle()

      const content = sheet()
      const name = content.querySelector<HTMLElement>('.md1-chip__addresses-name')!

      expect(content).not.toBeNull()
      // Out of the button, into the outlet right after it: still inside the chip's own tree.
      expect(el.contains(content)).toBe(false)
      expect(content.parentElement).toBe(el.nextElementSibling)
      expect(content.parentElement!.classList.contains('md1-chip__outlet')).toBe(true)
      expect(getComputedStyle(content.parentElement!).display).toBe('contents')
      expect(content.getAttribute('popover')).toBe('')
      expect(content.getAttribute('role')).toBe('dialog')
      expect(content.getAttribute('aria-labelledby')).toBe(name.id)
      expect(name.textContent).toBe('Alice Jones')
      expect(content.querySelector<HTMLImageElement>('.md1-chip__addresses-avatar')!.getAttribute('src')).toBe(AVATAR)
      expect(content.querySelectorAll('.md1-chip__address').length).toBe(2)
      expect(content.matches(':popover-open')).toBe(false)

      expect(el.getAttribute('popovertarget')).toBe(content.id)
      expect(el.getAttribute('aria-controls')).toBe(content.id)
      expect(el.getAttribute('aria-expanded')).toBe('false')
      expect(Object.hasOwn(el.dataset, 'open')).toBe(false)
      // The name reads the label, so the delete control is named after it too.
      expect(getComputedStyle(name).fontSize).toBe('16px')
    })

    it('should open on press at 8 dp, focus the active address, report through v-model:open, and close on Escape back to the chip', async () => {
      const open = shallowRef(false)
      let addressed = 0
      const host = mount(() => h(Md1Chip, {
        'contact': true,
        'avatar': AVATAR,
        'open': open.value,
        'onUpdate:open': (value: boolean) => {
          open.value = value
        },
      }, () => [
        'Alice Jones',
        h(Md1ChipAddresses, null, () => [
          h(Md1ChipAddress, { active: true }, () => 'alice@example.com'),
          h(Md1ChipAddress, { onClick: () => addressed++ }, () => 'a.jones@work.example'),
        ]),
      ]))
      await settle()

      const el = host.querySelector<HTMLElement>('.md1-chip')!
      const content = sheet()
      const [active, other] = content.querySelectorAll<HTMLElement>('.md1-chip__address')

      await userEvent.click(el)

      await expect.poll(() => content.matches(':popover-open')).toBe(true)
      expect(open.value).toBe(true)
      expect(el.getAttribute('aria-expanded')).toBe('true')
      expect(Object.hasOwn(el.dataset, 'open')).toBe(true)

      // "The top field is activated and focused by default."
      await expect.poll(() => document.activeElement).toBe(active!)
      expect(active!.getAttribute('aria-current')).toBe('true')
      expect(Object.hasOwn(active!.dataset, 'active')).toBe(true)
      expect(other!.hasAttribute('aria-current')).toBe(false)
      expect(getComputedStyle(active!).fontWeight).toBe('500')
      expect(getComputedStyle(other!).fontWeight).toBe('400')
      expect(getComputedStyle(active!).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(other!).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(other!).fontSize).toBe('14px')
      expect(other!.getBoundingClientRect().height).toBe(40)
      expect(getComputedStyle(other!).paddingLeft).toBe('72px')

      const computed = getComputedStyle(content)

      expect(computed.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(computed.borderRadius).toBe('2px')
      expect(computed.boxShadow).toBe(serialize('boxShadow', ELEVATION_8))
      expect(content.getBoundingClientRect().width).toBeGreaterThanOrEqual(280)
      // The sheet expands from the chip: top-start corners aligned.
      expect(Math.round(content.getBoundingClientRect().top)).toBe(Math.round(el.getBoundingClientRect().top))
      expect(Math.round(content.getBoundingClientRect().left)).toBe(Math.round(el.getBoundingClientRect().left))

      await userEvent.keyboard('{Escape}')

      await expect.poll(() => content.matches(':popover-open')).toBe(false)
      expect(open.value).toBe(false)
      expect(el.getAttribute('aria-expanded')).toBe('false')
      expect(Object.hasOwn(el.dataset, 'open')).toBe(false)
      // The native popover hands focus back to the chip.
      expect(document.activeElement).toBe(el)

      // A press on an address closes the chip after the consumer's click.
      el.click()

      await expect.poll(() => content.matches(':popover-open')).toBe(true)
      await expect.poll(() => document.activeElement).toBe(active!)

      await userEvent.click(other!)

      expect(addressed).toBe(1)
      await expect.poll(() => content.matches(':popover-open')).toBe(false)
      expect(open.value).toBe(false)
    })

    it('should close on a second press of the chip and on a press on the open chip itself', async () => {
      const el = contact()
      await settle()

      const content = sheet()

      // The sheet covers the chip once open, so the second press is the programmatic activation.
      el.click()

      await expect.poll(() => content.matches(':popover-open')).toBe(true)

      el.click()

      await expect.poll(() => content.matches(':popover-open')).toBe(false)

      el.click()

      await expect.poll(() => content.matches(':popover-open')).toBe(true)

      await userEvent.click(content.querySelector<HTMLElement>('.md1-chip__addresses-header')!)

      await expect.poll(() => content.matches(':popover-open')).toBe(false)
    })

    it('should take its accessible name from the label and stay shut while disabled', async () => {
      const el = contact({ disabled: true }) as HTMLButtonElement
      await settle()

      expect(el.getAttribute('role')).toBe('button')
      expect(el.hasAttribute('aria-label')).toBe(false)
      expect(el.textContent?.trim()).toBe('Alice Jones')
      expect(el.disabled).toBe(true)

      el.click()
      await settle()

      expect(sheet().matches(':popover-open')).toBe(false)
      expect(el.getAttribute('aria-expanded')).toBe('false')
    })

    it('should open from the model', async () => {
      contact({ open: true })
      await settle()

      await expect.poll(() => sheet().matches(':popover-open')).toBe(true)
    })

    it('should skip a disabled address when focusing on open and render it inert', async () => {
      const host = mount(() => h(Md1Chip, { contact: true }, () => [
        'Alice Jones',
        h(Md1ChipAddresses, null, () => [
          h(Md1ChipAddress, { active: true, disabled: true }, () => 'alice@example.com'),
          h(Md1ChipAddress, null, () => 'a.jones@work.example'),
        ]),
      ]))
      await settle()

      const el = host.querySelector<HTMLElement>('.md1-chip')!
      const [off, on] = sheet().querySelectorAll<HTMLButtonElement>('.md1-chip__address')

      expect(off!.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
      expect(off!.disabled).toBe(true)
      expect(Object.hasOwn(off!.dataset, 'disabled')).toBe(true)
      expect(off!.getAttribute('tabindex')).toBe('-1')

      el.click()

      await expect.poll(() => sheet().matches(':popover-open')).toBe(true)
      await expect.poll(() => document.activeElement).toBe(on!)
      expect(getComputedStyle(off!).color).toBe('rgba(0, 0, 0, 0.38)')
    })

    it('should rename the delete control when the label changes', async () => {
      const name = shallowRef('Alice')
      const surname = shallowRef(false)
      const host = mount(() => h(Md1Chip, { deletable: true }, () => [
        name.value,
        surname.value ? h('b', ' Jones') : null,
      ]))
      await settle()

      const remove = host.querySelector<HTMLElement>('.md1-chip__delete')!

      expect(remove.getAttribute('aria-label')).toBe('Delete Alice')

      // A text edit and an inserted element: both reach the name.
      name.value = 'Bob'

      await expect.poll(() => remove.getAttribute('aria-label')).toBe('Delete Bob')

      surname.value = true

      await expect.poll(() => remove.getAttribute('aria-label')).toBe('Delete Bob Jones')
    })

    it('should grow the focused contact chip to 40 dp at 2 dp and settle back on blur', async () => {
      const el = chip({ contact: true, avatar: AVATAR }, 'Alice Jones')
      await settle()

      const avatar = el.querySelector<HTMLElement>('.md1-chip__avatar')!

      await userEvent.tab()

      expect(document.activeElement).toBe(el)
      expect(Object.hasOwn(el.dataset, 'focused')).toBe(true)
      await expect.poll(() => el.getBoundingClientRect().height).toBe(40)
      await expect.poll(() => getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))
      expect(avatar.getBoundingClientRect().height).toBe(40)

      await userEvent.click(document.body)

      expect(Object.hasOwn(el.dataset, 'focused')).toBe(false)
      await expect.poll(() => el.getBoundingClientRect().height).toBe(32)
      await expect.poll(() => getComputedStyle(el).boxShadow).toBe('none')
    })

    it('should grow the focused contact chip without moving its neighbours or its row', async () => {
      for (const avatar of [AVATAR, undefined]) {
        const host = mount(() => h('div', { style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', width: '600px' } }, [
          h(Md1Chip, { contact: true, avatar }, () => 'Alice Jones'),
          h(Md1Chip, { contact: true, avatar }, () => 'Bob Smith'),
          h('span', 'after'),
        ]))
        await settle()

        const row = host.firstElementChild as HTMLElement
        const [first, second] = [...row.querySelectorAll<HTMLElement>('.md1-chip')]
        const after = row.lastElementChild!

        function boxes () {
          return [second!, after, row].map(el => {
            const { left, top, width, height } = el.getBoundingClientRect()
            return [left, top, width, height]
          })
        }

        const rest = boxes()

        first!.focus()

        await expect.poll(() => first!.getBoundingClientRect().height).toBe(40)
        expect(boxes()).toEqual(rest)

        first!.blur()

        await expect.poll(() => first!.getBoundingClientRect().height).toBe(32)
        expect(boxes()).toEqual(rest)

        teardowns.pop()!()
      }
    })

    it('should warn once in dev for an orphaned part and render no sheet for it', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(Md1ChipAddresses, null, () => [h(Md1ChipAddress, null, () => 'alice@example.com')]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Md1ChipAddresses'))
      expect(document.querySelector('.md1-chip__addresses')).toBeNull()

      mount(() => h(Md1ChipAddress, null, () => 'alice@example.com'))
      await settle()

      expect(warn).toHaveBeenCalledTimes(2)
      expect(warn).toHaveBeenLastCalledWith(expect.stringContaining('Md1ChipAddress'))

      // Only the contact chip opens: an Addresses part on a text chip is a mistake, not a hidden feature.
      mount(() => h(Md1Chip, null, () => ['Alice', h(Md1ChipAddresses, null, () => [])]))
      await settle()

      expect(warn).toHaveBeenCalledTimes(3)
      expect(warn).toHaveBeenLastCalledWith(expect.stringContaining('contact'))
    })
  })

  describe('states', () => {
    it('should paint no hover overlay on a pressable chip or a text chip', async () => {
      const pressable = chip({ onClick: () => {} }, 'Open')
      const text = chip({}, 'Free text')
      await settle()

      await userEvent.hover(pressable)

      // Vuetify 1.5 draws no hover on a chip; the fill stays the chip colour.
      expect(getComputedStyle(pressable).backgroundImage).toBe('none')
      expect(getComputedStyle(pressable).backgroundColor).toBe('rgb(224, 224, 224)')

      await userEvent.hover(text)

      expect(getComputedStyle(text).backgroundImage).toBe('none')
      await userEvent.unhover(text)
    })

    it('should show the 13% focus overlay and the 2 dp rise for keyboard focus and drop both on blur', async () => {
      const el = chip({ onClick: () => {} }, 'Open')
      await settle()

      await userEvent.tab()

      expect(document.activeElement).toBe(el)
      expect(el.matches(':focus-visible')).toBe(true)
      expect(Object.hasOwn(el.dataset, 'focused')).toBe(true)
      // 13% of the chip's 87% ink, Vuetify 1.5's focus overlay (_chips.styl:84-95).
      await expect.poll(() => getComputedStyle(el).backgroundImage).toContain('0 0 0 / 0.1131')
      await expect.poll(() => getComputedStyle(el).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))

      await userEvent.click(document.body)

      expect(Object.hasOwn(el.dataset, 'focused')).toBe(false)
      await expect.poll(() => getComputedStyle(el).backgroundImage).toBe('none')
      await expect.poll(() => getComputedStyle(el).boxShadow).toBe('none')
    })

    it('should draw the pressed ink from the press point on a pressable chip and release it on pointerup', async () => {
      const el = chip({ onClick: () => {} }, 'Open', app => {
        app.use(createReducedMotionPlugin({ mode: 'never' }))
      })
      await settle()

      down(el, 10, 10)
      await settle()

      const list = inks(el)

      expect(list.length).toBe(1)
      expect(list[0]!.dataset.state).toBe('in')
      expect(getComputedStyle(list[0]!).backgroundColor).toBe('rgba(153, 153, 153, 0.4)')

      up(el)

      await expect.poll(() => inks(el).length).toBe(0)
    })

    it('should disable a pressable chip natively: disabled, aria-disabled, data-disabled, out of the tab order, no click, no ink', async () => {
      let clicks = 0
      const el = chip({ disabled: true, onClick: () => clicks++ }, 'Open') as HTMLButtonElement
      await settle()

      expect(el.disabled).toBe(true)
      expect(el.getAttribute('aria-disabled')).toBe('true')
      expect(Object.hasOwn(el.dataset, 'disabled')).toBe(true)
      expect(el.getAttribute('tabindex')).toBe('-1')

      el.focus()

      expect(document.activeElement).not.toBe(el)

      el.click()
      down(el, 10, 10)
      await settle()

      expect(clicks).toBe(0)
      expect(inks(el).length).toBe(0)
      expect(getComputedStyle(el).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(el).pointerEvents).toBe('none')
    })
  })

  describe('theme', () => {
    it('should take its fill, ink and glyph tokens from the adapter sheet in both themes', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', [
        h('div', { 'data-theme': 'md1-light' }, [h(Md1Chip, { deletable: true }, () => 'Light')]),
        h('div', { 'data-theme': 'md1-dark' }, [
          h(Md1Chip, { deletable: true, icon: 'label' }, () => 'Dark'),
          h(Md1Chip, { disabled: true }, () => 'Off'),
        ]),
      ]))
      await settle()

      const [light, dark, off] = host.querySelectorAll<HTMLElement>('.md1-chip')

      // The sheet and the stylesheet fallbacks agree on the light theme.
      expect(getComputedStyle(light!).backgroundColor).toBe('rgb(224, 224, 224)')
      expect(getComputedStyle(light!).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(light!.querySelector('.md1-chip__delete')!).color).toBe('rgba(0, 0, 0, 0.54)')
      // The dark theme: Vuetify 1.5's #555555 fill, white ink, white glyphs (colour page), 50% disabled text.
      expect(getComputedStyle(dark!).backgroundColor).toBe('rgb(85, 85, 85)')
      expect(getComputedStyle(dark!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(dark!.querySelector('.md1-chip__icon')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(dark!.querySelector('.md1-chip__delete')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(off!).color).toBe('rgba(255, 255, 255, 0.5)')
    })

    it('should keep a scoped dark theme on the open Addresses sheet', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'md1-dark' }, [
        h(Md1Chip, { contact: true, open: true }, () => [
          'Alice Jones',
          h(Md1ChipAddresses, null, () => [h(Md1ChipAddress, null, () => 'alice@example.com')]),
        ]),
      ]))
      await settle()

      const content = host.querySelector<HTMLElement>('.md1-chip__addresses')!

      await expect.poll(() => content.matches(':popover-open')).toBe(true)
      // Grey 800 surface and white ink: the sheet stayed inside the themed subtree.
      expect(getComputedStyle(content).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(content).color).toBe('rgb(255, 255, 255)')
    })
  })
})
