/**
 * Proof of concept: Bulma 1.0.4 and Bootstrap 6 markup → Vue components.
 *
 * Rewrites the nodes a component owns (open state, part structure, the
 * Bootstrap data-api). Every other element passes through. Bootstrap 5
 * class names are refused.
 */

// Utilities
import { isElement, isNull, isNullOrUndefined } from '#v0/utilities'

export const BULMA_CSS = 'https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css'

export const BOOTSTRAP_CSS = 'https://cdn.jsdelivr.net/gh/twbs/bootstrap@f6cc0f2cde9cbf3d73759ada24a39555d2de3a12/dist/css/bootstrap.min.css'

const COLORS = ['primary', 'link', 'info', 'success', 'warning', 'danger'] as const

const PLACEMENTS = [
  'bottom-start',
  'bottom',
  'bottom-end',
  'top-start',
  'top',
  'top-end',
  'left-start',
  'left',
  'left-end',
  'right-start',
  'right',
  'right-end',
] as const

const DATA_API = new Set([
  'data-bs-toggle',
  'data-bs-dismiss',
  'data-bs-target',
  'data-bs-title',
  'data-bs-placement',
  'data-bs-trigger',
  'data-bs-ride',
])

const TRIGGER_ARIA = new Set(['aria-haspopup', 'aria-controls', 'aria-expanded'])

const VOID = new Set(['area', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])

type Color = typeof COLORS[number]

type Placement = typeof PLACEMENTS[number]

export type System = 'bulma' | 'bootstrap' | 'none'

export interface IrAttr {
  name: string
  value: string
}

export interface TextNode {
  kind: 'text'
  text: string
}

export interface ElementNode {
  kind: 'element'
  tag: string
  attrs: IrAttr[]
  children: IrNode[]
  /** The node carried `data-bs-dismiss`. The printer turns it into a model close. */
  dismiss?: boolean
}

export interface BulmaModalNode {
  kind: 'bulma-modal'
  id: string
  open: boolean
  variant: 'card' | 'content'
  title: string
  close: boolean
  closeSize?: 'small' | 'normal' | 'medium' | 'large'
  dismiss: boolean
  body: IrNode[]
  foot: IrNode[]
  content: IrNode[]
}

export interface BulmaDropdownNode {
  kind: 'bulma-dropdown'
  id: string
  open: boolean
  hoverable: boolean
  right: boolean
  up: boolean
  menu: boolean
  trigger: IrNode[]
  items: IrNode[]
}

export interface BulmaNotificationNode {
  kind: 'bulma-notification'
  id: string
  open: boolean
  color?: Color
  light: boolean
  dismiss: boolean
  children: IrNode[]
}

export interface BootstrapDialogNode {
  kind: 'bootstrap-dialog'
  id: string
  open: boolean
  size?: 'sm' | 'lg' | 'xl'
  blocking: boolean
  title: string
  body: IrNode[]
  footer: IrNode[]
}

export interface MenuEntry {
  kind: 'item' | 'header' | 'divider' | 'submenu'
  text?: string
  href?: string
  entries?: MenuEntry[]
}

export interface BootstrapMenuNode {
  kind: 'bootstrap-menu'
  id: string
  open: boolean
  label: string
  placement?: Placement
  entries: MenuEntry[]
}

export interface BootstrapCollapseNode {
  kind: 'bootstrap-collapse'
  id: string
  open: boolean
  horizontal: boolean
  trigger: IrNode[]
  children: IrNode[]
}

export interface BootstrapTooltipNode {
  kind: 'bootstrap-tooltip'
  id: string
  open: boolean
  text: string
  placement?: Placement
  trigger: IrNode
}

export type IrNode =
  | TextNode
  | ElementNode
  | BulmaModalNode
  | BulmaDropdownNode
  | BulmaNotificationNode
  | BootstrapDialogNode
  | BootstrapMenuNode
  | BootstrapCollapseNode
  | BootstrapTooltipNode

export interface ModelBinding {
  id: string
  open: boolean
}

export interface ConvertResult {
  system: System
  vue: string
  notes: string[]
  refused: string | null
  tree: IrNode[]
}

interface Ctx {
  id: (base: string) => string
  notes: Set<string>
}

export function cssFor (system: System): string | null {
  if (system === 'bulma') return BULMA_CSS
  if (system === 'bootstrap') return BOOTSTRAP_CSS
  return null
}

