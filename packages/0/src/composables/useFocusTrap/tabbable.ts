/**
 * @module tabbable
 *
 * @remarks
 * The "which descendants can Tab reach" rules, shared rather than duplicated.
 *
 * Shared by `useFocusTrap` (containment) and `Treeview/TreeviewList.vue`
 * (roving). Treeview layers its own `aria-disabled` and treeitem-scope filters
 * on top of {@link tabbable}. `FOCUSABLE`, `tabbable`, and `isFocusTrapElement`
 * are re-exported from `useFocusTrap/index.ts`; {@link follows} stays local.
 */

// Utilities
import { isElement, isFunction, isNull, isUndefined } from '#v0/utilities'

/**
 * An element that can hold focus. `focus()` / `blur()` come from the
 * `HTMLOrSVGElement` mixin, so SVG content participates alongside HTML.
 */
export type FocusTrapElement = HTMLElement | SVGElement

/**
 * Candidate tab stops, in document order.
 *
 * Every entry is a *potential* stop — negative `tabindex`, `disabled`, `inert`,
 * `hidden`, collapsed `<details>`, unchecked radios, and CSS-hidden are
 * disqualified in {@link tabbable} so one JS pass owns the rules and the
 * selector stays cheap.
 *
 * `input:not([type="hidden"])` is filtered here rather than in JS because it is
 * strictly cheaper. `button` / `select` / `textarea` carry no `:not([disabled])`
 * on purpose: property-only disabling and `fieldset[disabled]` inheritance are
 * invisible to an attribute selector, so disabled state is resolved in JS.
 *
 * Deliberately absent: `label` and `fieldset` (not focusable), `[draggable]`
 * (not focusable), `svg[focusable]` (a dead SVG 1.1 attribute).
 */
export const FOCUSABLE = [
  'a[href]',
  'area[href]',
  'audio[controls]',
  'button',
  'details > summary:first-of-type',
  'embed',
  'iframe',
  'input:not([type="hidden"])',
  'object',
  'select',
  'textarea',
  'video[controls]',
  '[contenteditable]:not([contenteditable="false"])',
  '[tabindex]',
].join(',')

/**
 * Narrow an unknown node to something that can hold focus.
 */
export function isFocusTrapElement (el: unknown): el is FocusTrapElement {
  return isElement(el) && 'focus' in el && isFunction(el.focus)
}

/**
 * Whether `node` sits after `ref` in document order.
 *
 * A cross-tree comparison reports `DOCUMENT_POSITION_DISCONNECTED` and an
 * implementation-defined direction, so it answers false rather than guessing —
 * focus inside a descendant's shadow root falls back to the identity test.
 */
export function follows (ref: Node, node: Node): boolean {
  const position = ref.compareDocumentPosition(node)

  if (position & Node.DOCUMENT_POSITION_DISCONNECTED) return false

  return Boolean(position & Node.DOCUMENT_POSITION_FOLLOWING)
}

/**
 * Whether `el` sits inside the first `<legend>` of `fieldset`.
 *
 * Only the first legend is exempt from a disabled fieldset; a second one is
 * ordinary content.
 */
function inFirstLegend (fieldset: Element, el: Element): boolean {
  for (const child of fieldset.children) {
    if (child.tagName === 'LEGEND') return child.contains(el)
  }

  return false
}

/**
 * Whether an element is disabled — by its own property or by inheritance from a
 * `fieldset[disabled]` ancestor.
 *
 * Gated on `'disabled' in el` so the fieldset rule reaches form controls only:
 * a link inside a disabled fieldset stays focusable.
 *
 * Every disabled fieldset ancestor is walked, not just the nearest: a control in
 * the first legend of an inner one is exempt from *that* fieldset while an outer
 * disabled fieldset still disables it.
 */
function isDisabled (el: Element): boolean {
  if (!('disabled' in el)) return false
  if ((el as Element & { disabled?: boolean }).disabled === true) return true

  let fieldset = el.closest('fieldset[disabled]')

  while (!isNull(fieldset)) {
    if (!inFirstLegend(fieldset, el)) return true

    // `closest` matches itself, so restart the walk above the exempting fieldset.
    fieldset = fieldset.parentElement?.closest('fieldset[disabled]') ?? null
  }

  return false
}

/**
 * Whether an element sits in the collapsed content of a `<details>`.
 *
 * Attribute-only, so it needs no layout — the summary itself stays a stop.
 */
