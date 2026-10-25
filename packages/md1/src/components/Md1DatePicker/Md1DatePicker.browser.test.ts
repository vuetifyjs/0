import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createDatePlugin } from '@vuetify/v0'
import { V0DateAdapter } from '@vuetify/v0/date'

// Composables
import { toIso } from '../../composables/createDatePickerCore'

// Components
import { Md1DatePicker } from './index'

// Utilities
import { createApp, defineComponent, h, nextTick, provide, shallowRef } from 'vue'

// Types
import type { Md1DatePickerProps } from './Md1DatePicker.vue'
import type { App, ShallowRef, VNode } from 'vue'

// Theme
import { Md1StyleSheetAdapter } from '../../adapter'
import { md1Colors, md1DarkColors } from '../../colors'
// Icons
import { md1Icons } from '../../icons'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
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

interface Options extends Md1DatePickerProps {
  value?: ShallowRef<string | undefined>
  setup?: (app: App) => void
  dir?: 'ltr' | 'rtl'
}

/** A picker on a two-way model, April 13 2017 (the spec image's date) unless `value` says otherwise. */
function picker (options: Options = {}): { root: HTMLElement, value: ShallowRef<string | undefined> } {
  const { value = shallowRef<string | undefined>('2017-04-13'), setup, dir, ...props } = options

  const host = mount(() => h('div', { dir }, [h(Md1DatePicker, {
    ...props,
    'modelValue': value.value,
    'onUpdate:modelValue': (next: string | undefined) => {
      value.value = next
    },
  })]), setup)

  return { root: host.querySelector<HTMLElement>('.md1-date-picker')!, value }
}

function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

function q<T extends HTMLElement = HTMLElement> (root: HTMLElement, selector: string): T {
  return root.querySelector<T>(selector)!
}