export function convert (html: string): ConvertResult {
  const source = html.trim()
  if (source === '') {
    return empty('Paste Bulma 1.0.4 or Bootstrap 6 markup.')
  }
  if (/new\s+bootstrap\s*\./.test(source) || /bootstrap(?:\.bundle)?(?:\.min)?\.js/.test(source)) {
    return refuse('Imperative `bootstrap.js` is refused. Paste the markup.')
  }

  const doc = new DOMParser().parseFromString(`<div id="convert-root">${source}</div>`, 'text/html')
  const root = doc.querySelector('#convert-root')
  if (isNull(root)) return refuse('The markup could not be parsed.')

  const v5 = v5Reason(root)
  if (!isNull(v5)) return refuse(v5)

  const ctx: Ctx = { id: ids(), notes: new Set() }
  const tree = walkList([...root.childNodes], ctx)
  const system = systemOf(tree)
  if (system === 'mixed') {
    return refuse('Paste one system at a time. This snippet mixes Bulma and Bootstrap roots.')
  }
  if (system === 'none') ctx.notes.add('No component owns this markup, so it passed through.')

  const notes = [...ctx.notes]
  return {
    system,
    vue: printVue(tree),
    notes,
    refused: null,
    tree,
  }
}

export function collectModels (nodes: IrNode[]): ModelBinding[] {
  const models: ModelBinding[] = []
  visit(nodes, node => {
    const model = modelOf(node)
    if (!isNull(model)) models.push(model)
  })
  return models
}

function empty (note: string): ConvertResult {
  return { system: 'none', vue: '', notes: [note], refused: null, tree: [] }
}

function refuse (reason: string): ConvertResult {
  return { system: 'none', vue: '', notes: [], refused: reason, tree: [] }
}

function ids (): (base: string) => string {
  const counts = new Map<string, number>()
  return base => {
    const count = counts.get(base) ?? 0
    counts.set(base, count + 1)
    return count === 0 ? base : `${base}${count + 1}`
  }
}

function v5Reason (root: Element): string | null {
  const elements = [...root.querySelectorAll('*')]
  for (const el of elements) {
    if (has(el, 'modal-dialog')) return '`.modal-dialog` is Bootstrap 5. Bootstrap 6 uses `<dialog class="dialog">`.'
    if (has(el, 'offcanvas') || [...el.classList].some(name => name.startsWith('offcanvas-'))) {
      return '`.offcanvas` is Bootstrap 5. Bootstrap 6 uses `.drawer`.'
    }
    if ([...el.classList].some(name => /^col-(?:sm|md|lg|xl|xxl)-\d/.test(name))) {
      return '`col-md-*` is Bootstrap 5. Bootstrap 6 uses `md:col-*`.'
    }
    if (has(el, 'dropdown-toggle') || htmlDataset(el)?.bsToggle === 'dropdown') {
      return '`.dropdown-toggle` is Bootstrap 5. Bootstrap 6 uses `.menu`.'
    }
    if (htmlDataset(el)?.bsToggle === 'modal' || htmlDataset(el)?.bsToggle === 'offcanvas') {
      return '`data-bs-toggle` for a modal or offcanvas is Bootstrap 5.'
    }
    if ([...el.classList].some(name => /^btn-(?:primary|secondary|success|danger|warning|info|light|dark)$/.test(name))) {
      return '`.btn-primary` (and the other solid v5 names) is Bootstrap 5. Bootstrap 6 uses `btn-solid` and `theme-*`.'
    }
    if (has(el, 'modal') && has(el, 'fade')) {
      return '`.modal.fade` is Bootstrap 5. Bootstrap 6 uses `<dialog class="dialog">`.'
    }
  }
  return null
}

function walkList (list: ChildNode[], ctx: Ctx): IrNode[] {
  const skip = new Set<ChildNode>()
  for (let index = 0; index < list.length; index++) {
    const node = list[index]
    if (!isElement(node)) continue
    const next = nextElement(list, index)
    if (!isNull(next) && isBootstrapMenu(next) && isPlainButton(node)) skip.add(node)
    if (isCollapseTrigger(node) && !isNull(next) && isBootstrapCollapse(next)) skip.add(next)
  }

  const out: IrNode[] = []
  for (let index = 0; index < list.length; index++) {
    const node = list[index]
    if (isUndefinedNode(node) || skip.has(node)) continue
    if (!isElement(node)) {
      if (node.nodeType === 3) {
        const value = node.textContent ?? ''
        if (value.trim() !== '') out.push({ kind: 'text', text: value })
      }
      continue
    }
    const next = nextElement(list, index)
    if (isCollapseTrigger(node) && !isNull(next) && isBootstrapCollapse(next)) {
      out.push(convertCollapse(node, next, ctx))
      continue
    }
    out.push(convertElement(node, previousElement(list, index), ctx))
  }
  return out
}

function convertElement (el: Element, previous: Element | null, ctx: Ctx): IrNode {
  if (isBulmaModal(el)) return convertModal(el, ctx)
  if (isBulmaDropdown(el)) return convertDropdown(el, ctx)
  if (isBulmaNotification(el)) return convertNotification(el, ctx)
  if (isBootstrapDialog(el)) return convertDialog(el, ctx)
  if (isBootstrapMenu(el)) return convertMenu(el, previous, ctx)
  if (isBootstrapCollapse(el)) return convertCollapse(null, el, ctx)
  if (isTooltipTrigger(el)) return convertTooltipTrigger(el, ctx)
  if (isRenderedTooltip(el)) return convertRenderedTooltip(el, ctx)
  noteUnsupported(el, ctx)
  return {
    kind: 'element',
    tag: el.tagName.toLowerCase(),
    attrs: readAttrs(el, ctx, DATA_API),
    children: walkList([...el.childNodes], ctx),
    dismiss: hasDismiss(el),
  }
}

