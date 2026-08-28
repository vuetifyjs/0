/**
 * @module useFocusTrap
 *
 * @see https://0.vuetifyjs.com/composables/system/use-focus-trap
 *
 * @remarks
 * Confines sequential keyboard navigation (Tab / Shift+Tab) to the subtree of a
 * single root element, focuses into it on activation, and hands focus back to
 * the previously focused element on deactivation.
 *
 * Key features:
 * - Tab / Shift+Tab wrap at the first and last tabbable descendant
 * - Recovers focus that escaped the root (backdrop blur, third-party `focus()`)
 * - Focuses the first tabbable descendant on activate, or the root as a fallback
 * - Restores the previously focused element on deactivate, skipping the restore
 *   when something outside the root has already claimed focus
 * - A radio group counts as one tab stop, the way the browser counts it
 * - Reactive `active` option plus imperative `activate()` / `deactivate()`
 * - Optional `onEscape` callback; the trap itself never closes anything
 * - Shadow-piercing containment via `getActiveElement()`
 * - No DOM mutation — the root's `tabindex` stays the consumer's responsibility
 * - Silent no-op while the root is missing or detached from the document
 * - SSR-safe (no listener is bound, every DOM branch is gated)
 *
 * Reach for this when an overlay is not a native `<dialog>`. A `<dialog>` opened
 * with `showModal()` is trapped by the browser and needs nothing here; a
 * `Dialog.Content` rendered `as="div"` gets no top layer and no containment,
 * which is the case this composable covers.
 *
 * Common use cases: modal dialogs, alert dialogs, drawers, command palettes.
 *
 * Accessibility: a focus trap is only half of a modal contract. Pair it with
 * `aria-modal="true"`, an accessible name, and a dismiss path — the trap
 * deliberately implements none of those.
 *
 * @example
 * ```ts
 * import { shallowRef, useTemplateRef } from 'vue'
 * import { useFocusTrap } from '@vuetify/v0'
 *
 * const isOpen = shallowRef(false)
 * const panel = useTemplateRef<HTMLElement>('panel')
 *
 * useFocusTrap(panel, { active: isOpen })
 * ```
 */

// Composables
import { useDocumentEventListener } from '#v0/composables/useEventListener'
import { useToggleScope } from '#v0/composables/useToggleScope'

// Transformers
import { toElement } from '#v0/composables/toElement'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Tabbability
import { FOCUSABLE, follows, isFocusTrapElement, tabbable } from './tabbable'

// Utilities
import { getActiveElement, isNull, isUndefined } from '#v0/utilities'
import { onScopeDispose, shallowReadonly, shallowRef, toValue, watch, watchEffect } from 'vue'

// Types
import type { MaybeElementRef } from '#v0/composables/toElement'
import type { FocusTrapElement } from './tabbable'
import type { MaybeRefOrGetter, Ref } from 'vue'

/**
 * Shadow-piercing containment test.
 *
 * `Node.contains()` stops at shadow boundaries, so a control inside an open
 * shadow root would read as outside the trap and get yanked back on every Tab.
 * Walk parents, hopping from a `ShadowRoot` to its host.
 */
function contains (root: Node, node: Node | null): boolean {
  let current: Node | null = node

  while (!isNull(current)) {
    if (current === root) return true

    const { host } = current as Partial<ShadowRoot>

    current = current.parentNode ?? host ?? null
  }

  return false
}

