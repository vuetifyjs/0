import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createStackPlugin } from '@vuetify/v0'

import {
  QuDataTable,
  QuDataTableBody,
  QuDataTableCell,
  QuDataTableColumn,
  QuDataTableContextual,
  QuDataTableFooter,
  QuDataTableHead,
  QuDataTableHeader,
  QuDataTableRow,
  QuDataTableTable,
} from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { App, Component, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'
// Components
import { QuButton } from '../QuButton'

interface Dessert {
  id: number
  name: string
  calories: number
  comment: string
}

const NAMES = [
  'Frozen yogurt',
  'Ice cream sandwich',
  'Eclair',
  'Cupcake',
  'Gingerbread',
  'Jelly bean',
  'Lollipop',
  'Honeycomb',
  'Donut',
  'KitKat',
  'Brownie',
  'Macaron',
]

const CALORIES = [159, 237, 262, 305, 356, 375, 392, 408, 452, 518, 466, 120]

function desserts (): Dessert[] {
  return NAMES.map((name, index) => ({ id: index + 1, name, calories: CALORIES[index]!, comment: '' }))
}

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  host.style.padding = '24px'
  host.style.width = '900px'
  document.body.append(host)
  const app = createApp({ render: node })
  app.use(createStackPlugin())
  setup?.(app)
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The browser's own serialization of a colour, so assertions never guess at formatting. */
function serialize (value: string): string {
  const probe = document.createElement('div')
  probe.style.backgroundColor = value
  document.body.append(probe)
  const result = getComputedStyle(probe).backgroundColor
  probe.remove()
  return result
}

async function settle () {
  await nextTick()
  await nextTick()
}

interface Options {
  rows?: Dessert[]
  selectable?: boolean
  selected?: { value: Dessert[] }
  perPage?: { value: number }
  locked?: number
  edits?: { value: [number, string][] }
  editable?: 'small' | 'large'
  title?: string
  contextual?: boolean
}

/** The page's own table: a titled card, two sortable columns (one numeric, with a definition), an editable column, the footer. */
function table (options: Options = {}): HTMLElement {
  const rows = options.rows ?? desserts()

  // Props are read inside the render function so a v-model write re-renders the root with the new value.
  function props (): Record<string, unknown> {
    const result: Record<string, unknown> = { selectable: options.selectable ?? false }
    const { selected, perPage } = options

    if (selected) {
      result.selected = selected.value
      result['onUpdate:selected'] = (value: Dessert[]) => {
        selected.value = value
      }
    }

    if (perPage) {
      result.rowsPerPage = perPage.value
      result['onUpdate:rowsPerPage'] = (value: number) => {
        perPage.value = value
      }
    }

    return result
  }

  return mount(() => h(QuDataTable as Component, props(), () => [
    h(QuDataTableHeader, { title: options.title ?? 'Nutrition' }, () => [
      h(QuButton, { icon: 'filter-list', ariaLabel: 'Filter' }),
    ]),
    options.contextual === false
      ? null
      : h(QuDataTableContextual, null, () => [h(QuButton, { icon: 'delete', ariaLabel: 'Delete' })]),
    h(QuDataTableTable, null, () => [
      h(QuDataTableHead, null, () => [
        h(QuDataTableColumn, { id: 'name', sortable: true }, () => 'Dessert'),
        h(QuDataTableColumn, { id: 'calories', numeric: true, sortable: true, tooltip: 'Energy per 100 g serving' }, () => 'Calories'),
        h(QuDataTableColumn, { id: 'comment' }, () => 'Comment'),
      ]),
      h(QuDataTableBody, null, {
        default: ({ rank }: { rank: (source: readonly Dessert[]) => Dessert[] }) => rank(rows).map(row => h(
          QuDataTableRow,
          { id: row.id, key: row.id, value: row, selectable: row.id !== options.locked },
          () => [
            h(QuDataTableCell, null, () => row.name),
            h(QuDataTableCell, { numeric: true }, () => String(row.calories)),
            h(QuDataTableCell, {
              'editable': options.editable ?? 'small',
              'placeholder': 'Add a comment',
              'label': 'Comment',
              'modelValue': row.comment,
              'onUpdate:modelValue': (value?: string) => {
                options.edits?.value.push([row.id, value ?? ''])
              },
            }),
          ],
        )),
      }),
    ]),
    h(QuDataTableFooter),
  ]))
}

function root (host: HTMLElement): HTMLElement {
  return host.querySelector<HTMLElement>('.quantum-data-table')!
}

function body (host: HTMLElement): HTMLTableRowElement[] {
  return [...host.querySelectorAll<HTMLTableRowElement>('tbody tr')]
}

/** The rows the page shows: v0 hides off-page rows with v-show. */
function visible (host: HTMLElement): HTMLTableRowElement[] {
  return body(host).filter(row => row.style.display !== 'none')
}

function names (host: HTMLElement): string[] {
  return visible(host).map(row => row.querySelectorAll('td')[row.querySelector('.quantum-data-table__select') ? 1 : 0]!.textContent!.trim())
}

function columns (host: HTMLElement): HTMLTableCellElement[] {
  return [...host.querySelectorAll<HTMLTableCellElement>('thead th.quantum-data-table__column')]
}

function checkboxes (host: HTMLElement): HTMLButtonElement[] {
  return [...host.querySelectorAll<HTMLButtonElement>('tbody .quantum-data-table__checkbox')]
}

function all (host: HTMLElement): HTMLButtonElement {
  return host.querySelector<HTMLButtonElement>('thead .quantum-data-table__checkbox')!
}

function range (host: HTMLElement): string {
  return host.querySelector('.quantum-data-table__range')!.textContent!.trim()
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  document.documentElement.classList.remove('dialog-open')
  vi.restoreAllMocks()
})