function convertModal (el: Element, ctx: Ctx): BulmaModalNode {
  const card = el.querySelector('.modal-card')
  const open = has(el, 'is-active')
  if (open) ctx.notes.add('Moved `is-active` onto `v-model`.')
  ctx.notes.add('`.modal-background` is owned by `BuModal`.')
  const id = ctx.id('modalOpen')
  if (isNull(card)) {
    const content = el.querySelector('.modal-content')
    const close = el.querySelector('.modal-close')
    return {
      kind: 'bulma-modal',
      id,
      open,
      variant: 'content',
      title: '',
      close: !isNull(close),
      closeSize: closeSize(close),
      dismiss: false,
      body: [],
      foot: [],
      content: isNull(content) ? [] : walkList([...content.childNodes], ctx),
    }
  }
  const head = card.querySelector('.modal-card-head')
  const title = card.querySelector('.modal-card-title')
  const body = card.querySelector('.modal-card-body')
  const foot = card.querySelector('.modal-card-foot')
  return {
    kind: 'bulma-modal',
    id,
    open,
    variant: 'card',
    title: isNull(title) ? '' : textOf(title),
    close: false,
    dismiss: !isNull(head?.querySelector('.delete')),
    body: isNull(body) ? [] : walkList([...body.childNodes], ctx),
    foot: isNull(foot) ? [] : walkList([...foot.childNodes], ctx),
    content: [],
  }
}

function convertDropdown (el: Element, ctx: Ctx): BulmaDropdownNode {
  if (has(el, 'is-active')) ctx.notes.add('Moved `is-active` onto `v-model`.')
  const trigger = el.querySelector('.dropdown-trigger')
  const content = el.querySelector('.dropdown-content')
  const menu = el.querySelector('.dropdown-menu')
  return {
    kind: 'bulma-dropdown',
    id: ctx.id('dropdownOpen'),
    open: has(el, 'is-active'),
    hoverable: has(el, 'is-hoverable'),
    right: has(el, 'is-right'),
    up: has(el, 'is-up'),
    menu: !isNull(menu) && menu.getAttribute('role') === 'menu',
    trigger: isNull(trigger) ? [] : walkList([...trigger.childNodes], ctx).map(node => stripTriggerAria(node)),
    items: isNull(content) ? [] : walkList([...content.childNodes], ctx),
  }
}

function convertNotification (el: Element, ctx: Ctx): BulmaNotificationNode {
  const color = colorOf(el)
  return {
    kind: 'bulma-notification',
    id: ctx.id('noticeOpen'),
    open: true,
    color,
    light: has(el, 'is-light'),
    dismiss: !isNull(el.querySelector(':scope > .delete, :scope > button.delete')),
    children: walkList([...el.childNodes].filter(node => !isDelete(node)), ctx),
  }
}

function convertDialog (el: Element, ctx: Ctx): BootstrapDialogNode {
  const header = el.querySelector('.dialog-header')
  const title = el.querySelector('.dialog-title')
  const body = el.querySelector('.dialog-body')
  const footer = el.querySelector('.dialog-footer')
  const size = dialogSize(el)
  if (el.hasAttribute('open') || has(el, 'show')) ctx.notes.add('Moved the open state onto `v-model`.')
  ctx.notes.add('Added an opener. The snippet has no Vue trigger.')
  return {
    kind: 'bootstrap-dialog',
    id: ctx.id('dialogOpen'),
    open: el.hasAttribute('open') || has(el, 'show'),
    size,
    blocking: has(el, 'dialog-static'),
    title: isNull(title) ? '' : textOf(title),
    body: isNull(body) ? (isNull(header) ? walkList([...el.childNodes], ctx) : []) : walkList([...body.childNodes], ctx),
    footer: isNull(footer) ? [] : walkList([...footer.childNodes], ctx),
  }
}

function convertMenu (el: Element, previous: Element | null, ctx: Ctx): BootstrapMenuNode {
  const label = !isNull(previous) && isPlainButton(previous) ? textOf(previous) : 'Menu'
  if (!isNull(previous) && isPlainButton(previous)) {
    ctx.notes.add('The trigger button became `BMenu`\'s `label`. Its classes are owned by the component.')
  }
  if (has(el, 'show')) ctx.notes.add('Moved `.show` onto `v-model`.')
  return {
    kind: 'bootstrap-menu',
    id: ctx.id('menuOpen'),
    open: has(el, 'show'),
    label,
    placement: placementOf(htmlDataset(el)?.bsPlacement, ctx),
    entries: menuEntries([...el.children], ctx),
  }
}