function isConcealed (el: Element): boolean {
  const details = el.closest('details:not([open])')

  if (isNull(details)) return false

  const summary = el.closest('summary')

  return isNull(summary) || summary.parentElement !== details
}

/**
 * Sequential-focus checks shared by {@link tabbable} and radio-group ranking.
 *
 * Radio grouping is applied on top — a checked-but-disabled radio is not a stop,
 * and must not veto the rest of the group either.
 */
function isTabStop (el: FocusTrapElement): boolean {
  const tabindex = el.getAttribute('tabindex')

  // Parsed rather than matched: `:not([tabindex="-1"])` misses `-2` and ` -1 `.
  if (!isNull(tabindex) && Number.parseInt(tabindex, 10) < 0) return false

  if (isDisabled(el)) return false
  if (!isNull(el.closest('[inert]'))) return false
  if (!isNull(el.closest('[hidden]'))) return false
  if (isConcealed(el)) return false

  return isVisible(el)
}

/**
 * Whether a radio participates in sequential focus navigation.
 *
 * A radio group is *one* tab stop, not one per member: the checked radio if it
 * is otherwise tabbable, otherwise the first otherwise-tabbable member.
 * Disabled / hidden / inert members are not stops and must not hide the rest
 * of the group — HTML sequential navigation skips them the same way.
 *
 * Grouping follows the HTML radio button group definition — same `name`, same
 * form owner — so two forms on a page keep independent groups, and an unnamed
 * radio is its own group.
 */
function isTabbableRadio (el: HTMLInputElement): boolean {
  if (el.name === '') return true

  // Scoped to the owning form where there is one; the group cannot span forms.
  const scope: ParentNode = el.form ?? el.ownerDocument
  const members = [...scope.querySelectorAll<HTMLInputElement>('input[type="radio"]')]
    .filter(member => (
      member.name === el.name
      && member.form === el.form
      && isFocusTrapElement(member)
      && isTabStop(member)
    ))

  const checked = members.find(member => member.checked)

  if (!isUndefined(checked)) return checked === el

  return members[0] === el
}

/**
 * Whether an element is rendered.
 *
 * `checkVisibility()` is the only clean way to detect `display: none` and
 * `visibility: hidden` applied by a stylesheet, and it is one batched style read
 * with no interleaved writes. `opacity: 0` elements are still focusable, so
 * opacity is explicitly excluded, and size is never checked — visually-hidden
 * controls (skip links, clipped checkboxes) are legitimate tab stops.
 *
 * Where the API is unavailable (older engines, happy-dom), assume visible: a
 * false negative silently drops a real tab stop and breaks containment, while a
 * false positive only focuses something the attribute checks did not catch.
 *
 * A detached element gets the same benefit of the doubt. `checkVisibility()`
 * reports false for anything outside the document, conflating "styled out of
 * existence" with "not in a document yet" — and a subtree mounted without being
 * attached (`mount()` with no `attachTo`, a component rendered ahead of
 * insertion) has no tab order for the answer to be wrong about.
 */
function isVisible (el: FocusTrapElement): boolean {
  if (!el.isConnected) return true
  if (!isFunction(el.checkVisibility)) return true

  return el.checkVisibility({
    checkOpacity: false,
    checkVisibilityCSS: true,
    contentVisibilityAuto: true,
    visibilityProperty: true,
  })
}

/**
 * Whether a {@link FOCUSABLE} candidate is actually reachable by Tab.
 *
 * `aria-disabled="true"` is deliberately **not** filtered: per APG an
 * aria-disabled control stays in the tab order, so dropping it would let the
 * browser walk past the computed boundary and out of a trap.
 * `Treeview/TreeviewList.vue` excludes it for the opposite reason — roving focus
 * must skip disabled items — so the two filters diverge on purpose, and
 * Treeview layers that rule on top of this one.
 */
export function tabbable (el: Element): el is FocusTrapElement {
  if (!isFocusTrapElement(el)) return false
  if (!isTabStop(el)) return false

  // Tag-name rather than `instanceof`: an `<input>` inside an iframe belongs to
  // another realm and would fail the constructor check.
  if (el.tagName === 'INPUT') {
    const input = el as unknown as HTMLInputElement

    if (input.type === 'radio' && !isTabbableRadio(input)) return false
  }

  return true
}