export interface UseFocusTrapOptions {
  /**
   * Reactive activation source. When it flips true the trap engages and focuses
   * into the root; when it flips false the trap releases and restores focus.
   *
   * Omit it entirely to drive the trap imperatively.
   *
   * @remarks
   * This is a *source*, not the state — `isActive` is the state. An imperative
   * `activate()` / `deactivate()` overrides the source until its next
   * transition. See {@link useFocusTrap} for the full precedence rule.
   *
   * @example
   * ```ts
   * useFocusTrap(panel, { active: () => dialog.isOpen.value })
   * ```
   */
  active?: MaybeRefOrGetter<boolean>
  /**
   * Where focus lands when the trap engages.
   *
   * - omitted — the first tabbable descendant, falling back to the root
   * - `false` — nothing is focused; the first Tab pulls focus in instead
   * - an element / ref / getter — that node is focused directly
   *
   * @example
   * ```ts
   * const search = useTemplateRef<HTMLInputElement>('search')
   *
   * useFocusTrap(panel, { initial: search })   // autofocus a specific control
   * useFocusTrap(panel, { initial: false })    // no autofocus at all
   * ```
   */
  initial?: false | MaybeElementRef
  /**
   * Return focus to the element that was focused before activation.
   *
   * Skipped when focus has already moved outside the root by the time the trap
   * releases — closing a dialog must not steal focus back from whatever the
   * user just clicked.
   *
   * @default true
   *
   * @example
   * ```ts
   * useFocusTrap(panel, { restore: false })
   * ```
   */
  restore?: boolean
  /**
   * Invoked on Escape while the trap is engaged and owns focus.
   *
   * Opt-in and side-effect free: the trap never calls `preventDefault()` and
   * never deactivates itself. Nested traps are not coordinated — check your own
   * stack ticket when several traps can be engaged at once.
   *
   * @example
   * ```ts
   * const ticket = stack.register({ onDismiss: () => (isOpen.value = false) })
   *
   * useFocusTrap(panel, {
   *   active: isOpen,
   *   onEscape: event => {
   *     if (!ticket.globalTop.value) return
   *     event.preventDefault()
   *     isOpen.value = false
   *   },
   * })
   * ```
   */
  onEscape?: (event: KeyboardEvent) => void
}

export interface UseFocusTrapReturn {
  /**
   * Whether the trap is currently engaged
   */
  readonly isActive: Readonly<Ref<boolean>>
  /**
   * Engage the trap: capture the focused element for a later restore, bind
   * containment, and focus into the root once it exists. No-op when already
   * engaged, so it never overwrites the captured restore target.
   *
   * @remarks
   * The document listener binds on the next flush, so a Tab dispatched
   * synchronously in the same tick as this call is not yet intercepted. Awaiting
   * a tick — or letting Vue drive the trap through `options.active` — avoids it.
   */
  activate: () => void
  /**
   * Release the trap and restore focus. No-op when not engaged.
   */
  deactivate: () => void
  /**
   * The keydown handler, exposed so a consumer that already owns a listener can
   * call in rather than binding a second one
   */
  onKeydown: (event: KeyboardEvent) => void
}

/**
 * Confines Tab / Shift+Tab to the subtree of `target`.
 *
 * @param target The trap root. Accepts a template ref, getter, component instance, or raw element. Give it `tabindex="-1"` if it can ever contain zero tabbable descendants.
 * @param options Configuration options.
 * @returns The trap's reactive state and controls.
 *
 * @remarks
 * **Why the listener is on `document`.** A root-bound listener stops firing the
 * moment focus leaves the subtree — a backdrop click that blurs to `<body>`, or
 * a stray programmatic `focus()` — and the trap is then dead with no way back.
 * Binding at the document in the capture phase means an escaped focus is
 * recovered on the next Tab, and containment survives an inner
 * `stopPropagation()`.
 *
 * **Only the boundaries are intercepted.** Mid-list Tab presses pass straight
 * through untouched, so an inner widget keeps full control of its own Tab
 * handling everywhere except the first and last stop.
 *
 * **Precedence.** `options.active` is a source; `isActive` is the state. The
 * source's transitions call `activate()` / `deactivate()`, while imperative
 * calls write the state directly and never write back to the source. Calling
 * `deactivate()` while the `active` getter still returns `true` therefore stays
 * deactivated until `active` next transitions false → true.
 *
 * **Ordering.** Candidates are collected in document order. Positive `tabindex`
 * values are not re-sorted into their real tab position — they are an
 * anti-pattern the trap declines to optimize for.
 *
 * **Shadow DOM and iframes.** Containment pierces open shadow roots, but
 * discovery cannot (`querySelectorAll` does not cross the boundary). If the last
 * tab stop lives inside a descendant's shadow root, focus can still leave on
 * Tab. The same applies to `<iframe>` content, which no JS trap can contain.
 *
 * **Nesting resolves outward-first.** Every trap binds the same capture-phase
 * listener on `document`, so they run in creation order: the outer trap wraps
 * first and the inner one sees `defaultPrevented`. Nested traps are not
 * coordinated — deactivate the outer trap, or gate on a `useStack` ticket, when
 * the inner one has to own its own boundary. For the same reason a handler
 * *inside* the root cannot `preventDefault()` its way past the boundary; capture
 * on `document` has already run.
 *
 * @see https://0.vuetifyjs.com/composables/system/use-focus-trap
 *
 * @example Reactive activation
 * ```ts
 * const panel = useTemplateRef<HTMLElement>('panel')
 * const isOpen = shallowRef(false)
 *
 * useFocusTrap(panel, { active: isOpen })
 * ```
 *
 * @example Component ref (e.g., Atom)
 * ```ts
 * const content = useTemplateRef<AtomExpose>('content')
 *
 * useFocusTrap(() => content.value?.element, { active: () => context.isOpen.value })
 * ```
 *
 * @example Imperative activation
 * ```ts
 * const trap = useFocusTrap(panel)
 *
 * function open () { trap.activate() }
 * function close () { trap.deactivate() }
 * ```
 *
 * @example Explicit initial focus
 * ```ts
 * const cancel = useTemplateRef<HTMLElement>('cancel')
 *
 * // Destructive dialogs should land on the safe action
 * useFocusTrap(panel, { active: isOpen, initial: cancel })
 * ```
 *
 * @example Opt-in Escape
 * ```ts
 * useFocusTrap(panel, {
 *   active: isOpen,
 *   onEscape: event => {
 *     event.preventDefault()
 *     isOpen.value = false
 *   },
 * })
 * ```
 */