function menuEntries (children: Element[], ctx: Ctx): MenuEntry[] {
  const entries: MenuEntry[] = []
  for (const child of children) {
    if (has(child, 'menu-divider')) {
      entries.push({ kind: 'divider' })
      continue
    }
    if (has(child, 'menu-header')) {
      entries.push({ kind: 'header', text: textOf(child) })
      continue
    }
    if (has(child, 'submenu')) {
      const button = child.querySelector('button')
      const nested = child.querySelector('.menu')
      entries.push({
        kind: 'submenu',
        text: isNull(button) ? 'Submenu' : textOf(button),
        entries: isNull(nested) ? [] : menuEntries([...nested.children], ctx),
      })
      continue
    }
    if (has(child, 'menu-item')) {
      const href = child.getAttribute('href')
      entries.push({
        kind: 'item',
        text: textOf(child),
        href: isNull(href) ? undefined : href,
      })
    }
  }
  return entries
}

function convertCollapse (trigger: Element | null, panel: Element, ctx: Ctx): BootstrapCollapseNode {
  if (has(panel, 'show')) ctx.notes.add('Moved `.show` onto `v-model`.')
  if (!isNull(trigger)) ctx.notes.add('The collapse button stayed HTML. `data-bs-toggle` became a click that flips `v-model`.')
  return {
    kind: 'bootstrap-collapse',
    id: ctx.id('collapseOpen'),
    open: has(panel, 'show'),
    horizontal: has(panel, 'collapse-horizontal'),
    trigger: isNull(trigger) ? [] : [elementFrom(trigger, ctx, new Set([...DATA_API, 'aria-expanded']))],
    children: walkList([...panel.childNodes], ctx),
  }
}

function convertTooltipTrigger (el: Element, ctx: Ctx): BootstrapTooltipNode {
  const text = htmlDataset(el)?.bsTitle ?? el.getAttribute('title') ?? textOf(el)
  ctx.notes.add('Tooltip text came from `data-bs-title` or `title`. The data-api attributes were dropped.')
  return {
    kind: 'bootstrap-tooltip',
    id: ctx.id('tipOpen'),
    open: false,
    text,
    placement: placementOf(htmlDataset(el)?.bsPlacement, ctx),
    trigger: elementFrom(el, ctx, new Set([...DATA_API, 'title'])),
  }
}

function convertRenderedTooltip (el: Element, ctx: Ctx): BootstrapTooltipNode {
  const inner = el.querySelector('.tooltip-inner')
  const text = isNull(inner) ? textOf(el) : textOf(inner)
  ctx.notes.add('The open tip markup has no trigger. One was added.')
  return {
    kind: 'bootstrap-tooltip',
    id: ctx.id('tipOpen'),
    open: has(el, 'show'),
    text,
    placement: placementOf(htmlDataset(el)?.bsPlacement, ctx),
    trigger: {
      kind: 'element',
      tag: 'button',
      attrs: [
        { name: 'class', value: 'btn-solid theme-primary' },
        { name: 'type', value: 'button' },
      ],
      children: [{ kind: 'text', text }],
    },
  }
}

function elementFrom (el: Element, ctx: Ctx, strip: Set<string>): ElementNode {
  return {
    kind: 'element',
    tag: el.tagName.toLowerCase(),
    attrs: readAttrs(el, ctx, strip),
    children: walkList([...el.childNodes], ctx),
    dismiss: hasDismiss(el),
  }
}

function noteUnsupported (el: Element, ctx: Ctx) {
  if (has(el, 'drawer')) ctx.notes.add('`.drawer` is not in this proof. It passed through.')
  if (has(el, 'toast')) ctx.notes.add('`.toast` is not in this proof. It passed through.')
  if (has(el, 'navbar') || has(el, 'navbar-burger')) ctx.notes.add('Navbar markup is not in this proof. It passed through.')
  if (has(el, 'menu-list')) ctx.notes.add('Bulma `.menu` is not in this proof. It passed through.')
  if (has(el, 'tabs') || has(el, 'nav-tabs')) ctx.notes.add('Tabs markup is not in this proof. It passed through.')
}

function readAttrs (el: Element, ctx: Ctx, strip: Set<string>): IrAttr[] {
  const attrs: IrAttr[] = []
  for (const attr of el.attributes) {
    if (strip.has(attr.name)) {
      ctx.notes.add('Dropped the Bootstrap data-api. Open, selected, and dismissed state is `v-model`.')
      continue
    }
    attrs.push({ name: attr.name, value: attr.value })
  }
  return attrs
}

function stripTriggerAria (node: IrNode): IrNode {
  if (node.kind !== 'element') return node
  return {
    ...node,
    attrs: node.attrs.filter(attr => !TRIGGER_ARIA.has(attr.name)),
    children: node.children.map(child => stripTriggerAria(child)),
  }
}

function systemOf (nodes: IrNode[]): System | 'mixed' {
  let bulma = false
  let bootstrap = false
  visit(nodes, node => {
    if (node.kind.startsWith('bulma-')) bulma = true
    if (node.kind.startsWith('bootstrap-')) bootstrap = true
  })
  if (bulma && bootstrap) return 'mixed'
  if (bulma) return 'bulma'
  if (bootstrap) return 'bootstrap'
  return 'none'
}