function day (root: HTMLElement, iso: string): HTMLButtonElement {
  const label = format(iso, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return root.querySelector<HTMLButtonElement>(`.md1-date-picker__day[aria-label="${CSS.escape(label)}"]`)!
}

function days (root: HTMLElement): HTMLButtonElement[] {
  return [...root.querySelectorAll<HTMLButtonElement>('.md1-date-picker__day')]
}

function format (iso: string, options: Intl.DateTimeFormatOptions): string {
  const [year, month, date] = iso.split('-').map(Number)

  return new Intl.DateTimeFormat(undefined, options).format(new Date(year!, month! - 1, date))
}

function month (iso: string): string {
  return format(iso, { month: 'long', year: 'numeric' })
}

function rect (el: Element) {
  return el.getBoundingClientRect()
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

describe('quDatePicker', () => {
  describe('anatomy', () => {
    it('should render the header, the navigation row and an APG grid of six weeks', async () => {
      const { root } = picker()
      await settle()

      expect(root.tagName).toBe('DIV')
      expect(root.getAttribute('role')).toBe('group')
      expect(root.dataset.view).toBe('date')
      expect(Object.hasOwn(root.dataset, 'landscape')).toBe(false)

      const date = q(root, '.md1-date-picker__date')

      expect(root.getAttribute('aria-labelledby')).toBe(date.id)
      expect(date.textContent).toBe(format('2017-04-13', { weekday: 'short', month: 'short', day: 'numeric' }))
      expect(q(root, '.md1-date-picker__year').textContent!.trim()).toBe('2017')

      const grid = q(root, 'table.md1-date-picker__grid')
      const label = q(root, '.md1-date-picker__month')

      expect(grid.getAttribute('role')).toBe('grid')
      expect(grid.getAttribute('aria-labelledby')).toBe(label.id)
      expect(label.textContent).toBe(month('2017-04-01'))
      expect(label.getAttribute('aria-live')).toBe('polite')
      expect(grid.querySelectorAll('tbody tr').length).toBe(6)
      expect(grid.querySelectorAll('td[role="gridcell"]').length).toBe(42)
      // April 2017 has 30 days; the spill cells are blank, as the spec draws them.
      expect(days(root).length).toBe(30)
      expect(days(root)[0]!.textContent!.trim()).toBe('1')
    })

    it('should host an Md1Ripple as the first child of every interactive element', async () => {
      const { root } = picker()
      await settle()

      const hosts = [
        q(root, '.md1-date-picker__year'),
        ...root.querySelectorAll<HTMLElement>('.md1-date-picker__step'),
        ...days(root),
      ]

      for (const host of hosts) {
        expect(host.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
        expect(getComputedStyle(host).position).toBe('relative')
      }

      await userEvent.click(q(root, '.md1-date-picker__year'))
      await settle()

      const options = [...root.querySelectorAll<HTMLElement>('.md1-date-picker__option')]

      expect(options.length).toBeGreaterThan(0)

      for (const option of options) {
        expect(option.firstElementChild!.classList.contains('md1-ripple')).toBe(true)
        expect(getComputedStyle(option).position).toBe('relative')
      }
    })

    it('should name the weekday columns and print their initials, starting on Sunday', async () => {
      const { root } = picker()
      await settle()

      const headers = [...root.querySelectorAll<HTMLElement>('th')]
      const sunday = format('2024-01-07', { weekday: 'long' })

      expect(headers.length).toBe(7)
      expect(headers[0]!.getAttribute('scope')).toBe('col')
      expect(headers[0]!.getAttribute('aria-label')).toBe(sunday)
      expect(headers[0]!.textContent!.trim()).toBe(format('2024-01-07', { weekday: 'narrow' }))
      // April 1 2017 is a Saturday: six blank cells lead the first week.
      const first = [...root.querySelector('tbody tr')!.querySelectorAll('td')]

      expect(first.slice(0, 6).every(cell => cell.childElementCount === 0)).toBe(true)
      expect(first[6]!.textContent!.trim()).toBe('1')
    })

    it('should start the week on the firstDayOfWeek prop', async () => {
      const { root } = picker({ firstDayOfWeek: 1 })
      await settle()

      const first = [...root.querySelector('tbody tr')!.querySelectorAll('td')]

      expect(root.querySelector('th')!.getAttribute('aria-label')).toBe(format('2024-01-08', { weekday: 'long' }))
      expect(first.slice(0, 5).every(cell => cell.childElementCount === 0)).toBe(true)
      expect(first[5]!.textContent!.trim()).toBe('1')
    })

    it('should fold a firstDayOfWeek outside 0 to 6 onto a weekday without losing a day', async () => {
      // October 1 2017 is a Sunday: an unfolded 8 gave the grid a negative lead and dropped it.
      const { root } = picker({ value: shallowRef('2017-10-01'), firstDayOfWeek: 8 })
      await settle()

      const first = [...root.querySelector('tbody tr')!.querySelectorAll('td')]

      expect(root.querySelector('th')!.getAttribute('aria-label')).toBe(format('2024-01-08', { weekday: 'long' }))
      expect(first.slice(0, 6).every(cell => cell.childElementCount === 0)).toBe(true)
      expect(first[6]!.textContent!.trim()).toBe('1')
      expect(days(root).length).toBe(31)
    })

    it('should take the first weekday from an installed date plugin, and let the prop override it', async () => {
      function plugin (app: App) {
        app.use(createDatePlugin({ adapter: new V0DateAdapter(), locale: 'en-US', firstDayOfWeek: 1 }))
      }

      const { root } = picker({ setup: plugin })
      const { root: sunday } = picker({ setup: plugin, firstDayOfWeek: 0 })
      await settle()

      expect(root.querySelector('th')!.getAttribute('aria-label')).toBe('Monday')
      expect(sunday.querySelector('th')!.getAttribute('aria-label')).toBe('Sunday')
      expect(q(root, '.md1-date-picker__month').textContent).toBe('April 2017')
    })

    it('should draw the chevrons through Md1Icon', async () => {
      const { root } = picker()
      await settle()

      const [prev, next] = root.querySelectorAll<HTMLElement>('.md1-date-picker__step')
      function paths (el: HTMLElement) {
        return [...el.querySelectorAll('svg.md1-icon path')].map(p => p.getAttribute('d'))
      }

      expect(paths(prev!)).toEqual(md1Icons['chevron-left'])
      expect(paths(next!)).toEqual(md1Icons['chevron-right'])
      expect(prev!.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true')
    })
  })

  describe('metrics', () => {
    it('should measure the portrait surface: 328 dp wide, a 96 dp header, 48 dp navigation, 40 dp rows', async () => {
      const { root } = picker()
      await settle()

      expect(rect(root).width).toBe(328)
      // 484 dp less the 60 dp action area the confirmation dialog adds.
      expect(rect(root).height).toBe(424)
      expect(rect(q(root, '.md1-date-picker__header')).height).toBe(96)
      expect(rect(q(root, '.md1-date-picker__nav')).height).toBe(48)
      expect(rect(q(root, 'thead tr')).height).toBe(40)
      expect(rect(q(root, 'tbody tr')).height).toBe(40)
      expect(rect(q(root, 'tbody td')).width).toBe(44)
      expect(rect(q(root, 'tbody')).width).toBe(308)

      const one = day(root, '2017-04-01')

      expect(rect(one).width).toBe(40)
      expect(rect(one).height).toBe(40)
      expect(getComputedStyle(one).borderRadius).toBe('50%')
    })

    it('should narrow to a container below 328 dp, shrinking the day circles to their columns', async () => {
      const { root } = picker()
      root.parentElement!.style.width = '280px'
      await settle()

      expect(rect(root).width).toBe(280)
      expect(rect(q(root, '.md1-date-picker__grid')).width).toBe(260)

      const one = day(root, '2017-04-01')
      const cell = one.closest('td')!

      expect(rect(one).width).toBeLessThanOrEqual(rect(cell).width)
      expect(rect(one).height).toBe(rect(one).width)
      expect(rect(q(root, 'tbody tr')).height).toBe(40)
    })

    it('should set the header: primary band, the year at 14 sp and 70%, the date in Display 1, 24 dp from the start', async () => {
      const { root } = picker()
      await settle()

      const header = q(root, '.md1-date-picker__header')
      const year = q(root, '.md1-date-picker__year')
      const date = q(root, '.md1-date-picker__date')

      expect(getComputedStyle(header).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(header).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(header).paddingLeft).toBe('24px')
      expect(getComputedStyle(year).fontSize).toBe('14px')
      expect(getComputedStyle(year).opacity).toBe('0.7')
      expect(getComputedStyle(date).fontSize).toBe('34px')
      expect(getComputedStyle(date).fontWeight).toBe('400')
      expect(getComputedStyle(date).lineHeight).toBe('40px')
      expect(getComputedStyle(date).opacity).toBe('1')
      expect(rect(date).left - rect(header).left).toBe(24)
    })

    it('should set the body type: Medium 14 sp month, 12 sp weekdays at 38%, 12 sp days at 87%', async () => {
      const { root } = picker()
      await settle()

      const label = getComputedStyle(q(root, '.md1-date-picker__month'))
      const weekday = getComputedStyle(q(root, 'th'))
      const one = getComputedStyle(day(root, '2017-04-01'))
      const chevron = getComputedStyle(q(root, '.md1-date-picker__step'))

      expect(label.fontSize).toBe('14px')
      expect(label.fontWeight).toBe('500')
      expect(label.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(weekday.fontSize).toBe('12px')
      expect(weekday.color).toBe('rgba(0, 0, 0, 0.38)')
      expect(one.fontSize).toBe('12px')
      expect(one.color).toBe('rgba(0, 0, 0, 0.87)')
      expect(chevron.color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should set the chevron glyphs 16 dp from the picker edges', async () => {
      const { root } = picker()
      await settle()

      const [prev, next] = root.querySelectorAll<HTMLElement>('.md1-date-picker__step svg')

      expect(rect(prev!).left - rect(root).left).toBe(16)
      expect(rect(root).right - rect(next!).right).toBe(16)
    })

    it('should lay out landscape: 512 dp wide, a 168 dp header column, 46 x 32 dp cells and a 32 dp circle', async () => {
      const { root } = picker({ landscape: true })
      await settle()

      const header = q(root, '.md1-date-picker__header')
      const body = q(root, '.md1-date-picker__body')

      expect(Object.hasOwn(root.dataset, 'landscape')).toBe(true)
      expect(rect(root).width).toBe(512)
      expect(rect(header).width).toBe(168)
      expect(rect(header).height).toBe(rect(root).height)
      expect(rect(body).width).toBe(344)
      expect(rect(q(root, 'thead tr')).height).toBe(32)
      expect(rect(q(root, 'tbody tr')).height).toBe(32)
      expect(rect(q(root, 'tbody td')).width).toBe(46)
      expect(rect(day(root, '2017-04-13')).width).toBe(32)
      // The date wraps to two 40 dp lines in the narrow column.
      expect(rect(q(root, '.md1-date-picker__date')).height).toBe(80)
    })
  })

  describe('selection', () => {
    it('should fill the selected day with a primary circle and mark its cell selected', async () => {
      const { root } = picker()
      await settle()

      const selected = day(root, '2017-04-13')

      expect(Object.hasOwn(selected.dataset, 'selected')).toBe(true)
      expect(selected.closest('td')!.getAttribute('aria-selected')).toBe('true')
      expect(day(root, '2017-04-12').closest('td')!.getAttribute('aria-selected')).toBe('false')
      expect(getComputedStyle(selected).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(selected).color).toBe('rgb(255, 255, 255)')
      expect(root.querySelectorAll('[data-selected]').length).toBe(1)
    })

    it('should write the model and the header on a click', async () => {
      const { root, value } = picker()
      await settle()

      await userEvent.click(day(root, '2017-04-20'))
      await settle()

      expect(value.value).toBe('2017-04-20')
      expect(Object.hasOwn(day(root, '2017-04-20').dataset, 'selected')).toBe(true)
      expect(Object.hasOwn(day(root, '2017-04-13').dataset, 'selected')).toBe(false)
      expect(q(root, '.md1-date-picker__date').textContent).toBe(format('2017-04-20', { weekday: 'short', month: 'short', day: 'numeric' }))
      expect(document.activeElement).toBe(day(root, '2017-04-20'))
    })

    it('should mark today in the primary colour and a heavier weight, with aria-current', async () => {
      const today = toIso(new Date())
      const { root } = picker({ value: shallowRef(undefined) })
      await settle()

      const cell = day(root, today)

      expect(cell.getAttribute('aria-current')).toBe('date')
      expect(Object.hasOwn(cell.dataset, 'today')).toBe(true)
      expect(getComputedStyle(cell).color).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(cell).fontWeight).toBe('700')
      expect(root.querySelectorAll('[aria-current="date"]').length).toBe(1)
      // With nothing selected the header shows the focused day, today.
      expect(root.querySelectorAll('[data-selected]').length).toBe(0)
      expect(cell.tabIndex).toBe(0)
    })

    it('should follow a model written from outside, paging to its month', async () => {
      const value = shallowRef<string | undefined>('2017-04-13')
      const { root } = picker({ value })
      await settle()

      value.value = '2018-01-05'
      await settle()

      expect(q(root, '.md1-date-picker__month').textContent).toBe(month('2018-01-01'))
      expect(Object.hasOwn(day(root, '2018-01-05').dataset, 'selected')).toBe(true)
      expect(day(root, '2018-01-05').tabIndex).toBe(0)
    })

    it('should ignore a model that is not a YYYY-MM-DD date', async () => {
      const { root } = picker({ value: shallowRef('next tuesday') })
      await settle()

      expect(q(root, '.md1-date-picker__month').textContent).toBe(month(toIso(new Date())))
      expect(root.querySelectorAll('[data-selected]').length).toBe(0)
    })
  })

  describe('keyboard', () => {
    it('should keep exactly one day in the tab order: the selected one', async () => {
      const { root } = picker()
      await settle()

      const tabbable = days(root).filter(el => el.tabIndex === 0)

      expect(tabbable).toEqual([day(root, '2017-04-13')])
    })

    it('should move by a day on Left and Right and by a week on Up and Down', async () => {
      const { root } = picker()
      await settle()

      day(root, '2017-04-13').focus()

      await userEvent.keyboard('{ArrowRight}')
      await settle()

      expect(document.activeElement).toBe(day(root, '2017-04-14'))

      await userEvent.keyboard('{ArrowDown}')
      await settle()

      expect(document.activeElement).toBe(day(root, '2017-04-21'))

      await userEvent.keyboard('{ArrowLeft}')
      await userEvent.keyboard('{ArrowUp}')
      await settle()

      expect(document.activeElement).toBe(day(root, '2017-04-13'))
      expect(day(root, '2017-04-13').tabIndex).toBe(0)
      expect(day(root, '2017-04-21').tabIndex).toBe(-1)
    })

    it('should go to the row start and end on Home and End', async () => {
      const { root } = picker()
      await settle()

      day(root, '2017-04-13').focus()

      await userEvent.keyboard('{Home}')
      await settle()

      expect(document.activeElement).toBe(day(root, '2017-04-09'))

      await userEvent.keyboard('{End}')
      await settle()

      expect(document.activeElement).toBe(day(root, '2017-04-15'))
    })

    it('should go to the first and last day of the month on Ctrl+Home and Ctrl+End', async () => {
      const { root } = picker()
      await settle()

      day(root, '2017-04-13').focus()

      await userEvent.keyboard('{Control>}{Home}{/Control}')
      await settle()

      expect(document.activeElement).toBe(day(root, '2017-04-01'))

      await userEvent.keyboard('{Control>}{End}{/Control}')
      await settle()

      expect(document.activeElement).toBe(day(root, '2017-04-30'))
      expect(day(root, '2017-04-30').tabIndex).toBe(0)
    })

    it('should page into the next month when an arrow leaves the visible one', async () => {
      const { root } = picker({ value: shallowRef('2017-04-30') })
      await settle()

      day(root, '2017-04-30').focus()

      await userEvent.keyboard('{ArrowRight}')
      await settle()
      await settle()

      expect(q(root, '.md1-date-picker__month').textContent).toBe(month('2017-05-01'))
      expect(document.activeElement).toBe(day(root, '2017-05-01'))

      await userEvent.keyboard('{ArrowUp}')
      await settle()
      await settle()

      expect(q(root, '.md1-date-picker__month').textContent).toBe(month('2017-04-01'))
      expect(document.activeElement).toBe(day(root, '2017-04-24'))
    })

    it('should page a month on PageUp and PageDown and a year with Shift, clamping the day', async () => {
      const { root } = picker({ value: shallowRef('2017-01-31') })
      await settle()

      day(root, '2017-01-31').focus()

      await userEvent.keyboard('{PageDown}')
      await settle()
      await settle()

      expect(document.activeElement).toBe(day(root, '2017-02-28'))

      await userEvent.keyboard('{Shift>}{PageUp}{/Shift}')
      await settle()
      await settle()

      expect(q(root, '.md1-date-picker__month').textContent).toBe(month('2016-02-01'))
      expect(document.activeElement).toBe(day(root, '2016-02-28'))
    })

    it('should select the focused day on Enter and on Space', async () => {
      const { root, value } = picker()
      await settle()

      day(root, '2017-04-13').focus()

      await userEvent.keyboard('{ArrowRight}')
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(value.value).toBe('2017-04-14')

      await userEvent.keyboard('{ArrowRight}')
      await userEvent.keyboard(' ')
      await settle()

      expect(value.value).toBe('2017-04-15')
    })

    it('should flip Left and Right under dir="rtl"', async () => {
      const { root } = picker({ dir: 'rtl' })
      await settle()

      day(root, '2017-04-13').focus()

      await userEvent.keyboard('{ArrowLeft}')
      await settle()

      expect(document.activeElement).toBe(day(root, '2017-04-14'))

      day(root, '2017-04-30').focus()
      await userEvent.keyboard('{ArrowLeft}')
      await settle()
      await settle()

      expect(document.activeElement).toBe(day(root, '2017-05-01'))
    })
  })

  describe('navigation', () => {
    it('should name the chevrons and move a month with each', async () => {
      const { root, value } = picker()
      await settle()

      const [prev, next] = root.querySelectorAll<HTMLButtonElement>('.md1-date-picker__step')

      expect(prev!.getAttribute('aria-label')).toBe('Previous month')
      expect(next!.getAttribute('aria-label')).toBe('Next month')
      expect(prev!.type).toBe('button')

      await userEvent.click(next!)
      await settle()

      expect(q(root, '.md1-date-picker__month').textContent).toBe(month('2017-05-01'))
      // Paging moves the focus target, never the selection.
      expect(value.value).toBe('2017-04-13')
      expect(day(root, '2017-05-13').tabIndex).toBe(0)

      await userEvent.click(prev!)
      await userEvent.click(prev!)
      await settle()

      expect(q(root, '.md1-date-picker__month').textContent).toBe(month('2017-03-01'))
    })

    it('should page on a horizontal swipe and ignore a vertical one', async () => {
      const { root } = picker()
      await settle()

      const grid = q(root, '.md1-date-picker__grid')
      const box = rect(grid)
      const y = box.top + box.height / 2

      function swipe (from: number, to: number, dy = 0) {
        grid.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: from, clientY: y, pointerType: 'touch' }))
        grid.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: to, clientY: y + dy, pointerType: 'touch' }))
      }

      swipe(box.right - 20, box.left + 20)
      await settle()

      expect(q(root, '.md1-date-picker__month').textContent).toBe(month('2017-05-01'))

      swipe(box.left + 20, box.right - 20)
      await settle()

      expect(q(root, '.md1-date-picker__month').textContent).toBe(month('2017-04-01'))

      swipe(box.left + 20, box.left + 60, 200)
      swipe(box.left + 20, box.left + 30)
      await settle()

      expect(q(root, '.md1-date-picker__month').textContent).toBe(month('2017-04-01'))
    })
  })

  describe('year view', () => {
    it('should open the year list from the header year, centred on the selected year and focused', async () => {
      const { root } = picker()
      await settle()

      const year = q<HTMLButtonElement>(root, '.md1-date-picker__year')

      expect(year.getAttribute('aria-pressed')).toBe('false')
      expect(year.getAttribute('aria-label')).toBe('Choose year 2017')

      await userEvent.click(year)
      await settle()
      await settle()

      expect(root.dataset.view).toBe('year')
      expect(year.getAttribute('aria-pressed')).toBe('true')
      expect(root.querySelector('table')).toBeNull()

      const list = q(root, '.md1-date-picker__years')
      const selected = q(root, '.md1-date-picker__option[aria-selected="true"]')

      expect(list.getAttribute('role')).toBe('listbox')
      expect(list.getAttribute('aria-label')).toBe('Year')
      expect(selected.getAttribute('role')).toBe('option')
      expect(selected.textContent!.trim()).toBe('2017')
      expect(root.querySelectorAll('[role="option"][aria-selected="true"]').length).toBe(1)
      expect(document.activeElement).toBe(selected)

      const middle = rect(list).top + rect(list).height / 2
      const centre = rect(selected).top + rect(selected).height / 2

      expect(Math.abs(middle - centre)).toBeLessThanOrEqual(1)
      // The header swaps its active segment.
      await expect.poll(() => getComputedStyle(year).opacity).toBe('1')
      await expect.poll(() => getComputedStyle(q(root, '.md1-date-picker__date')).opacity).toBe('0.7')
    })

    it('should set the list in Subheading at a 44 dp pitch, the selected year at 24 sp in the primary colour', async () => {
      const { root } = picker()
      await settle()

      await userEvent.click(q(root, '.md1-date-picker__year'))
      await settle()

      const selected = q(root, '.md1-date-picker__option[data-selected]')
      const other = selected.nextElementSibling as HTMLElement

      expect(rect(other).height).toBe(44)
      expect(getComputedStyle(other).fontSize).toBe('16px')
      expect(getComputedStyle(other).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(rect(selected).height).toBe(56)
      expect(getComputedStyle(selected).fontSize).toBe('24px')
      expect(getComputedStyle(selected).fontWeight).toBe('500')
      expect(getComputedStyle(selected).color).toBe('rgb(63, 81, 181)')
      expect(rect(q(root, '.md1-date-picker__body')).height).toBe(328)
    })

    it('should move the selection to a clicked year, keep the day, and return to the calendar', async () => {
      const { root, value } = picker()
      await settle()

      await userEvent.click(q(root, '.md1-date-picker__year'))
      await settle()

      const target = [...root.querySelectorAll<HTMLElement>('[role="option"]')].find(el => el.textContent!.trim() === '2019')!

      await userEvent.click(target)
      await settle()
      await settle()

      expect(value.value).toBe('2019-04-13')
      expect(root.dataset.view).toBe('date')
      expect(q(root, '.md1-date-picker__month').textContent).toBe(month('2019-04-01'))
      expect(document.activeElement).toBe(day(root, '2019-04-13'))
    })

    it('should clamp February 29 into a year without one', async () => {
      const { root, value } = picker({ value: shallowRef('2016-02-29') })
      await settle()

      await userEvent.click(q(root, '.md1-date-picker__year'))
      await settle()

      await userEvent.keyboard('{ArrowDown}')
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(value.value).toBe('2017-02-28')
    })

    it('should walk the list with the arrow keys and choose with Space', async () => {
      const { root, value } = picker()
      await settle()

      await userEvent.click(q(root, '.md1-date-picker__year'))
      await settle()
      await settle()

      await userEvent.keyboard('{ArrowUp}')
      await userEvent.keyboard('{ArrowUp}')
      await settle()

      expect(document.activeElement!.textContent!.trim()).toBe('2015')
      expect((document.activeElement as HTMLElement).tabIndex).toBe(0)

      await userEvent.keyboard(' ')
      await settle()

      expect(value.value).toBe('2015-04-13')
    })

    it('should return to the calendar from the header year without changing the date', async () => {
      const { root, value } = picker()
      await settle()

      const year = q(root, '.md1-date-picker__year')

      await userEvent.click(year)
      await settle()
      await userEvent.click(year)
      await settle()

      expect(root.dataset.view).toBe('date')
      expect(value.value).toBe('2017-04-13')
    })

    it('should keep the date when nothing is selected and only move the focus', async () => {
      const { root, value } = picker({ value: shallowRef(undefined) })
      await settle()

      await userEvent.click(q(root, '.md1-date-picker__year'))
      await settle()

      const next = q(root, '.md1-date-picker__option[data-selected]').nextElementSibling as HTMLElement

      await userEvent.click(next)
      await settle()

      expect(value.value).toBeUndefined()
      expect(q(root, '.md1-date-picker__year').textContent!.trim()).toBe(String(new Date().getFullYear() + 1))
    })
  })

  describe('hosting', () => {
    function host (variant: string, held: ShallowRef<unknown>, commit: (value: unknown) => void, model: ShallowRef<string | undefined>) {
      const isOpen = shallowRef(true)
      const Host = defineComponent({
        setup (_, { slots }) {
          provide('md1:dialog', {
            variant: shallowRef(variant),
            isOpen,
            value: held,
            commit,
          })
          return () => slots.default?.()
        },
      })

      const el = mount(() => h(Host, null, () => h(Md1DatePicker, {
        'modelValue': model.value,
        'onUpdate:modelValue': (next: string | undefined) => {
          model.value = next
        },
      })))

      return { root: q(el, '.md1-date-picker'), isOpen }
    }

    it('should hold its date in a confirmation dialog: read the held value, commit, never write its own model', async () => {
      const held = shallowRef<unknown>('2017-04-13')
      const model = shallowRef<string | undefined>()
      const commit = vi.fn((value: unknown) => {
        held.value = value
      })
      const { root } = host('confirmation', held, commit, model)
      await settle()

      expect(Object.hasOwn(day(root, '2017-04-13').dataset, 'selected')).toBe(true)
      // The tabbable day takes the dialog's initial focus.
      expect(day(root, '2017-04-13').autofocus).toBe(true)

      await userEvent.click(day(root, '2017-04-21'))
      await settle()

      expect(commit).toHaveBeenCalledTimes(1)
      expect(commit).toHaveBeenCalledWith('2017-04-21')
      expect(model.value).toBeUndefined()
      expect(Object.hasOwn(day(root, '2017-04-21').dataset, 'selected')).toBe(true)
    })

    it('should open on its model\'s month when the held value is not an ISO date', async () => {
      // A field showing a long date: the dialog holds that text, the model is the consumer's ISO reading of it.
      const held = shallowRef<unknown>('Thursday, April 13, 2017')
      const commit = vi.fn((value: unknown) => {
        held.value = value
      })
      const { root } = host('confirmation', held, commit, shallowRef('2017-04-13'))
      await settle()

      expect(q(root, '.md1-date-picker__month').textContent).toContain('2017')
      expect(Object.hasOwn(day(root, '2017-04-13').dataset, 'selected')).toBe(true)

      await userEvent.click(day(root, '2017-04-21'))
      await settle()

      expect(commit).toHaveBeenCalledWith('2017-04-21')
      expect(Object.hasOwn(day(root, '2017-04-21').dataset, 'selected')).toBe(true)
    })

    it('should reopen on the calendar', async () => {
      const held = shallowRef<unknown>('2017-04-13')
      const { root, isOpen } = host('confirmation', held, () => {}, shallowRef())
      await settle()

      await userEvent.click(q(root, '.md1-date-picker__year'))
      await settle()

      expect(root.dataset.view).toBe('year')

      isOpen.value = false
      await settle()
      isOpen.value = true
      await settle()

      expect(root.dataset.view).toBe('date')
    })

    it('should keep its own model under any other dialog variant', async () => {
      const commit = vi.fn()
      const model = shallowRef<string | undefined>('2017-04-13')
      const { root } = host('alert', shallowRef('2000-01-01'), commit, model)
      await settle()

      await userEvent.click(day(root, '2017-04-20'))
      await settle()

      expect(commit).toHaveBeenCalledTimes(0)
      expect(model.value).toBe('2017-04-20')
      expect(day(root, '2017-04-20').autofocus).toBe(false)
    })
  })

  describe('theme', () => {
    it('should take the dark theme: Grey 700 header, the accent 200 circle with dark ink, light body ink', async () => {
      style(new Md1StyleSheetAdapter().generate({
        'md1-light': md1Colors,
        'md1-dark': md1DarkColors,
      }))

      const value = shallowRef<string | undefined>(toIso(new Date()))
      const el = mount(() => h('div', { 'data-theme': 'md1-dark' }, [h(Md1DatePicker, {
        'modelValue': value.value,
        'onUpdate:modelValue': (next: string | undefined) => {
          value.value = next
        },
      })]))
      await settle()

      const root = q(el, '.md1-date-picker')
      const selected = q(root, '.md1-date-picker__day[data-selected]')

      expect(getComputedStyle(root).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(q(root, '.md1-date-picker__header')).backgroundColor).toBe('rgb(97, 97, 97)')
      expect(getComputedStyle(selected).backgroundColor).toBe('rgb(244, 143, 177)')
      expect(getComputedStyle(selected).color).toBe('rgb(0, 0, 0)')
      expect(getComputedStyle(q(root, 'th')).color).toBe('rgba(255, 255, 255, 0.5)')
      expect(getComputedStyle(q(root, '.md1-date-picker__month')).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(q(root, '.md1-date-picker__step')).color).toBe('rgb(255, 255, 255)')

      value.value = undefined
      await settle()

      // Today, unselected, takes the accent 200 as well.
      const today = q(root, '.md1-date-picker__day[data-today]')

      expect(Object.hasOwn(today.dataset, 'selected')).toBe(false)
      await expect.poll(() => getComputedStyle(today).color).toBe('rgb(244, 143, 177)')
    })
  })
})