describe('quDataTable', () => {
  describe('anatomy', () => {
    it('should render the card: header, scroll container around the table, footer, in that order', async () => {
      const host = table()
      await settle()

      const el = root(host)
      const children = [...el.children].filter(child => (child as HTMLElement).style.display !== 'none')

      expect(el.tagName).toBe('DIV')
      expect(children.map(child => child.className)).toEqual([
        'quantum-data-table__header',
        'quantum-data-table__scroll',
        'quantum-data-table__footer',
      ])
      expect(el.querySelector('.quantum-data-table__scroll > table.quantum-data-table__table')).not.toBeNull()
      expect(Object.hasOwn(el.dataset, 'contextual')).toBe(false)
      expect(Object.hasOwn(el.dataset, 'selectable')).toBe(false)
    })

    it('should name the table by the header title and expose the native table roles', async () => {
      const host = table()
      await settle()

      const el = host.querySelector('table')!
      const title = host.querySelector('.quantum-data-table__title')!

      expect(el.getAttribute('role')).toBe('table')
      expect(title.id).not.toBe('')
      expect(el.getAttribute('aria-labelledby')).toBe(title.id)
      expect(columns(host).every(th => th.getAttribute('role') === 'columnheader' && th.getAttribute('scope') === 'col')).toBe(true)
      expect(body(host)[0]!.getAttribute('role')).toBe('row')
      expect(body(host)[0]!.querySelector('td')!.getAttribute('role')).toBe('cell')
    })

    it('should rest the card on the surface with 2 dp corners, seamed at 0 dp under a fine pointer', async () => {
      expect(matchMedia('(pointer: fine)').matches).toBe(true)

      const host = table()
      await settle()

      const computed = getComputedStyle(root(host))

      expect(computed.backgroundColor).toBe('rgb(255, 255, 255)')
      expect(computed.borderRadius).toBe('2px')
      expect(computed.boxShadow).toBe('none')

      // The handset value is the rule outside every @media block (QuButton reads the same way).
      const rules = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
      const rule = rules.find((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule && rule.selectorText === '.quantum-data-table')

      expect(rule!.style.boxShadow).toContain('var(--quantum-elevation-2,')
    })

    it('should draw the 64 dp header with the title in Regular 20 sp at the 24 dp keyline', async () => {
      const host = table()
      await settle()

      const header = host.querySelector<HTMLElement>('.quantum-data-table__header')!
      const title = host.querySelector<HTMLElement>('.quantum-data-table__title')!

      expect(header.getBoundingClientRect().height).toBe(64)
      expect(getComputedStyle(header).paddingLeft).toBe('24px')
      expect(getComputedStyle(title).fontSize).toBe('20px')
      expect(getComputedStyle(title).fontWeight).toBe('400')
      expect(getComputedStyle(title).color).toBe('rgba(0, 0, 0, 0.87)')
    })

    it('should end the last header action glyph 14 dp from the card edge, at 54%', async () => {
      const host = table()
      await settle()

      const card = root(host).getBoundingClientRect()
      const action = host.querySelector<HTMLElement>('.quantum-data-table__header .quantum-button')!
      const glyph = action.querySelector('svg')!.getBoundingClientRect()

      expect(card.right - glyph.right).toBe(14)
      expect(glyph.width).toBe(24)
      expect(getComputedStyle(action).color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should keep the accent on labelled flat buttons in the header, the persistent-actions form', async () => {
      const host = mount(() => h(QuDataTable as Component, null, () => [
        h(QuDataTableHeader, null, () => [
          h(QuButton, { disabled: true }, () => 'Add'),
          h(QuButton, null, () => 'Remove'),
        ]),
      ]))
      await settle()

      const [add, remove] = [...host.querySelectorAll<HTMLElement>('.quantum-data-table__header .quantum-button')]

      expect(getComputedStyle(remove!).color).toBe('rgb(255, 64, 129)')
      expect(getComputedStyle(add!).color).toBe('rgba(0, 0, 0, 0.26)')
    })

    it('should draw the 56 dp column header row in Medium 12 sp at 54% and 48 dp data rows in Regular 13 sp at 87%', async () => {
      const host = table()
      await settle()

      const head = host.querySelector('thead tr')!
      const th = columns(host)[0]!
      const row = body(host)[0]!
      const td = row.querySelector('td')!

      expect(head.getBoundingClientRect().height).toBe(56)
      expect(getComputedStyle(th).fontSize).toBe('12px')
      expect(getComputedStyle(th).fontWeight).toBe('500')
      expect(getComputedStyle(th).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(row.getBoundingClientRect().height).toBe(48)
      expect(getComputedStyle(td).fontSize).toBe('13px')
      expect(getComputedStyle(td).fontWeight).toBe('400')
      expect(getComputedStyle(td).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(td).borderTop).toBe('1px solid rgba(0, 0, 0, 0.12)')
    })

    it('should pad 24 dp at the table edges and 56 dp between columns', async () => {
      const host = table()
      await settle()

      const cells = [...body(host)[0]!.querySelectorAll('td')]

      expect(getComputedStyle(cells[0]!).paddingLeft).toBe('24px')
      expect(getComputedStyle(cells[0]!).paddingRight).toBe('28px')
      expect(getComputedStyle(cells[1]!).paddingLeft).toBe('28px')
      expect(getComputedStyle(cells.at(-1)!).paddingRight).toBe('0px')
      // The editable cell hands its padding to the activator, which keeps the keyline.
      expect(getComputedStyle(cells.at(-1)!.querySelector('.quantum-data-table__edit')!).paddingRight).toBe('24px')
    })

    it('should right-align numeric columns and cells and mark them data-numeric', async () => {
      const host = table()
      await settle()

      const th = columns(host)[1]!
      const td = body(host)[0]!.querySelectorAll('td')[1]!

      expect(Object.hasOwn(th.dataset, 'numeric')).toBe(true)
      expect(Object.hasOwn(td.dataset, 'numeric')).toBe(true)
      expect(getComputedStyle(th).textAlign).toBe('end')
      expect(getComputedStyle(td).textAlign).toBe('end')
      expect(Object.hasOwn(columns(host)[0]!.dataset, 'numeric')).toBe(false)
    })

    it('should scroll the table horizontally inside the card when the columns do not fit', async () => {
      const host = mount(() => h('div', { style: 'width: 240px' }, [
        h(QuDataTable as Component, null, () => [
          h(QuDataTableTable, null, () => [
            h(QuDataTableHead, null, () => [
              h(QuDataTableColumn, { id: 'name' }, () => 'Dessert (100 g serving)'),
              h(QuDataTableColumn, { id: 'calories', numeric: true }, () => 'Calories'),
            ]),
          ]),
        ]),
      ]))
      await settle()

      const scroll = host.querySelector<HTMLElement>('.quantum-data-table__scroll')!

      expect(getComputedStyle(scroll).overflowX).toBe('auto')
      expect(scroll.scrollWidth).toBeGreaterThan(scroll.clientWidth)
      expect(root(host).getBoundingClientRect().width).toBe(240)
    })
  })

  describe('sort', () => {
    it('should mark sortable columns aria-sort none and leave other columns without it', async () => {
      const host = table()
      await settle()

      const [name, calories, comment] = columns(host)

      expect(name!.getAttribute('aria-sort')).toBe('none')
      expect(calories!.getAttribute('aria-sort')).toBe('none')
      expect(comment!.hasAttribute('aria-sort')).toBe(false)
      expect(comment!.querySelector('button')).toBeNull()
      expect(Object.hasOwn(name!.dataset, 'direction')).toBe(false)
    })

    it('should sort ascending on the first click and reverse on the second, rotating the arrow', async () => {
      const host = table()
      await settle()

      const th = columns(host)[1]!
      const sort = th.querySelector<HTMLButtonElement>('.quantum-data-table__sort')!
      const arrow = th.querySelector<HTMLElement>('.quantum-data-table__arrow')!

      await userEvent.click(sort)
      await settle()

      expect(th.getAttribute('aria-sort')).toBe('ascending')
      expect(th.dataset.direction).toBe('asc')
      expect(names(host)[0]).toBe('Macaron')
      expect(getComputedStyle(arrow).transform).toBe('none')

      await userEvent.click(sort)
      await settle()

      expect(th.getAttribute('aria-sort')).toBe('descending')
      expect(th.dataset.direction).toBe('desc')
      expect(names(host)[0]).toBe('KitKat')
      await expect.poll(() => getComputedStyle(arrow).transform).toBe('matrix(-1, 0, 0, -1, 0, 0)')
    })

    it('should sort one column at a time', async () => {
      const host = table()
      await settle()

      const [name, calories] = columns(host)

      await userEvent.click(name!.querySelector('button')!)
      await settle()
      await userEvent.click(calories!.querySelector('button')!)
      await settle()

      expect(calories!.getAttribute('aria-sort')).toBe('ascending')
      expect(name!.getAttribute('aria-sort')).toBe('none')
    })

    it('should hide the arrow at rest, show it at 38% on hover and at 87% beside an 87% name once sorted', async () => {
      const host = table()
      await settle()

      const th = columns(host)[0]!
      const arrow = th.querySelector<HTMLElement>('.quantum-data-table__arrow')!
      const glyph = arrow.querySelector('svg')!

      expect(getComputedStyle(arrow).opacity).toBe('0')
      expect(glyph.getBoundingClientRect().width).toBe(16)

      await userEvent.hover(th)

      await expect.poll(() => getComputedStyle(arrow).opacity).toBe('1')
      expect(getComputedStyle(arrow).color).toBe('rgba(0, 0, 0, 0.38)')

      await userEvent.click(th.querySelector('button')!)
      await userEvent.unhover(th)
      await settle()

      expect(getComputedStyle(arrow).opacity).toBe('1')
      expect(getComputedStyle(arrow).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(th).color).toBe('rgba(0, 0, 0, 0.87)')
    })

    it('should put the arrow ahead of the name in a numeric column', async () => {
      const host = table()
      await settle()

      const sort = columns(host)[1]!.querySelector<HTMLElement>('.quantum-data-table__sort')!

      expect(getComputedStyle(sort).flexDirection).toBe('row-reverse')
      expect(sort.querySelector('.quantum-data-table__arrow')!.getBoundingClientRect().right)
        .toBeLessThan(sort.querySelector('.quantum-data-table__label')!.getBoundingClientRect().left)
    })

    it('should sort from the keyboard: the control is a native button with the ripple first', async () => {
      const host = table()
      await settle()

      const th = columns(host)[0]!
      const sort = th.querySelector<HTMLButtonElement>('button')!

      expect(sort.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)

      sort.focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(th.getAttribute('aria-sort')).toBe('ascending')
      expect(names(host)[0]).toBe('Brownie')
    })

    it('should show the column definition in a tooltip on keyboard focus', async () => {
      const host = table()
      await settle()

      const sort = columns(host)[1]!.querySelector<HTMLButtonElement>('button')!
      const tooltip = host.querySelector<HTMLElement>('.quantum-data-table__tooltip')!

      expect(tooltip.textContent!.trim()).toBe('Energy per 100 g serving')

      sort.focus()

      expect(document.activeElement).toBe(sort)
      await expect.poll(() => tooltip.matches(':popover-open')).toBe(true)
    })

    // The activator is renderless, so the anchor-name style has to be bound by
    // hand; unbound, the open tooltip sat at the viewport's top left corner.
    it('should anchor the column tooltip under its column name', async () => {
      const host = table()
      await settle()

      const sort = columns(host)[1]!.querySelector<HTMLButtonElement>('button')!
      const tooltip = host.querySelector<HTMLElement>('.quantum-data-table__tooltip')!

      expect(sort.style.getPropertyValue('anchor-name')).not.toBe('')

      sort.focus()
      await expect.poll(() => tooltip.matches(':popover-open')).toBe(true)

      const anchor = sort.getBoundingClientRect()
      const tile = tooltip.querySelector<HTMLElement>('.quantum-data-table__tile')!.getBoundingClientRect()

      expect(tile.top).toBeGreaterThanOrEqual(anchor.bottom)
      expect(Math.abs((tile.left + tile.right) / 2 - (anchor.left + anchor.right) / 2)).toBeLessThan(1)
    })
  })

  describe('selection', () => {
    it('should render no checkbox column unless selectable', async () => {
      const host = table()
      await settle()

      expect(host.querySelector('.quantum-data-table__select')).toBeNull()
      expect(host.querySelector('.quantum-data-table__checkbox')).toBeNull()
    })

    it('should add a select-all checkbox and one per row, 18 dp boxes in 24 dp containers, 24 dp from the edge and the text', async () => {
      const host = table({ selectable: true })
      await settle()

      const select = host.querySelector<HTMLElement>('tbody .quantum-data-table__select')!
      const box = select.querySelector<HTMLElement>('.quantum-data-table__box')!
      const text = select.nextElementSibling as HTMLElement
      const card = root(host).getBoundingClientRect()

      expect(Object.hasOwn(root(host).dataset, 'selectable')).toBe(true)
      expect(all(host).getAttribute('role')).toBe('checkbox')
      expect(checkboxes(host).length).toBe(12)
      expect(box.getBoundingClientRect().width).toBe(18)
      expect(select.getBoundingClientRect().width).toBe(72)
      expect(select.getBoundingClientRect().left - card.left).toBe(0)
      expect(getComputedStyle(select).paddingLeft).toBe('24px')
      expect(getComputedStyle(text).paddingLeft).toBe('0px')
      expect(getComputedStyle(box).borderColor).toBe('rgba(0, 0, 0, 0.54)')
      expect(checkboxes(host)[0]!.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
    })

    it('should select a row: checked in the secondary colour, data-selected, Grey 100, v-model:selected', async () => {
      const selected = shallowRef<Dessert[]>([])
      const host = table({ selectable: true, selected })
      await settle()

      const row = body(host)[0]!
      const box = checkboxes(host)[0]!

      await userEvent.click(box)
      await settle()

      expect(box.getAttribute('aria-checked')).toBe('true')
      expect(box.dataset.state).toBe('checked')
      expect(Object.hasOwn(row.dataset, 'selected')).toBe(true)
      expect(selected.value.map(item => item.name)).toEqual(['Frozen yogurt'])
      await userEvent.unhover(box)
      await expect.poll(() => getComputedStyle(row).backgroundColor).toBe('rgb(245, 245, 245)')
      expect(getComputedStyle(box.querySelector('.quantum-data-table__box')!).backgroundColor).toBe('rgb(255, 64, 129)')
    })

    it('should paint the hovered row Grey 200', async () => {
      const host = table({ selectable: true })
      await settle()

      const row = body(host)[2]!

      await userEvent.hover(row)

      await expect.poll(() => getComputedStyle(row).backgroundColor).toBe('rgb(238, 238, 238)')
    })

    it('should toggle a row checkbox with Space', async () => {
      const host = table({ selectable: true })
      await settle()

      const box = checkboxes(host)[1]!

      box.focus()
      await userEvent.keyboard(' ')
      await settle()

      expect(box.getAttribute('aria-checked')).toBe('true')

      await userEvent.keyboard(' ')
      await settle()

      expect(box.getAttribute('aria-checked')).toBe('false')
    })

    it('should go mixed with some rows selected and select the whole page, not the off-page rows', async () => {
      const selected = shallowRef<Dessert[]>([])
      const host = table({ selectable: true, selected })
      await settle()

      await userEvent.click(checkboxes(host)[0]!)
      await settle()

      expect(all(host).getAttribute('aria-checked')).toBe('mixed')

      await userEvent.click(all(host))
      await settle()

      expect(all(host).getAttribute('aria-checked')).toBe('true')
      expect(selected.value.length).toBe(10)
      expect(selected.value.some(item => item.name === 'Macaron')).toBe(false)

      await userEvent.click(all(host))
      await settle()

      expect(all(host).getAttribute('aria-checked')).toBe('false')
      expect(selected.value).toEqual([])
    })

    it('should apply an initial v-model:selected and follow later writes', async () => {
      const rows = desserts()
      const selected = shallowRef<Dessert[]>([rows[2]!])
      const host = table({ rows, selectable: true, selected })
      await settle()

      expect(checkboxes(host)[2]!.getAttribute('aria-checked')).toBe('true')
      expect(all(host).getAttribute('aria-checked')).toBe('mixed')
    })

    it('should leave a row with selectable false out of the checkboxes and out of select-all', async () => {
      const selected = shallowRef<Dessert[]>([])
      const host = table({ selectable: true, selected, locked: 1 })
      await settle()

      const first = body(host)[0]!

      expect(first.querySelector('.quantum-data-table__select')).not.toBeNull()
      expect(first.querySelector('.quantum-data-table__checkbox')).toBeNull()

      await userEvent.click(all(host))
      await settle()

      expect(selected.value.length).toBe(9)
      expect(selected.value.some(item => item.id === 1)).toBe(false)
      expect(all(host).getAttribute('aria-checked')).toBe('true')
    })

    it('should draw no press reaction under a mouse and the measured focus halo from the keyboard', async () => {
      const host = table({ selectable: true })
      await settle()

      const box = checkboxes(host)[0]!

      expect(getComputedStyle(box.querySelector('.quantum-ripple')!).opacity).toBe('0')

      box.focus()
      await userEvent.keyboard(' ')
      await settle()

      expect(box.getAttribute('aria-checked')).toBe('true')
      await expect.poll(() => getComputedStyle(box).backgroundColor)
        .toBe(serialize('color-mix(in srgb, #FF4081 10%, transparent)'))
    })

    it('should name every checkbox', async () => {
      const host = table({ selectable: true })
      await settle()

      expect(all(host).getAttribute('aria-label')).toBe('Select all')
      expect(checkboxes(host).every(box => box.getAttribute('aria-label') === 'Select row')).toBe(true)
    })
  })

  describe('contextual header', () => {
    it('should replace the header while rows are selected: the count on the accent A100 fill', async () => {
      const host = table({ selectable: true })
      await settle()

      const header = host.querySelector<HTMLElement>('.quantum-data-table__header')!

      expect(host.querySelector('.quantum-data-table__contextual')).toBeNull()

      await userEvent.click(checkboxes(host)[0]!)
      await userEvent.click(checkboxes(host)[1]!)
      await settle()

      const contextual = host.querySelector<HTMLElement>('.quantum-data-table__contextual')!

      expect(contextual).not.toBeNull()
      expect(Object.hasOwn(root(host).dataset, 'contextual')).toBe(true)
      expect(header.style.display).toBe('none')
      expect(contextual.getAttribute('role')).toBe('toolbar')
      expect(contextual.getAttribute('aria-label')).toBe('2 items selected')
      expect(contextual.querySelector('.quantum-data-table__count')!.textContent!.trim()).toBe('2 items selected')
      expect(contextual.getBoundingClientRect().height).toBe(64)
      expect(getComputedStyle(contextual).backgroundColor).toBe('rgb(255, 128, 171)')
      // The table keeps its name while the title is hidden.
      expect(host.querySelector('table')!.getAttribute('aria-labelledby')).toBe(host.querySelector('.quantum-data-table__title')!.id)
    })

    it('should clear the selection on Escape inside the contextual header', async () => {
      const selected = shallowRef<Dessert[]>([])
      const host = table({ selectable: true, selected })
      await settle()

      await userEvent.click(checkboxes(host)[0]!)
      await settle()

      host.querySelector<HTMLButtonElement>('.quantum-data-table__contextual .quantum-button')!.focus()
      await userEvent.keyboard('{Escape}')
      await settle()

      expect(selected.value).toEqual([])
      expect(host.querySelector('.quantum-data-table__contextual')).toBeNull()
      expect(host.querySelector<HTMLElement>('.quantum-data-table__header')!.style.display).toBe('')
    })

    it('should read "1 item selected" for one row and stay hidden without a selection even with a count', async () => {
      const record = { id: 1 }
      const host = mount(() => h(QuDataTable as Component, { selectable: true }, () => [
        h(QuDataTableHeader, { title: 'Nutrition' }),
        h(QuDataTableContextual, { count: 3 }),
        h(QuDataTableTable, null, () => [
          h(QuDataTableBody, null, () => [
            h(QuDataTableRow, { id: 1, value: record }, () => [h(QuDataTableCell, null, () => 'Eclair')]),
          ]),
        ]),
      ]))
      await settle()

      expect(host.querySelector('.quantum-data-table__contextual')).toBeNull()
      expect(host.querySelector<HTMLElement>('.quantum-data-table__header')!.style.display).toBe('')

      await userEvent.click(host.querySelector('tbody .quantum-data-table__checkbox')!)
      await settle()

      expect(host.querySelector('.quantum-data-table__contextual')!.getAttribute('aria-label')).toBe('3 items selected')
      expect(host.querySelector<HTMLElement>('.quantum-data-table__header')!.style.display).toBe('none')
    })

    it('should keep the header when no contextual part is mounted', async () => {
      const host = table({ selectable: true, contextual: false })
      await settle()

      await userEvent.click(checkboxes(host)[0]!)
      await settle()

      expect(Object.hasOwn(root(host).dataset, 'contextual')).toBe(false)
      expect(host.querySelector<HTMLElement>('.quantum-data-table__header')!.style.display).toBe('')
    })
  })

  describe('footer', () => {
    it('should draw the 56 dp footer in Caption 12 sp at 54% with the range text and the first page', async () => {
      const host = table()
      await settle()

      const footer = host.querySelector<HTMLElement>('.quantum-data-table__footer')!

      expect(footer.getBoundingClientRect().height).toBe(56)
      expect(getComputedStyle(footer).fontSize).toBe('12px')
      expect(getComputedStyle(footer).color).toBe('rgba(0, 0, 0, 0.54)')
      expect(getComputedStyle(footer).borderTop).toBe('1px solid rgba(0, 0, 0, 0.12)')
      expect(footer.querySelector('.quantum-data-table__rows-label')!.textContent!.trim()).toBe('Rows per page:')
      expect(range(host)).toBe('1-10 of 12')
      expect(host.querySelector('.quantum-data-table__range')!.getAttribute('aria-live')).toBe('polite')
      expect(visible(host).length).toBe(10)
    })

    it('should space the footer: 40 dp label to value, 32 dp to the range, 32 dp to previous, 24 dp between glyphs, 14 dp to the edge', async () => {
      const host = table()
      await settle()

      const card = root(host).getBoundingClientRect()
      const label = host.querySelector('.quantum-data-table__rows-label')!.getBoundingClientRect()
      const rows = host.querySelector('.quantum-data-table__rows')!.getBoundingClientRect()
      const text = host.querySelector('.quantum-data-table__range')!.getBoundingClientRect()
      const [previous, next] = [...host.querySelectorAll('.quantum-data-table__pager svg')].map(svg => svg.getBoundingClientRect())

      expect(rows.left - label.right).toBe(40)
      expect(text.left - rows.right).toBe(32)
      expect(previous!.left - text.right).toBe(32)
      expect(next!.left - previous!.right).toBe(24)
      expect(card.right - next!.right).toBe(14)
    })

    it('should page with previous and next, disabling each at its end', async () => {
      const host = table()
      await settle()

      const [previous, next] = [...host.querySelectorAll<HTMLButtonElement>('.quantum-data-table__pager button')]

      expect(previous!.getAttribute('aria-label')).toBe('Previous page')
      expect(next!.getAttribute('aria-label')).toBe('Next page')
      expect(previous!.disabled).toBe(true)
      expect(next!.disabled).toBe(false)

      await userEvent.click(next!)
      await settle()

      expect(range(host)).toBe('11-12 of 12')
      expect(names(host)).toEqual(['Brownie', 'Macaron'])
      expect(next!.disabled).toBe(true)
      expect(previous!.disabled).toBe(false)

      await userEvent.click(previous!)
      await settle()

      expect(range(host)).toBe('1-10 of 12')
    })

    it('should change rows per page through the selector and write v-model:rows-per-page', async () => {
      const perPage = shallowRef(10)
      const host = table({ perPage })
      await settle()

      const activator = host.querySelector<HTMLElement>('.quantum-data-table__rows')!
      const menu = document.querySelector<HTMLElement>('.quantum-data-table__menu')!

      expect(activator.textContent).toContain('10')
      expect(activator.getAttribute('aria-labelledby')).toContain(host.querySelector('.quantum-data-table__rows-label')!.id)

      await userEvent.click(activator)

      await expect.poll(() => menu.matches(':popover-open')).toBe(true)

      const option = [...menu.querySelectorAll<HTMLElement>('.quantum-data-table__option')].find(el => el.textContent!.trim() === '5')!

      await userEvent.click(option)
      await settle()

      expect(perPage.value).toBe(5)
      expect(range(host)).toBe('1-5 of 12')
      expect(visible(host).length).toBe(5)
    })

    it('should follow a rows-per-page model written from outside', async () => {
      const perPage = shallowRef(5)
      const host = table({ perPage })
      await settle()

      expect(range(host)).toBe('1-5 of 12')
      expect(visible(host).length).toBe(5)
    })

    it('should read "0-0 of 0" for an empty table', async () => {
      const host = table({ rows: [] })
      await settle()

      expect(range(host)).toBe('0-0 of 0')
    })
  })

  describe('editable cells', () => {
    it('should denote an empty editable cell by its placeholder at 38% and mark data-editable', async () => {
      const host = table()
      await settle()

      const cell = body(host)[0]!.querySelectorAll('td')[2]!
      const placeholder = cell.querySelector<HTMLElement>('.quantum-data-table__placeholder')!

      expect(cell.dataset.editable).toBe('small')
      expect(placeholder.textContent!.trim()).toBe('Add a comment')
      expect(getComputedStyle(placeholder).color).toBe('rgba(0, 0, 0, 0.38)')
      expect(cell.querySelector('.quantum-data-table__edit')!.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
    })

    it('should open the small edit sheet over the cell, focus its field and save on Enter', async () => {
      const edits = shallowRef<[number, string][]>([])
      const host = table({ edits })
      await settle()

      const cell = body(host)[0]!.querySelectorAll('td')[2]!
      const sheet = cell.querySelector<HTMLElement>('.quantum-data-table__sheet')!

      await userEvent.click(cell.querySelector('.quantum-data-table__edit')!)

      await expect.poll(() => sheet.matches(':popover-open')).toBe(true)
      await expect.poll(() => document.activeElement === sheet.querySelector('input')).toBe(true)
      expect(Object.hasOwn(cell.dataset, 'editing')).toBe(true)
      expect(sheet.getBoundingClientRect().width).toBe(cell.getBoundingClientRect().width)
      expect(getComputedStyle(sheet).paddingLeft).toBe('24px')

      await userEvent.keyboard('Too sweet')
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(edits.value).toEqual([[1, 'Too sweet']])
      await expect.poll(() => sheet.matches(':popover-open')).toBe(false)
    })

    it('should revert on Escape and emit nothing', async () => {
      const edits = shallowRef<[number, string][]>([])
      const host = table({ edits })
      await settle()

      const cell = body(host)[0]!.querySelectorAll('td')[2]!
      const sheet = cell.querySelector<HTMLElement>('.quantum-data-table__sheet')!

      await userEvent.click(cell.querySelector('.quantum-data-table__edit')!)
      await expect.poll(() => document.activeElement === sheet.querySelector('input')).toBe(true)

      await userEvent.keyboard('Nope')
      await userEvent.keyboard('{Escape}')
      await settle()

      await expect.poll(() => sheet.matches(':popover-open')).toBe(false)
      expect(edits.value).toEqual([])
    })

    it('should open the large edit dialog and save only through Save', async () => {
      const edits = shallowRef<[number, string][]>([])
      const host = table({ edits, editable: 'large' })
      await settle()

      const cell = body(host)[0]!.querySelectorAll('td')[2]!
      const dialog = cell.querySelector<HTMLDialogElement>('dialog')!

      expect(cell.dataset.editable).toBe('large')

      await userEvent.click(cell.querySelector('.quantum-data-table__edit')!)

      await expect.poll(() => dialog.open).toBe(true)
      expect(dialog.querySelector('.quantum-data-table__dialog-title')!.textContent!.trim()).toBe('Comment')

      const [cancel, save] = [...dialog.querySelectorAll<HTMLButtonElement>('.quantum-data-table__dialog-actions button')]

      expect(cancel!.textContent!.trim()).toBe('Cancel')
      expect(save!.textContent!.trim()).toBe('Save')

      await userEvent.keyboard('Draft')
      await userEvent.click(cancel!)
      await settle()

      await expect.poll(() => dialog.open).toBe(false)
      expect(edits.value).toEqual([])

      await userEvent.click(cell.querySelector('.quantum-data-table__edit')!)
      await expect.poll(() => dialog.open).toBe(true)
      await expect.poll(() => document.activeElement === dialog.querySelector('input')).toBe(true)

      await userEvent.keyboard('Rich')
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(dialog.open).toBe(true)
      expect(edits.value).toEqual([])

      await userEvent.click(save!)
      await settle()

      expect(edits.value).toEqual([[1, 'Rich']])
      await expect.poll(() => dialog.open).toBe(false)

      await userEvent.click(cell.querySelector('.quantum-data-table__edit')!)
      await expect.poll(() => document.activeElement === dialog.querySelector('input')).toBe(true)

      await userEvent.keyboard('Gone')
      await userEvent.keyboard('{Escape}')
      await settle()

      await expect.poll(() => dialog.open).toBe(false)
      expect(edits.value).toEqual([[1, 'Rich']])
    })

    it('should draw the field line at 42% and 2 dp in the accent on focus', async () => {
      const host = table()
      await settle()

      const cell = body(host)[0]!.querySelectorAll('td')[2]!
      const input = cell.querySelector<HTMLInputElement>('.quantum-data-table__sheet input')!

      // The line is the 6% hover overlay times seven; the overlay's 8-bit alpha lands it within a percent of 42%.
      const line = getComputedStyle(input).boxShadow
      const alpha = Number(/\/ ([\d.]+)\)/.exec(line)?.[1])

      expect(line).toMatch(/^color\(srgb 0 0 0 \/ [\d.]+\) 0px -1px 0px 0px inset$/)
      expect(alpha).toBeCloseTo(0.42, 1)

      await userEvent.click(cell.querySelector('.quantum-data-table__edit')!)
      await expect.poll(() => document.activeElement === input).toBe(true)

      await expect.poll(() => getComputedStyle(input).boxShadow).toBe('rgb(255, 64, 129) 0px -2px 0px 0px inset')
    })

    it('should refuse to save past the counter limit', async () => {
      const edits = shallowRef<string[]>([])
      // Row records must keep their identity across renders: v0 upserts the row whenever the value changes.
      const record = { id: 1 }
      const host = mount(() => h(QuDataTable as Component, null, () => [
        h(QuDataTableTable, null, () => [
          h(QuDataTableBody, null, () => [
            h(QuDataTableRow, { id: 1, value: record }, () => [
              h(QuDataTableCell, {
                'editable': 'small',
                'counter': 3,
                'modelValue': '',
                'onUpdate:modelValue': (value?: string) => edits.value.push(value ?? ''),
              }),
            ]),
          ]),
        ]),
      ]))
      await settle()

      await userEvent.click(host.querySelector('.quantum-data-table__edit')!)
      await expect.poll(() => document.activeElement?.tagName).toBe('INPUT')

      await userEvent.keyboard('Long')
      await settle()

      const counter = host.querySelector<HTMLElement>('.quantum-data-table__counter')!

      expect(counter.textContent!.trim()).toBe('4/3')
      expect(Object.hasOwn(counter.dataset, 'over')).toBe(true)
      expect(getComputedStyle(counter).color).toBe('rgb(255, 23, 68)')

      await userEvent.keyboard('{Enter}')
      await settle()

      expect(edits.value).toEqual([])
    })

    it('should render a plain cell with no activator', async () => {
      const host = table()
      await settle()

      const cell = body(host)[0]!.querySelector('td')!

      expect(Object.hasOwn(cell.dataset, 'editable')).toBe(false)
      expect(cell.querySelector('button')).toBeNull()
    })
  })

  describe('orphans', () => {
    it.each([
      ['QuDataTableHeader', QuDataTableHeader],
      ['QuDataTableContextual', QuDataTableContextual],
      ['QuDataTableFooter', QuDataTableFooter],
    ] as const)('should warn once when %s renders outside QuDataTable', async (name, part) => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      mount(() => h(part as Component))
      await settle()

      expect(spy).toHaveBeenCalledTimes(1)
      expect(spy).toHaveBeenCalledWith(expect.stringContaining(name))
    })

    it('should not warn when every part sits inside the root', async () => {
      using spy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      table({ selectable: true })
      await settle()

      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('should attach every part to the root and keep the flat names', () => {
      expect(QuDataTable.Header).toBe(QuDataTableHeader)
      expect(QuDataTable.Contextual).toBe(QuDataTableContextual)
      expect(QuDataTable.Table).toBe(QuDataTableTable)
      expect(QuDataTable.Head).toBe(QuDataTableHead)
      expect(QuDataTable.Column).toBe(QuDataTableColumn)
      expect(QuDataTable.Body).toBe(QuDataTableBody)
      expect(QuDataTable.Row).toBe(QuDataTableRow)
      expect(QuDataTable.Cell).toBe(QuDataTableCell)
      expect(QuDataTable.Footer).toBe(QuDataTableFooter)
    })
  })

  describe('theme', () => {
    it('should flip the sheet, ink and selected row in the dark theme', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const record = { id: 1, name: 'Eclair' }
      const host = mount(() => h('div', { 'data-theme': 'quantum-dark' }, [
        h(QuDataTable as Component, { selectable: true, selected: [] }, () => [
          h(QuDataTableTable, null, () => [
            h(QuDataTableHead, null, () => [h(QuDataTableColumn, { id: 'name' }, () => 'Dessert')]),
            h(QuDataTableBody, null, () => [
              h(QuDataTableRow, { id: 1, value: record }, () => [h(QuDataTableCell, null, () => 'Eclair')]),
            ]),
          ]),
        ]),
      ]))
      await settle()

      const row = host.querySelector<HTMLElement>('tbody tr')!

      expect(getComputedStyle(root(host)).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(host.querySelector('td + td, td:last-child')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(host.querySelector('th:last-child')!).color).toBe('rgba(255, 255, 255, 0.7)')

      await userEvent.click(host.querySelector('tbody .quantum-data-table__checkbox')!)
      await userEvent.unhover(row)
      await settle()

      await expect.poll(() => getComputedStyle(row).backgroundColor)
        .toBe(serialize('color-mix(in srgb, #616161 50%, #424242)'))
    })
  })
})