function modelOf (node: IrNode): ModelBinding | null {
  switch (node.kind) {
    case 'bulma-modal':
    case 'bulma-dropdown':
    case 'bulma-notification':
    case 'bootstrap-dialog':
    case 'bootstrap-menu':
    case 'bootstrap-collapse':
    case 'bootstrap-tooltip': {
      return { id: node.id, open: node.open }
    }
    default: {
      return null
    }
  }
}

function visit (nodes: IrNode[], fn: (node: IrNode) => void) {
  for (const node of nodes) {
    fn(node)
    switch (node.kind) {
      case 'element': {
        visit(node.children, fn)
        break
      }
      case 'bulma-modal': {
        visit(node.body, fn)
        visit(node.foot, fn)
        visit(node.content, fn)
        break
      }
      case 'bulma-dropdown': {
        visit(node.trigger, fn)
        visit(node.items, fn)
        break
      }
      case 'bulma-notification': {
        visit(node.children, fn)
        break
      }
      case 'bootstrap-dialog': {
        visit(node.body, fn)
        visit(node.footer, fn)
        break
      }
      case 'bootstrap-collapse': {
        visit(node.trigger, fn)
        visit(node.children, fn)
        break
      }
      case 'bootstrap-tooltip': {
        visit([node.trigger], fn)
        break
      }
      default: {
        break
      }
    }
  }
}

function printVue (tree: IrNode[]): string {
  const models = collectModels(tree)
  const bulma = new Set<string>()
  const bootstrap = new Set<string>()
  visit(tree, node => {
    for (const name of componentNames(node)) {
      if (name.startsWith('Bu')) bulma.add(name)
      else bootstrap.add(name)
    }
  })
  const lines: string[] = ['<script setup lang="ts">']
  if (bulma.size > 0) lines.push(`  import { ${[...bulma].toSorted().join(', ')} } from '@paper/bulma'`)
  if (bootstrap.size > 0) {
    if (bulma.size > 0) lines.push('')
    lines.push(`  import { ${[...bootstrap].toSorted().join(', ')} } from '@paper/bootstrap'`)
  }
  if (models.length > 0) {
    if (bulma.size > 0 || bootstrap.size > 0) lines.push('')
    lines.push('  import { shallowRef } from \'vue\'', '')
    for (const model of models) {
      lines.push(`  const ${model.id} = shallowRef(${model.open})`)
    }
  }
  lines.push('</script>', '', '<template>')
  const body = printList(tree, 2)
  if (body !== '') lines.push(body)
  lines.push('</template>', '')
  return lines.join('\n')
}

function componentNames (node: IrNode): string[] {
  switch (node.kind) {
    case 'bulma-modal': {
      return node.variant === 'card'
        ? ['BuModal', 'BuModalCard', 'BuModalHead', 'BuModalTitle', 'BuModalDelete', 'BuModalBody', 'BuModalFoot']
        : ['BuModal', 'BuModalContent', 'BuModalClose']
    }
    case 'bulma-dropdown': {
      return ['BuDropdown', 'BuDropdownTrigger', 'BuDropdownMenu']
    }
    case 'bulma-notification': {
      return node.dismiss ? ['BuNotification', 'BuNotificationDelete'] : ['BuNotification']
    }
    case 'bootstrap-dialog': {
      return ['BDialog']
    }
    case 'bootstrap-menu': {
      return ['BMenu']
    }
    case 'bootstrap-collapse': {
      return ['BCollapse']
    }
    case 'bootstrap-tooltip': {
      return ['BTooltip']
    }
    default: {
      return []
    }
  }
}

function printList (nodes: IrNode[], depth: number, closes?: string): string {
  const lines: string[] = []
  const buffer: string[] = []

  function flush () {
    if (buffer.length === 0) return
    lines.push(buffer.map(piece => pad(depth) + piece).join('\n'))
    buffer.length = 0
  }

  for (const node of nodes) {
    if (node.kind === 'text') {
      const piece = escapeText(keepEdge(node.text))
      if (piece === '') continue
      const last = buffer.length - 1
      if (last >= 0) buffer[last] += piece
      else buffer.push(piece)
      continue
    }
    if (node.kind === 'element' && INLINE.has(node.tag)) {
      const piece = printInline(node, closes)
      if (piece === '') continue
      const last = buffer.length - 1
      if (last >= 0 && !buffer[last].endsWith('>')) buffer[last] += piece
      else buffer.push(piece)
      continue
    }
    flush()
    const line = printNode(node, depth, closes)
    if (line !== '') lines.push(line)
  }
  flush()
  return lines.join('\n\n')
}

