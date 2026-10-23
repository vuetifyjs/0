import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { Md1TimePicker } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { Md1TimePickerProps } from './Md1TimePicker.vue'
import type { ShallowRef, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  host.style.padding = '24px'
  document.body.append(host)
  const app = createApp({ render: node })
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

interface Picker {
  root: HTMLElement
  model: ShallowRef<string | undefined>
}

function picker (props: Md1TimePickerProps = {}, value?: string): Picker {
  const model = shallowRef<string | undefined>(value)
  const host = mount(() => h(Md1TimePicker, {
    ...props,
    'modelValue': model.value,
    'onUpdate:modelValue': (next: string | undefined) => {
      model.value = next
    },
  }))
  return { root: host.querySelector<HTMLElement>('.md1-time-picker')!, model }
}

function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The browser's own serialization of a colour, so assertions never guess at its formatting. */
function serialize (value: string): string {
  const probe = document.createElement('div')
  probe.style.color = value
  document.body.append(probe)
  const result = getComputedStyle(probe).color
  probe.remove()
  return result
}

function clock (root: HTMLElement): HTMLElement {
  return root.querySelector<HTMLElement>('.md1-time-picker__clock')!
}

function numbers (root: HTMLElement): HTMLButtonElement[] {
  return [...root.querySelectorAll<HTMLButtonElement>('.md1-time-picker__number')]
}

function number (root: HTMLElement, label: string): HTMLButtonElement {
  return numbers(root).find(el => el.getAttribute('aria-label') === label)!
}

function checked (root: HTMLElement): HTMLButtonElement | undefined {
  return numbers(root).find(el => el.getAttribute('aria-checked') === 'true')
}

/** The centre of an element relative to the clock's top-left corner. */
function offset (root: HTMLElement, el: Element) {
  const face = clock(root).getBoundingClientRect()
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2 - face.left, y: rect.top + rect.height / 2 - face.top }
}

/** A point on the face at `angle` degrees clockwise from twelve and `radius` px from the centre. */
function at (root: HTMLElement, angle: number, radius: number) {
  const rect = clock(root).getBoundingClientRect()
  const radians = angle * Math.PI / 180
  return {
    x: rect.width / 2 + radius * Math.sin(radians),
    y: rect.height / 2 - radius * Math.cos(radians),
  }
}

function pointer (root: HTMLElement, type: string, angle: number, radius: number) {
  const el = clock(root)
  const rect = el.getBoundingClientRect()
  const point = at(root, angle, radius)
  el.dispatchEvent(new PointerEvent(type, {
    bubbles: true,
    button: 0,
    pointerId: 1,
    pointerType: 'mouse',
    clientX: rect.left + point.x,
    clientY: rect.top + point.y,
  }))
}

function hand (root: HTMLElement): SVGGElement {
  return root.querySelector<SVGGElement>('.md1-time-picker__hand')!
}

