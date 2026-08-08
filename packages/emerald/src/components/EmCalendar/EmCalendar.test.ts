import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Context
import EmCalendar from './EmCalendar.vue'
import EmCalendarGrid from './EmCalendarGrid.vue'
import EmCalendarTitle from './EmCalendarTitle.vue'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { App } from 'vue'

/** 2026-08-04 — a Tuesday; August 2026 spills to six rows naturally. */
const TODAY = new Date(2026, 7, 4)

const apps: App[] = []

function mount (props: Record<string, unknown> = {}) {
  const host = document.createElement('div')

  document.body.append(host)

  const app = createApp({
    render: () => h(EmCalendar, props, () => [h(EmCalendarTitle), h(EmCalendarGrid)]),
  })

  apps.push(app)
  app.mount(host)

  return host
}

function cells (host: HTMLElement) {
  return [...host.querySelectorAll<HTMLElement>('.emerald-calendar__cell')]
}

function at (host: HTMLElement, iso: string) {
  return host.querySelector<HTMLElement>(`[data-iso="${iso}"]`)!
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(TODAY)
})

afterEach(() => {
  for (const app of apps.splice(0)) app.unmount()

  document.body.innerHTML = ''
  vi.useRealTimers()
})

describe('emCalendar', () => {
  describe('structure', () => {
    it('should render the 42-cell matrix the DS card is sized for', () => {
      const host = mount()

      expect(cells(host)).toHaveLength(42)
      expect(host.querySelectorAll('.emerald-calendar__week')).toHaveLength(6)
      expect(host.querySelectorAll('[role="columnheader"]')).toHaveLength(7)
      expect(host.querySelector('.emerald-calendar')).not.toBeNull()
      expect(host.querySelector('[role="grid"]')).not.toBeNull()
    })

    it('should mark the spill and today', () => {
      const host = mount()

      expect(at(host, '2026-07-26').dataset.out).toBe('true')
      expect(at(host, '2026-08-04').dataset.out).toBeUndefined()
      expect(at(host, '2026-08-04').getAttribute('aria-current')).toBe('date')
    })

    it('should name the grid after the title', () => {
      const host = mount()

      const title = host.querySelector('.emerald-calendar__title')!
      const grid = host.querySelector('[role="grid"]')!

      expect(grid.getAttribute('aria-labelledby')).toBe(title.id)
      expect(title.getAttribute('aria-live')).toBe('polite')
      expect(title.textContent).toBe('August 2026')
    })
  })

  describe('selection', () => {
    it('should paint the bound day', () => {
      const host = mount({ modelValue: '2026-08-11' })

      expect(at(host, '2026-08-11').dataset.selected).toBe('true')
      expect(at(host, '2026-08-11').getAttribute('aria-selected')).toBe('true')
      expect(cells(host).filter(cell => cell.dataset.selected)).toHaveLength(1)
    })

    it('should select nothing until asked', () => {
      const host = mount()

      expect(cells(host).some(cell => cell.dataset.selected)).toBe(false)
    })

    it('should write the model back on click', async () => {
      const selected = shallowRef<string | undefined>()
      const host = mount({
        get 'modelValue' () {
          return selected.value
        },
        'onUpdate:modelValue': (value: string) => {
          selected.value = value
        },
      })

      at(host, '2026-08-11').click()
      await nextTick()

      expect(selected.value).toBe('2026-08-11')
      expect(at(host, '2026-08-11').dataset.selected).toBe('true')
    })

    it('should clear the paint when the model is cleared', async () => {
      const selected = shallowRef<string | undefined>('2026-08-11')
      const host = mount({
        get modelValue () {
          return selected.value
        },
      })

      expect(at(host, '2026-08-11').dataset.selected).toBe('true')

      selected.value = undefined
      await nextTick()

      expect(cells(host).some(cell => cell.dataset.selected)).toBe(false)
    })

    it('should ignore clicks while disabled', async () => {
      const selected = shallowRef<string | undefined>()
      const host = mount({
        'disabled': true,
        'onUpdate:modelValue': (value: string) => {
          selected.value = value
        },
      })

      at(host, '2026-08-11').click()
      await nextTick()

      expect(selected.value).toBeUndefined()
    })
  })

  describe('roving tabindex', () => {
    it('should give exactly one in-month cell the tab stop', () => {
      const host = mount({ modelValue: '2026-08-11' })

      const stops = cells(host).filter(cell => cell.tabIndex === 0)

      expect(stops).toHaveLength(1)
      expect(stops[0].dataset.out).toBeUndefined()
    })

    it('should park the tab stop on a visible selected day', () => {
      const host = mount({ modelValue: '2026-08-11' })

      expect(at(host, '2026-08-11').tabIndex).toBe(0)
      expect(at(host, '2026-08-04').tabIndex).toBe(-1)
    })

    it('should fall back to today when the selection is off-month', () => {
      const host = mount({ modelValue: '2027-03-11' })

      expect(at(host, '2026-08-04').tabIndex).toBe(0)
    })

    it('should let the roving cursor outrank the selection once it moves', async () => {
      const host = mount({ modelValue: '2026-08-11' })

      at(host, '2026-08-11').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
      )
      await nextTick()

      expect(at(host, '2026-08-18').tabIndex).toBe(0)
      expect(at(host, '2026-08-11').tabIndex).toBe(-1)

      // Paging away and back is governed by the entry rule — the day of month
      // carries across — not by re-seeding from the selection.
      at(host, '2026-08-18').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }),
      )
      await nextTick()

      expect(at(host, '2026-09-18').tabIndex).toBe(0)

      at(host, '2026-09-18').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }),
      )
      await nextTick()

      expect(at(host, '2026-08-18').tabIndex).toBe(0)
      expect(at(host, '2026-08-11').tabIndex).toBe(-1)
    })

    it('should follow the keyboard rather than a stale local copy', async () => {
      const host = mount()

      at(host, '2026-08-04').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
      )
      await nextTick()

      expect(at(host, '2026-08-11').tabIndex).toBe(0)
      expect(at(host, '2026-08-04').tabIndex).toBe(-1)
      expect(cells(host).filter(cell => cell.tabIndex === 0)).toHaveLength(1)
    })
  })

  describe('navigation', () => {
    it('should page the month model without touching the selection', async () => {
      const month = shallowRef(TODAY)
      const selected = shallowRef<string | undefined>('2026-08-11')
      const host = mount({
        get 'modelValue' () {
          return selected.value
        },
        get 'month' () {
          return month.value
        },
        'onUpdate:month': (value: Date) => {
          month.value = value
        },
      })

      at(host, '2026-08-11').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }),
      )
      await nextTick()

      expect(host.querySelector('.emerald-calendar__title')!.textContent).toBe('September 2026')
      expect(month.value.getFullYear()).toBe(2026)
      expect(month.value.getMonth()).toBe(8)
      expect(month.value.getDate()).toBe(1)
      expect(selected.value).toBe('2026-08-11')
    })

    it('should jump a whole year on Shift+PageDown', async () => {
      const host = mount()

      at(host, '2026-08-11').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'PageDown', shiftKey: true, bubbles: true }),
      )
      await nextTick()

      expect(host.querySelector('.emerald-calendar__title')!.textContent).toBe('August 2027')
    })

    it('should carry focus across an external month write', async () => {
      const month = shallowRef(TODAY)
      const host = mount({
        get month () {
          return month.value
        },
      })

      at(host, '2026-08-22').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }),
      )
      await nextTick()

      expect(at(host, '2026-08-29').tabIndex).toBe(0)

      // The page moves the cursor itself — focus must follow into the new grid
      // rather than pointing at a day that is no longer rendered.
      month.value = new Date(2026, 10, 1)
      await nextTick()

      expect(host.querySelector('.emerald-calendar__title')!.textContent).toBe('November 2026')
      expect(at(host, '2026-11-29').tabIndex).toBe(0)
      expect(cells(host).filter(cell => cell.tabIndex === 0)).toHaveLength(1)
    })

    it('should page when an arrow walks off the month edge', async () => {
      const host = mount()

      at(host, '2026-08-31').dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
      )
      await nextTick()

      expect(host.querySelector('.emerald-calendar__title')!.textContent).toBe('September 2026')
    })
  })

  describe('events', () => {
    it('should chip events and roll the rest into the overflow row', () => {
      const host = mount({
        events: [
          { date: '2026-08-11', title: 'One', time: '09:00' },
          { date: '2026-08-11', title: 'Two', allDay: true, tone: 'primary' },
          { date: '2026-08-11', title: 'Three' },
        ],
      })

      const cell = at(host, '2026-08-11')

      expect(cell.querySelectorAll('.emerald-calendar__event')).toHaveLength(2)
      expect(cell.querySelector('.emerald-calendar__more')!.textContent).toBe('+1 more')
      expect(cell.getAttribute('aria-label')).toContain('3 events')
      expect(cell.querySelector('[data-tone="primary"]')).not.toBeNull()
      expect(cell.querySelector('[data-allday]')).not.toBeNull()
    })
  })
})