function printNode (node: IrNode, depth: number, closes?: string): string {
  switch (node.kind) {
    case 'text': {
      const value = keepEdge(node.text)
      if (value === '') return ''
      return pad(depth) + escapeText(value)
    }
    case 'element': {
      return printElement(node, depth, [], closes)
    }
    case 'bulma-modal': {
      return printModal(node, depth)
    }
    case 'bulma-dropdown': {
      return printDropdown(node, depth)
    }
    case 'bulma-notification': {
      return printNotification(node, depth)
    }
    case 'bootstrap-dialog': {
      return printDialog(node, depth)
    }
    case 'bootstrap-menu': {
      return printMenu(node, depth)
    }
    case 'bootstrap-collapse': {
      return printCollapse(node, depth)
    }
    case 'bootstrap-tooltip': {
      return printTooltip(node, depth)
    }
  }
}

function printModal (node: BulmaModalNode, depth: number): string {
  const opener = `${pad(depth)}<button class="button is-link" type="button" @click="${node.id} = true">\n${pad(depth + 2)}Open modal\n${pad(depth)}</button>`
  const props = `v-model="${node.id}"`
  if (node.variant === 'content') {
    const close = node.close
      ? `\n\n${pad(depth + 2)}<BuModalClose${node.closeSize ? ` size="${node.closeSize}"` : ''} />`
      : ''
    return [
      opener,
      `${pad(depth)}<BuModal ${props}>`,
      `${pad(depth + 2)}<BuModalContent>`,
      printList(node.content, depth + 4),
      `${pad(depth + 2)}</BuModalContent>${close}`,
      `${pad(depth)}</BuModal>`,
    ].filter(line => line !== '').join('\n\n')
  }
  const head = [
    `${pad(depth + 4)}<BuModalHead>`,
    node.title === '' ? '' : `${pad(depth + 6)}<BuModalTitle>${escapeText(node.title)}</BuModalTitle>`,
    node.dismiss ? `${pad(depth + 6)}<BuModalDelete />` : '',
    `${pad(depth + 4)}</BuModalHead>`,
  ].filter(line => line !== '').join('\n')
  const foot = node.foot.length === 0
    ? ''
    : `\n\n${pad(depth + 4)}<BuModalFoot>\n${printList(node.foot, depth + 6)}\n${pad(depth + 4)}</BuModalFoot>`
  return [
    opener,
    `${pad(depth)}<BuModal ${props}>`,
    `${pad(depth + 2)}<BuModalCard>`,
    head,
    `${pad(depth + 4)}<BuModalBody>`,
    printList(node.body, depth + 6),
    `${pad(depth + 4)}</BuModalBody>${foot}`,
    `${pad(depth + 2)}</BuModalCard>`,
    `${pad(depth)}</BuModal>`,
  ].join('\n\n')
}

function printDropdown (node: BulmaDropdownNode, depth: number): string {
  const flags = [
    node.menu ? 'menu' : '',
    node.hoverable ? 'hoverable' : '',
    node.right ? 'right' : '',
    node.up ? 'up' : '',
  ].filter(flag => flag !== '')
  const props = [`v-model="${node.id}"`, ...flags].join(' ')
  const trigger = node.trigger.map(child => printTrigger(child, depth + 4)).join('\n')
  const slot = node.menu ? ' v-slot="{ item }"' : ''
  return [
    `${pad(depth)}<BuDropdown ${props}>`,
    `${pad(depth + 2)}<BuDropdownTrigger v-slot="{ attrs }">`,
    trigger,
    `${pad(depth + 2)}</BuDropdownTrigger>`,
    '',
    `${pad(depth + 2)}<BuDropdownMenu${slot}>`,
    printItems(node.items, depth + 4, node.menu),
    `${pad(depth + 2)}</BuDropdownMenu>`,
    `${pad(depth)}</BuDropdown>`,
  ].join('\n')
}

function printTrigger (node: IrNode, depth: number): string {
  if (node.kind !== 'element') return printNode(node, depth)
  return printElement(node, depth, ['v-bind="attrs"'])
}

function printItems (nodes: IrNode[], depth: number, menu: boolean): string {
  return nodes.map(node => {
    if (node.kind === 'element' && menu && hasClass(node, 'dropdown-item')) {
      return printElement(node, depth, ['v-bind="item"'])
    }
    return printNode(node, depth)
  }).filter(line => line !== '').join('\n\n')
}

function printNotification (node: BulmaNotificationNode, depth: number): string {
  const props = [`v-model="${node.id}"`]
  if (node.color) props.push(`color="${node.color}"`)
  if (node.light) props.push('light')
  const opener = `${pad(depth)}<button v-if="!${node.id}" class="button" type="button" @click="${node.id} = true">\n${pad(depth + 2)}Show notification\n${pad(depth)}</button>`
  const dismiss = node.dismiss ? `\n${pad(depth + 2)}<BuNotificationDelete />\n` : '\n'
  return [
    opener,
    '',
    `${pad(depth)}<BuNotification ${props.join(' ')}>${dismiss}${printList(node.children, depth + 2)}\n${pad(depth)}</BuNotification>`,
  ].join('\n')
}