export function useFocusTrap (
  target: MaybeElementRef,
  options: UseFocusTrapOptions = {},
): UseFocusTrapReturn {
  const {
    active,
    initial,
    restore = true,
    onEscape,
  } = options

  const isActive = shallowRef(false)

  let previous: FocusTrapElement | null = null
  let entry: FocusTrapElement | null = null

  /**
   * The trap root, or undefined while it is missing or detached.
   *
   * Every DOM branch funnels through here, so #909's "no-op when the root is not
   * in the document" is one check in one place — re-evaluated per keystroke
   * rather than latched at activation.
   */
  function root (): FocusTrapElement | undefined {
    const el = toElement(target)

    return isFocusTrapElement(el) && el.isConnected ? el : undefined
  }

  /**
   * First and last tabbable descendants.
   *
   * Scans inward from both ends and stops at the first hit, so the predicate
   * usually runs twice rather than once per candidate.
   */
  function edges (el: FocusTrapElement): [FocusTrapElement?, FocusTrapElement?] {
    const candidates = [...el.querySelectorAll(FOCUSABLE)]
    const first = candidates.find(tabbable)

    return isUndefined(first) ? [] : [first, candidates.findLast(tabbable)]
  }

  /**
   * Whether the trap owns focus.
   *
   * True when focus is inside the root, and also when focus is nowhere in
   * particular — `null` or `<body>`, which is where a backdrop click or an
   * unmounted trigger leaves it.
   *
   * That deliberately errs toward owning, and the two callers want opposite
   * things from it: `deactivate()` needs it so a blur to `<body>` still
   * restores, while `onEscape` pays for it by firing on every engaged trap when
   * focus sits on `<body>`. Gate `onEscape` on a `useStack` ticket when several
   * traps can be engaged at once.
   */
  function owns (el: FocusTrapElement): boolean {
    const focused = getActiveElement()

    if (isNull(focused)) return true
    if (IN_BROWSER && focused === document.body) return true

    return contains(el, focused)
  }

  function enter (el: FocusTrapElement) {
    if (initial === false) return

    const explicit = toElement(initial)

    if (isFocusTrapElement(explicit) && explicit.isConnected) {
      explicit.focus()

      // `focus()` on a non-focusable node (a plain `<div>` with no `tabindex`)
      // is a silent no-op, which would leave focus outside the trap with nothing
      // to retry it. Confirm it landed before trusting the explicit target.
      if (contains(explicit, getActiveElement())) return
    }

    // No tabbable descendants — hold focus on the root, which only lands if the
    // consumer rendered `tabindex="-1"` on it.
    ;(edges(el)[0] ?? el).focus()
  }

  function activate () {
    if (isActive.value) return

    // Capture before anything re-renders: by post-flush the trigger may already
    // be unmounted and focus reset to <body>.
    const focused = getActiveElement()
    previous = isFocusTrapElement(focused) && focused.isConnected ? focused : null

    entry = null
    isActive.value = true
  }

  function deactivate () {
    if (!isActive.value) return

    isActive.value = false

    const el = previous
    previous = null

    if (!restore) return

    const current = root()

    // Something outside already claimed focus while the trap was closing.
    if (!isUndefined(current) && !owns(current)) return

    if (!isNull(el) && el.isConnected) {
      el.focus()
      return
    }

    // The restore target unmounted while trapped. `document.body.focus()` is a
    // no-op (body takes focus only with a tabindex), so blur instead: that
    // resets activeElement to <body> for real and the next Tab restarts from the
    // top of the document.
    const focused = getActiveElement()

    if (isFocusTrapElement(focused) && !isUndefined(current) && contains(current, focused)) {
      focused.blur()
    }
  }

  function onKeydown (event: KeyboardEvent) {
    if (!isActive.value) return
    // Honours a `preventDefault()` from an earlier capture-phase listener, which
    // includes an outer trap — so nested traps resolve outward-first. It cannot
    // honour a handler *inside* the root: capture on `document` runs first.
    if (event.defaultPrevented) return
    // Escape and Tab both terminate IME composition; hijacking them breaks
    // composed input.
    if (event.isComposing) return

    const el = root()
    if (isUndefined(el)) return

    if (event.key === 'Escape') {
      if (isUndefined(onEscape)) return
      // Don't hijack Escape for a widget the trap does not own.
      if (!owns(el)) return

      onEscape(event)
      return
    }

    if (event.key !== 'Tab') return
    // Ctrl/Alt/Meta+Tab belong to the browser and the OS.
    if (event.ctrlKey || event.altKey || event.metaKey) return

    const focused = getActiveElement()
    const [first, last] = edges(el)

    // Focus is outside the root: a backdrop click blurred to <body>, a
    // third-party script called focus(), or `initial: false` never pulled it in.
    // A root-bound listener would never see this keystroke — recover by entering
    // at the edge the keypress was heading toward.
    if (isNull(focused) || !contains(el, focused)) {
      event.preventDefault()
      ;((event.shiftKey ? last : first) ?? el).focus()
      return
    }

    // Nothing tabbable inside. preventDefault alone contains focus; the
    // root.focus() only lands if the consumer gave the root a tabindex.
    if (isUndefined(first) || isUndefined(last)) {
      event.preventDefault()
      el.focus()
      return
    }

    // Order, not identity. An identity test (`focused === last`) leaks: focus
    // parked on a script-focusable `tabindex="-1"` descendant that sits *after*
    // the last tabbable is not the edge, yet the browser's next stop from there
    // is outside the root. So wrap whenever nothing tabbable remains in the
    // direction of travel — focused is at-or-past the edge. The root itself
    // falls out of this for free, since it precedes every descendant.
    if (event.shiftKey && (focused === first || follows(focused, first))) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && (focused === last || follows(last, focused))) {
      event.preventDefault()
      first.focus()
    }
  }

  useToggleScope(isActive, () => {
    // Capture phase on document — see the `@remarks` on useFocusTrap.
    useDocumentEventListener('keydown', onKeydown, true)

    // Post-flush so the root's children exist (the `nextTick` a hand-rolled trap
    // has to await), and re-evaluated so a root that mounts a tick later still
    // gets focus.
    //
    // The latch is the root's identity, not a boolean: a root swapped while the
    // trap stays engaged — `<div v-if="open" :key="step">` in a wizard, a portal
    // re-mount — is a new element that has never been entered, and a boolean
    // would leave focus stranded on <body> until the next Tab recovered it.
    watchEffect(() => {
      const el = root()

      if (isUndefined(el) || el === entry) return

      entry = el
      enter(el)
    }, { flush: 'post' })
  })

  if (!isUndefined(active)) {
    // Default (pre) flush: the callback runs before the DOM updates in the same
    // flush, so activate() still sees the trigger mounted and focused.
    watch(() => toValue(active), value => {
      if (value) activate()
      else deactivate()
    }, { immediate: true })
  }

  onScopeDispose(deactivate, true)

  return {
    isActive: shallowReadonly(isActive),
    activate,
    deactivate,
    onKeydown,
  }
}

export { type FocusTrapElement } from './tabbable'