async function settle () {
  await nextTick()
  await nextTick()
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

describe('quTimePicker', () => {
  describe('anatomy', () => {
    it('should render the header toggles, the period radios and a radio per hour on the face', async () => {
      const { root } = picker({}, '15:30')
      await settle()

      expect(root.tagName).toBe('DIV')
      expect(root.dataset.view).toBe('hour')
      expect(root.dataset.period).toBe('pm')
      expect(Object.hasOwn(root.dataset, 'landscape')).toBe(false)

      const view = root.querySelector('.md1-time-picker__view')!
      const [hours, minutes] = view.querySelectorAll('button')

      expect(view.getAttribute('role')).toBe('group')
      expect(view.getAttribute('aria-label')).toBe('Time')
      expect(hours!.classList.contains('md1-time-picker__hours')).toBe(true)
      expect(hours!.getAttribute('aria-pressed')).toBe('true')
      expect(hours!.getAttribute('aria-label')).toBe('Hours 3')
      expect(hours!.textContent).toBe('3')
      expect(minutes!.getAttribute('aria-pressed')).toBe('false')
      expect(minutes!.getAttribute('aria-label')).toBe('Minutes 30')
      expect(minutes!.textContent).toBe('30')
      expect(view.querySelector('.md1-time-picker__separator')!.getAttribute('aria-hidden')).toBe('true')

      const period = root.querySelector('.md1-time-picker__period')!
      const radios = [...period.querySelectorAll('button')]

      expect(period.getAttribute('role')).toBe('radiogroup')
      expect(period.getAttribute('aria-label')).toBe('AM or PM')
      expect(radios.map(el => el.textContent)).toEqual(['AM', 'PM'])
      expect(radios.map(el => el.getAttribute('aria-checked'))).toEqual(['false', 'true'])

      const face = clock(root)

      expect(face.getAttribute('role')).toBe('radiogroup')
      expect(face.getAttribute('aria-label')).toBe('Hours')
      expect(numbers(root).map(el => el.textContent)).toEqual(['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'])
      expect(numbers(root).every(el => el.getAttribute('role') === 'radio')).toBe(true)
      expect(checked(root)!.getAttribute('aria-label')).toBe('3')
      expect(face.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true')
    })

    it('should put an Md1Ripple first in every interactive root', async () => {
      const { root } = picker()
      await settle()

      const hosts = root.querySelectorAll('button')

      expect(hosts.length).toBe(2 + 2 + 12)
      for (const el of hosts) {
        expect(el.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
        expect(['relative', 'absolute']).toContain(getComputedStyle(el).position)
      }
    })

    it('should show 12:00 AM with the hand at twelve when the model is empty', async () => {
      const { root, model } = picker()
      await settle()

      expect(root.querySelector('.md1-time-picker__hours')!.textContent).toBe('12')
      expect(root.querySelector('.md1-time-picker__minutes')!.textContent).toBe('00')
      expect(root.dataset.period).toBe('am')
      expect(checked(root)!.getAttribute('aria-label')).toBe('12')
      expect(hand(root).style.transform).toBe('rotate(0deg)')
      expect(model.value).toBeUndefined()
    })
  })

  describe('geometry', () => {
    it('should lay out the portrait picker: 328 dp wide, a 96 dp header, the 296 dp face 32 dp under it', async () => {
      const { root } = picker({}, '03:00')
      await settle()

      const header = root.querySelector('.md1-time-picker__header')!.getBoundingClientRect()
      const face = clock(root).getBoundingClientRect()

      expect(root.getBoundingClientRect().width).toBe(328)
      expect(header.height).toBe(96)
      expect(face.width).toBe(296)
      expect(face.height).toBe(296)
      expect(face.top - header.bottom).toBe(32)
      expect(face.left - root.getBoundingClientRect().left).toBe(16)
      expect(root.getBoundingClientRect().bottom - face.bottom).toBe(8)
    })

    it('should shrink the face and its ring with a container below 328 dp', async () => {
      const { root } = picker({}, '03:00')
      root.parentElement!.style.width = '280px'
      await settle()

      const face = clock(root).getBoundingClientRect()
      const scale = face.width / 296

      expect(root.getBoundingClientRect().width).toBe(280)
      expect(face.width).toBe(248)
      expect(face.height).toBe(248)
      expect(offset(root, number(root, '3')).x).toBeCloseTo(272 * scale, 0)
      expect(offset(root, number(root, '3')).y).toBeCloseTo(148 * scale, 0)
    })

    it('should set the numbers on a 124 dp radius as 40 dp circles', async () => {
      const { root } = picker()
      await settle()

      const twelve = offset(root, number(root, '12'))
      const three = offset(root, number(root, '3'))

      expect(twelve.x).toBeCloseTo(148, 0)
      expect(twelve.y).toBeCloseTo(24, 0)
      expect(three.x).toBeCloseTo(272, 0)
      expect(three.y).toBeCloseTo(148, 0)
      expect(number(root, '3').getBoundingClientRect().width).toBe(40)
      expect(getComputedStyle(number(root, '3')).borderRadius).toBe('50%')
    })

    it('should draw a 2 dp hand from a 6 dp dot to a 40 dp target on the ring', async () => {
      const { root } = picker({}, '03:00')
      await settle()

      const line = root.querySelector('.md1-time-picker__line')!
      const dot = root.querySelector('.md1-time-picker__dot')!
      const target = root.querySelector('.md1-time-picker__target')!

      expect(root.querySelector('svg')!.getAttribute('viewBox')).toBe('0 0 296 296')
      expect(root.querySelector('.md1-time-picker__dial')!.getAttribute('r')).toBe('148')
      expect(line.getAttribute('y1')).toBe('148')
      expect(line.getAttribute('y2')).toBe('24')
      expect(getComputedStyle(line).strokeWidth).toBe('2px')
      expect(dot.getAttribute('r')).toBe('3')
      expect(target.getAttribute('r')).toBe('20')
      expect(target.getAttribute('cy')).toBe('24')
      expect(hand(root).style.transform).toBe('rotate(90deg)')
    })

    it('should switch to the landscape layout: a 168 dp header column, a 224 dp face and a 36 dp target', async () => {
      const { root } = picker({ landscape: true }, '03:00')
      await settle()

      const header = root.querySelector('.md1-time-picker__header')!.getBoundingClientRect()
      const face = clock(root).getBoundingClientRect()
      const body = root.querySelector('.md1-time-picker__body')!.getBoundingClientRect()

      expect(Object.hasOwn(root.dataset, 'landscape')).toBe(true)
      expect(root.getBoundingClientRect().width).toBe(512)
      expect(header.width).toBe(168)
      expect(header.height).toBe(root.getBoundingClientRect().height)
      expect(face.width).toBe(224)
      expect(face.top - body.top).toBe(20)
      expect(face.left - body.left).toBe(60)
      expect(root.querySelector('.md1-time-picker__target')!.getAttribute('r')).toBe('18')
      expect(number(root, '3').getBoundingClientRect().width).toBe(36)
      // The period stacks under the time.
      const time = root.querySelector('.md1-time-picker__view')!.getBoundingClientRect()
      const period = root.querySelector('.md1-time-picker__period')!.getBoundingClientRect()
      expect(period.top).toBeGreaterThanOrEqual(time.bottom)
    })
  })

  describe('type and colour', () => {
    it('should set the digits at 60 sp (48 sp landscape) and the period at 14 sp capitals', async () => {
      const { root } = picker()
      const { root: wide } = picker({ landscape: true })
      await settle()

      const hours = getComputedStyle(root.querySelector('.md1-time-picker__hours')!)
      const meridiem = getComputedStyle(root.querySelector('.md1-time-picker__meridiem')!)

      expect(hours.fontSize).toBe('60px')
      expect(hours.fontWeight).toBe('400')
      expect(hours.fontFamily).toContain('Roboto')
      expect(getComputedStyle(wide.querySelector('.md1-time-picker__hours')!).fontSize).toBe('48px')
      expect(meridiem.fontSize).toBe('14px')
      expect(meridiem.fontWeight).toBe('500')
      expect(meridiem.textTransform).toBe('uppercase')
      expect(getComputedStyle(number(root, '3')).fontSize).toBe('16px')
    })

    it('should paint the header in the primary colour with the inactive segment at 70% white', async () => {
      const { root } = picker({}, '15:30')
      await settle()

      const header = getComputedStyle(root.querySelector('.md1-time-picker__header')!)
      const [am, pm] = root.querySelectorAll('.md1-time-picker__meridiem')

      expect(header.backgroundColor).toBe('rgb(63, 81, 181)')
      expect(header.color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(root.querySelector('.md1-time-picker__hours')!).opacity).toBe('1')
      expect(getComputedStyle(root.querySelector('.md1-time-picker__minutes')!).opacity).toBe('0.7')
      expect(getComputedStyle(am!).opacity).toBe('0.7')
      expect(getComputedStyle(pm!).opacity).toBe('1')
    })

    it('should draw a Grey 200 face, a primary hand and white ink on the selected number', async () => {
      const { root } = picker({}, '03:00')
      await settle()

      expect(getComputedStyle(root.querySelector('.md1-time-picker__dial')!).fill).toBe('rgb(238, 238, 238)')
      expect(getComputedStyle(root.querySelector('.md1-time-picker__line')!).stroke).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(root.querySelector('.md1-time-picker__target')!).fill).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(number(root, '3')).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(number(root, '4')).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(root).backgroundColor).toBe('rgb(255, 255, 255)')
    })

    it('should take the dark theme values: Grey 700 header and face, accent 200 hand, dark ink on the target', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'md1-dark' }, [h(Md1TimePicker, { modelValue: '03:00' })]))
      await settle()

      const root = host.querySelector<HTMLElement>('.md1-time-picker')!

      expect(getComputedStyle(root).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(root.querySelector('.md1-time-picker__header')!).backgroundColor).toBe('rgb(97, 97, 97)')
      expect(getComputedStyle(root.querySelector('.md1-time-picker__dial')!).fill).toBe('rgb(97, 97, 97)')
      expect(getComputedStyle(root.querySelector('.md1-time-picker__target')!).fill).toBe('rgb(244, 143, 177)')
      expect(getComputedStyle(root.querySelector('.md1-time-picker__line')!).stroke).toBe('rgb(244, 143, 177)')
      expect(getComputedStyle(number(root, '3')).color).toBe(serialize('color-mix(in srgb, #000000 87%, transparent)'))
      expect(getComputedStyle(number(root, '4')).color).toBe('rgb(255, 255, 255)')
    })
  })

  describe('views', () => {
    it('should switch to the minute ring from the header and back', async () => {
      const { root } = picker({}, '15:30')
      await settle()

      await userEvent.click(root.querySelector('.md1-time-picker__minutes')!)
      await settle()

      expect(root.dataset.view).toBe('minute')
      expect(root.querySelector('.md1-time-picker__minutes')!.getAttribute('aria-pressed')).toBe('true')
      expect(clock(root).getAttribute('aria-label')).toBe('Minutes')
      expect(numbers(root).length).toBe(60)
      expect(numbers(root).filter(el => Object.hasOwn(el.dataset, 'labelled')).map(el => el.textContent))
        .toEqual(['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'])
      expect(checked(root)!.getAttribute('aria-label')).toBe('30')
      expect(hand(root).style.transform).toBe('rotate(180deg)')

      await userEvent.click(root.querySelector('.md1-time-picker__hours')!)
      await settle()

      expect(root.dataset.view).toBe('hour')
      expect(numbers(root).length).toBe(12)
      expect(hand(root).style.transform).toBe('rotate(90deg)')
    })

    it('should keep the view pressed when its own toggle is pressed again', async () => {
      const { root } = picker()
      await settle()

      await userEvent.click(root.querySelector('.md1-time-picker__hours')!)
      await settle()

      expect(root.dataset.view).toBe('hour')
      expect(root.querySelector('.md1-time-picker__hours')!.getAttribute('aria-pressed')).toBe('true')
    })

    it('should move the hour across the day with AM and PM', async () => {
      const { root, model } = picker({}, '15:30')
      await settle()

      const [am, pm] = root.querySelectorAll<HTMLButtonElement>('.md1-time-picker__meridiem')

      await userEvent.click(am!)
      await settle()

      expect(model.value).toBe('03:30')
      expect(root.dataset.period).toBe('am')
      expect(am!.getAttribute('aria-checked')).toBe('true')
      expect(root.querySelector('.md1-time-picker__hours')!.textContent).toBe('3')

      await userEvent.click(pm!)
      await settle()

      expect(model.value).toBe('15:30')
      expect(root.dataset.period).toBe('pm')
    })
  })

  describe('pointer', () => {
    it('should pick the hour under a tap and move to the minutes', async () => {
      const { root, model } = picker({}, '15:30')
      await settle()

      // The numbers do not take the pointer; the face does, so the press lands on it wherever it is.
      expect(getComputedStyle(number(root, '5')).pointerEvents).toBe('none')

      await userEvent.click(clock(root), { position: at(root, 150, 124) })
      await settle()

      expect(model.value).toBe('17:30')
      expect(root.dataset.view).toBe('minute')
      expect(checked(root)!.getAttribute('aria-label')).toBe('30')
    })

    it('should pick the nearest minute anywhere on the face, between the printed fives', async () => {
      const { root, model } = picker({}, '09:00')
      await settle()

      await userEvent.click(root.querySelector('.md1-time-picker__minutes')!)
      await settle()
      await userEvent.click(clock(root), { position: at(root, 37 * 6, 90) })
      await settle()

      expect(model.value).toBe('09:37')
      expect(root.dataset.view).toBe('minute')
      expect(checked(root)!.getAttribute('aria-label')).toBe('37')
      // No number is printed at 37, so the target carries a dot.
      expect(root.querySelector('.md1-time-picker__pip')).not.toBeNull()
    })

    it('should sweep the hand while dragging and settle on release', async () => {
      const { root, model } = picker({}, '03:00')
      await settle()

      pointer(root, 'pointerdown', 90, 124)
      await settle()

      expect(Object.hasOwn(clock(root).dataset, 'dragging')).toBe(true)
      expect(model.value).toBe('03:00')

      pointer(root, 'pointermove', 180, 124)
      await settle()

      expect(model.value).toBe('06:00')
      expect(root.dataset.view).toBe('hour')
      expect(hand(root).style.transform).toBe('rotate(180deg)')

      pointer(root, 'pointerup', 210, 124)
      await settle()

      expect(model.value).toBe('07:00')
      expect(root.dataset.view).toBe('minute')
      expect(Object.hasOwn(clock(root).dataset, 'dragging')).toBe(false)
    })

    it('should ignore a move with no press and a secondary button', async () => {
      const { root, model } = picker({}, '03:00')
      await settle()

      pointer(root, 'pointermove', 180, 124)
      clock(root).dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 2, pointerId: 1 }))
      await settle()

      expect(model.value).toBe('03:00')
      expect(root.dataset.view).toBe('hour')
    })

    it('should turn the hand the short way round past twelve', async () => {
      const { root } = picker({}, '10:55')
      await settle()

      await userEvent.click(root.querySelector('.md1-time-picker__minutes')!)
      await settle()

      expect(hand(root).style.transform).toBe('rotate(330deg)')

      pointer(root, 'pointerdown', 0, 124)
      await settle()

      expect(hand(root).style.transform).toBe('rotate(360deg)')

      pointer(root, 'pointerup', 0, 124)
    })
  })

  describe('keyboard', () => {
    it('should rotate the hand with the arrows and commit the hour with Enter', async () => {
      const { root, model } = picker({}, '15:30')
      await settle()

      await userEvent.tab()
      await userEvent.tab()
      await userEvent.tab()
      await userEvent.tab()

      // Hours, minutes, the checked period, then the checked number: the radio groups rove.
      expect(document.activeElement).toBe(number(root, '3'))

      await userEvent.keyboard('{ArrowRight}')
      await settle()

      expect(model.value).toBe('16:30')
      expect(document.activeElement).toBe(number(root, '4'))
      expect(hand(root).style.transform).toBe('rotate(120deg)')

      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
      await settle()

      expect(model.value).toBe('14:30')

      await userEvent.keyboard('{Enter}')
      await settle()

      expect(root.dataset.view).toBe('minute')
      expect(document.activeElement).toBe(number(root, '30'))

      await userEvent.keyboard('{ArrowRight}')
      await settle()

      expect(model.value).toBe('14:31')
      expect(root.dataset.view).toBe('minute')
    })

    it('should wrap the minute ring from 00 to 59', async () => {
      const { root, model } = picker({}, '08:00')
      await settle()

      await userEvent.click(root.querySelector('.md1-time-picker__minutes')!)
      await settle()

      number(root, '00').focus()
      await userEvent.keyboard('{ArrowLeft}')
      await settle()

      expect(model.value).toBe('08:59')
      expect(document.activeElement).toBe(number(root, '59'))
    })

    it('should show the keyboard focus as a 12% halo round the number', async () => {
      const { root } = picker({}, '03:00')
      await settle()

      number(root, '3').focus()
      await userEvent.keyboard('{ArrowRight}')
      await settle()

      const el = number(root, '4')

      expect(el.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(el).boxShadow).toBe('rgba(0, 0, 0, 0.12) 0px 0px 0px 8px')
    })

    it('should advance to the minutes when assistive technology clicks an hour', async () => {
      const { root, model } = picker({}, '03:00')
      await settle()

      number(root, '9').click()
      await settle()

      expect(model.value).toBe('09:00')
      expect(root.dataset.view).toBe('minute')
      expect(document.activeElement).toBe(number(root, '00'))
    })

    it('should switch the period with the arrows on AM and PM', async () => {
      const { root, model } = picker({}, '15:30')
      await settle()

      const [am, pm] = root.querySelectorAll<HTMLButtonElement>('.md1-time-picker__meridiem')

      pm!.focus()
      await userEvent.keyboard('{ArrowUp}')
      await settle()

      expect(model.value).toBe('03:30')
      expect(document.activeElement).toBe(am)
      expect(root.dataset.period).toBe('am')

      await userEvent.keyboard('{ArrowDown}')
      await settle()

      expect(model.value).toBe('15:30')
      expect(document.activeElement).toBe(pm)
    })

    it('should show the 12% focus overlay and the 6% hover overlay on the header buttons', async () => {
      const { root } = picker({}, '15:30')
      await settle()

      const hours = root.querySelector<HTMLElement>('.md1-time-picker__hours')!
      const minutes = root.querySelector<HTMLElement>('.md1-time-picker__minutes')!

      await userEvent.tab()

      expect(document.activeElement).toBe(hours)
      expect(hours.matches(':focus-visible')).toBe(true)
      expect(getComputedStyle(hours).backgroundColor).toBe(serialize('color-mix(in srgb, #ffffff 12%, transparent)'))

      await userEvent.hover(minutes)

      expect(getComputedStyle(minutes).backgroundColor).toBe(serialize('color-mix(in srgb, #ffffff 6%, transparent)'))
    })
  })

  describe('motion', () => {
    it('should sweep the hand on a change, and jump while dragging or under reduced motion', async () => {
      const { root } = picker({}, '03:00')
      await settle()

      // The runner's context requests reduced motion, so the OS query alone stops the sweep.
      expect(getComputedStyle(hand(root)).transitionDuration).toBe('0s')

      // The reduced-motion plugin's body attribute overrides the OS preference.
      document.body.dataset.reducedMotion = 'no-preference'

      expect(getComputedStyle(hand(root)).transitionProperty).toBe('transform')
      expect(getComputedStyle(hand(root)).transitionDuration).not.toBe('0s')

      pointer(root, 'pointerdown', 90, 124)
      await settle()

      expect(getComputedStyle(hand(root)).transitionDuration).toBe('0s')

      pointer(root, 'pointerup', 90, 124)
      await settle()

      expect(getComputedStyle(hand(root)).transitionDuration).not.toBe('0s')

      document.body.dataset.reducedMotion = 'reduce'

      expect(getComputedStyle(hand(root)).transitionDuration).toBe('0s')
    })
  })

  describe('24 hour', () => {
    it('should add the inner ring for 00 and 13 to 23 and show the hours zero padded', async () => {
      const { root } = picker({ format: '24' }, '15:00')
      await settle()

      const inner = numbers(root).filter(el => el.dataset.ring === 'inner')

      expect(numbers(root).length).toBe(24)
      expect(inner.map(el => el.textContent)).toEqual(['00', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'])
      expect(root.querySelector('.md1-time-picker__period')).toBeNull()
      expect(root.querySelector('.md1-time-picker__hours')!.textContent).toBe('15')
      expect(checked(root)!.getAttribute('aria-label')).toBe('15')

      const fifteen = offset(root, number(root, '15'))

      expect(fifteen.x).toBeCloseTo(148 + 124 * 0.62, 0)
      expect(fifteen.y).toBeCloseTo(148, 0)
      expect(Number(root.querySelector('.md1-time-picker__line')!.getAttribute('y2'))).toBeCloseTo(148 - 124 * 0.62, 3)
      expect(getComputedStyle(number(root, '16')).fontSize).toBe('14px')
      expect(getComputedStyle(number(root, '16')).color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should pick the inner ring near the centre and the outer ring at the edge', async () => {
      const { root, model } = picker({ format: '24' }, '00:00')
      await settle()

      pointer(root, 'pointerdown', 90, 77)
      pointer(root, 'pointermove', 90, 77)
      await settle()

      expect(model.value).toBe('15:00')

      pointer(root, 'pointermove', 90, 124)
      await settle()

      expect(model.value).toBe('03:00')

      pointer(root, 'pointerup', 90, 124)
      await settle()

      expect(root.dataset.view).toBe('minute')
    })

    it('should walk the arrows through the day in order', async () => {
      const { root, model } = picker({ format: '24' }, '11:00')
      await settle()

      number(root, '11').focus()
      await userEvent.keyboard('{ArrowRight}')
      await settle()

      expect(model.value).toBe('12:00')

      await userEvent.keyboard('{ArrowRight}')
      await settle()

      expect(model.value).toBe('13:00')
      expect(root.querySelector('.md1-time-picker__line')!.getAttribute('y2')).not.toBe('24')
    })
  })

  describe('model', () => {
    it('should follow the model when it changes from outside', async () => {
      const { root, model } = picker({}, '01:05')
      await settle()

      model.value = '22:45'
      await settle()

      expect(root.querySelector('.md1-time-picker__hours')!.textContent).toBe('10')
      expect(root.querySelector('.md1-time-picker__minutes')!.textContent).toBe('45')
      expect(root.dataset.period).toBe('pm')
    })

    it('should warn in dev for a value that is not HH:mm and keep the face', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const { root } = picker({}, '25:00')
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('Md1TimePicker'))
      expect(root.querySelector('.md1-time-picker__hours')!.textContent).toBe('12')
    })
  })
})