function printDialog (node: BootstrapDialogNode, depth: number): string {
  const props = [`v-model="${node.id}"`]
  if (node.size === 'sm' || node.size === 'lg' || node.size === 'xl') props.push(`size="${node.size}"`)
  if (node.blocking) props.push('blocking')
  const footer = node.footer.length === 0
    ? ''
    : `\n\n${pad(depth + 2)}<BDialog.Footer>\n${printList(node.footer, depth + 4, node.id)}\n${pad(depth + 2)}</BDialog.Footer>`
  return [
    `${pad(depth)}<button class="btn-solid theme-primary" type="button" @click="${node.id} = true">`,
    `${pad(depth + 2)}Open dialog`,
    `${pad(depth)}</button>`,
    '',
    `${pad(depth)}<BDialog ${props.join(' ')}>`,
    `${pad(depth + 2)}<BDialog.Header>`,
    `${pad(depth + 4)}<BDialog.Title>${escapeText(node.title)}</BDialog.Title>`,
    '',
    `${pad(depth + 4)}<BDialog.Close />`,
    `${pad(depth + 2)}</BDialog.Header>`,
    '',
    `${pad(depth + 2)}<BDialog.Body>`,
    printList(node.body, depth + 4, node.id),
    `${pad(depth + 2)}</BDialog.Body>${footer}`,
    `${pad(depth)}</BDialog>`,
  ].join('\n')
}

function printMenu (node: BootstrapMenuNode, depth: number): string {
  const props = [`v-model="${node.id}"`, `label="${escapeAttr(node.label)}"`]
  if (node.placement) props.push(`placement="${node.placement}"`)
  return [
    `${pad(depth)}<BMenu ${props.join(' ')}>`,
    printEntries(node.entries, depth + 2),
    `${pad(depth)}</BMenu>`,
  ].join('\n')
}

function printEntries (entries: MenuEntry[], depth: number): string {
  return entries.map(entry => {
    if (entry.kind === 'divider') return `${pad(depth)}<BMenu.Divider />`
    if (entry.kind === 'header') return `${pad(depth)}<BMenu.Header>${escapeText(entry.text ?? '')}</BMenu.Header>`
    if (entry.kind === 'submenu') {
      return [
        `${pad(depth)}<BMenu.Submenu label="${escapeAttr(entry.text ?? '')}">`,
        printEntries(entry.entries ?? [], depth + 2),
        `${pad(depth)}</BMenu.Submenu>`,
      ].join('\n')
    }
    const href = entry.href === undefined ? '' : ` href="${escapeAttr(entry.href)}"`
    return `${pad(depth)}<BMenu.Item${href}>${escapeText(entry.text ?? '')}</BMenu.Item>`
  }).join('\n\n')
}

function printCollapse (node: BootstrapCollapseNode, depth: number): string {
  const trigger = node.trigger.map(child => printCollapseTrigger(child, depth, node.id)).join('\n')
  const props = [`v-model="${node.id}"`]
  if (node.horizontal) props.push('horizontal')
  const panel = [
    `${pad(depth)}<BCollapse ${props.join(' ')}>`,
    printList(node.children, depth + 2),
    `${pad(depth)}</BCollapse>`,
  ].join('\n')
  return trigger === '' ? panel : `${trigger}\n\n${panel}`
}

function printCollapseTrigger (node: IrNode, depth: number, id: string): string {
  if (node.kind !== 'element') return printNode(node, depth)
  return printElement(node, depth, [`@click="${id} = !${id}"`, `:aria-expanded="${id}"`])
}

function printTooltip (node: BootstrapTooltipNode, depth: number): string {
  const props = [`v-model="${node.id}"`, `text="${escapeAttr(node.text)}"`]
  if (node.placement) props.push(`placement="${node.placement}"`)
  return [
    `${pad(depth)}<BTooltip v-slot="{ attrs }" ${props.join(' ')}>`,
    printTrigger(node.trigger, depth + 2),
    `${pad(depth)}</BTooltip>`,
  ].join('\n')
}

function printElement (node: ElementNode, depth: number, extra: string[], closes?: string): string {
  const attrs = node.attrs.map(attr => `${attr.name}="${escapeAttr(attr.value)}"`)
  const dismiss = node.dismiss && closes ? [`@click="${closes} = false"`] : []
  const bits = [...attrs, ...extra, ...dismiss]
  const open = bits.length === 0 ? `<${node.tag}>` : `<${node.tag} ${bits.join(' ')}>`
  if (VOID.has(node.tag)) return pad(depth) + open.replace(/>$/, '>')
  if (node.children.length === 0) return `${pad(depth)}${open}</${node.tag}>`
  const inner = printList(node.children, depth + 2, closes)
  return `${pad(depth)}${open}\n${inner}\n${pad(depth)}</${node.tag}>`
}

function hasClass (node: ElementNode, name: string): boolean {
  const found = node.attrs.find(attr => attr.name === 'class')
  if (found === undefined) return false
  return found.value.split(/\s+/).includes(name)
}

function isBulmaModal (el: Element): boolean {
  return has(el, 'modal') && !isNull(el.querySelector('.modal-background, .modal-card, .modal-content'))
}

function isBulmaDropdown (el: Element): boolean {
  return has(el, 'dropdown') && !isNull(el.querySelector('.dropdown-trigger'))
}

function isBulmaNotification (el: Element): boolean {
  return has(el, 'notification') && el.tagName === 'DIV'
}

function isBootstrapDialog (el: Element): boolean {
  return el.tagName === 'DIALOG' && has(el, 'dialog')
}

function isBootstrapMenu (el: Element): boolean {
  return has(el, 'menu')
    && isNull(el.querySelector('.menu-list'))
    && !isNull(el.querySelector('.menu-item, .menu-header, .menu-divider, .submenu'))
}

function isBootstrapCollapse (el: Element): boolean {
  return has(el, 'collapse') && !has(el, 'navbar-collapse')
}

function isCollapseTrigger (el: Element): boolean {
  return htmlDataset(el)?.bsToggle === 'collapse'
}

function isTooltipTrigger (el: Element): boolean {
  return htmlDataset(el)?.bsToggle === 'tooltip'
}

function isRenderedTooltip (el: Element): boolean {
  return has(el, 'tooltip') && has(el, 'bs-tooltip-auto')
}

function isPlainButton (el: Element): boolean {
  return el.tagName === 'BUTTON' && !isTooltipTrigger(el) && !isCollapseTrigger(el)
}

function isDelete (node: ChildNode): boolean {
  return isElement(node) && has(node, 'delete')
}

const INLINE = new Set(['a', 'abbr', 'b', 'code', 'em', 'i', 'kbd', 'mark', 'small', 'span', 'strong', 'sub', 'sup'])

function keepEdge (text: string): string {
  if (text.trim() === '') return ''
  const lead = /^\s/.test(text) ? ' ' : ''
  const tail = /\s$/.test(text) ? ' ' : ''
  return lead + text.replace(/\s+/g, ' ').trim() + tail
}

function printInline (node: ElementNode, closes?: string): string {
  const attrs = node.attrs.map(attr => `${attr.name}="${escapeAttr(attr.value)}"`)
  const dismiss = node.dismiss && closes ? [`@click="${closes} = false"`] : []
  const bits = [...attrs, ...dismiss]
  const open = bits.length === 0 ? `<${node.tag}>` : `<${node.tag} ${bits.join(' ')}>`
  const inner = node.children.map(child => {
    if (child.kind === 'text') return escapeText(keepEdge(child.text))
    if (child.kind === 'element' && INLINE.has(child.tag)) return printInline(child, closes)
    return ''
  }).join('')
  return `${open}${inner}</${node.tag}>`
}

function htmlDataset (el: Element): DOMStringMap | null {
  return el instanceof HTMLElement ? el.dataset : null
}

function hasDismiss (el: Element): true | undefined {
  const data = htmlDataset(el)
  if (isNull(data)) return undefined
  return Object.hasOwn(data, 'bsDismiss') || undefined
}

function has (el: Element, name: string): boolean {
  return el.classList.contains(name)
}

function textOf (el: Element): string {
  return collapse(el.textContent ?? '')
}

function collapse (value: string): string {
  return value.replace(/\s+/g, ' ').trim()
}

function colorOf (el: Element): Color | undefined {
  for (const color of COLORS) {
    if (has(el, `is-${color}`)) return color
  }
  return undefined
}

function dialogSize (el: Element): 'sm' | 'lg' | 'xl' | undefined {
  if (has(el, 'dialog-sm')) return 'sm'
  if (has(el, 'dialog-lg')) return 'lg'
  if (has(el, 'dialog-xl')) return 'xl'
  return undefined
}

function closeSize (el: Element | null): BulmaModalNode['closeSize'] {
  if (isNull(el)) return undefined
  if (has(el, 'is-small')) return 'small'
  if (has(el, 'is-medium')) return 'medium'
  if (has(el, 'is-large')) return 'large'
  return undefined
}

function placementOf (value: string | null | undefined, ctx: Ctx): Placement | undefined {
  if (isNullOrUndefined(value) || value === '') return undefined
  if ((PLACEMENTS as readonly string[]).includes(value)) return value as Placement
  ctx.notes.add(`\`${value}\` is not a placement this proof maps.`)
  return undefined
}

function nextElement (list: ChildNode[], index: number): Element | null {
  for (let cursor = index + 1; cursor < list.length; cursor++) {
    const node = list[cursor]
    if (isElement(node)) return node
  }
  return null
}

function previousElement (list: ChildNode[], index: number): Element | null {
  for (let cursor = index - 1; cursor >= 0; cursor--) {
    const node = list[cursor]
    if (isElement(node)) return node
  }
  return null
}

function isUndefinedNode (node: ChildNode | undefined): node is undefined {
  return node === undefined
}

function pad (depth: number): string {
  return ' '.repeat(depth)
}

function escapeText (value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function escapeAttr (value: string): string {
  return escapeText(value).replaceAll('"', '&quot;')
}
