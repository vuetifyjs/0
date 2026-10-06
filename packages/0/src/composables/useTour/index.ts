/**
 * @module useTour
 *
 * @see https://0.vuetifyjs.com/composables/plugins/use-tour
 *
 * @remarks
 * Headless guided-tour sequencer. Owns one step collection, an activator
 * registry, a form gate on next/jump, programmatic activate/deactivate,
 * isReady gating, and per-step enter/leave/completed handlers plus events.
 *
 * Highlight, anchored content, and keyboard live on the Tour compound,
 * which reads this context. `createTourPlugin()` provides one tour for the
 * app. The app owns the catalog and loads one tour at a time. Progress,
 * routing, and skipOnMobile filtering stay there too.
 *
 * Built on createStep, createRegistry, and createForm. Collection membership
 * is `steps.onboard` / `steps.register` — there is no `items` option.
 *
 * @example
 * ```ts
 * import { createTour } from '@vuetify/v0'
 *
 * const tour = createTour()
 * tour.steps.onboard([
 *   { id: 'search', enter: ({ done, activate }) => {
 *     const el = document.querySelector('[data-tour="search"]')
 *     if (el) activate(el)
 *     done()
 *   } },
 *   { id: 'settings' },
 * ])
 * tour.start()
 * await tour.next()
 * tour.complete()
 * ```
 */

// Composables
import { useContext } from '#v0/composables/createContext'
import { createForm } from '#v0/composables/createForm'
import { bindPluginContext, createPlugin } from '#v0/composables/createPlugin'
import { createRegistry } from '#v0/composables/createRegistry'
import { createStep } from '#v0/composables/createStep'
import { createTrinity } from '#v0/composables/createTrinity'
import { useHydration } from '#v0/composables/useHydration'
import { useLogger } from '#v0/composables/useLogger'

// Transformers
import { toElement } from '#v0/composables/toElement'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { getActiveElement, isFunction, isThenable, isUndefined } from '#v0/utilities'
import { effectScope, getCurrentInstance, hasInjectionContext, onMounted, onScopeDispose, shallowRef, toRef, watch } from 'vue'

// Types
import type { FormContext } from '#v0/composables/createForm'
import type { Plugin } from '#v0/composables/createPlugin'
import type { RegistryContext, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { StepContext, StepTicket, StepTicketInput } from '#v0/composables/createStep'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { MaybeElementRef } from '#v0/composables/toElement'
import type { ID } from '#v0/types'
import type { EffectScope, Ref, ShallowRef } from 'vue'

export type TourDirection = 'forward' | 'back' | 'resume' | 'jump'

/** Placement `Tour.Content` honors. Any other string is ignored at runtime. */
export type TourPlacement = 'top' | 'bottom' | 'left' | 'right' | 'center'

/**
 * Context passed to a step `enter` handler.
 *
 * @example
 * ```ts
 * import { createTour } from '@vuetify/v0'
 *
 * const tour = createTour()
 *
 * tour.steps.register({
 *   id: 'search',
 *   enter: ({ done, activate, direction }) => {
 *     const el = document.querySelector('[data-tour="search"]')
 *     if (el) activate(el)
 *     if (direction === 'back') done()
 *   },
 * })
 * ```
 */
export interface TourEnterContext {
  done: () => void
  /**
   * Token for this entry. Pass it to `tour.ready(stepId, visit)` when the work
   * outlives the handler. A number copy, captured when `enter` starts.
   */
  visit: number
  next: () => Promise<void>
  direction: TourDirection
  activate: (target: MaybeElementRef, options?: TourActivateOptions) => void
  deactivate: () => void
}

/**
 * Options for programmatic `activate()`.
 *
 * @example
 * ```ts
 * import { createTour } from '@vuetify/v0'
 *
 * const tour = createTour()
 * const el = document.querySelector('[data-tour="search"]')
 *
 * if (el) tour.activate(el, { padding: 8, scroll: false })
 * ```
 */
export interface TourActivateOptions {
  padding?: number
  /** @default true */
  scroll?: boolean
}

/**
 * Input type for tour step tickets. Extra fields survive `onboard` / `register`.
 *
 * @example
 * ```ts
 * import { createTour } from '@vuetify/v0'
 *
 * const tour = createTour()
 *
 * tour.steps.onboard([
 *   { id: 'intro', placement: 'bottom', enter: ({ done }) => done() },
 *   { id: 'done', leave: () => {}, completed: () => {} },
 * ])
 * ```
 */
export interface TourTicketInput extends StepTicketInput {
  /** Honored by Tour.Content. Ignored here. */
  placement?: TourPlacement
  /**
   * No target element. Content centers immediately and Highlight paints a full scrim.
   */
  noActivator?: boolean
  enter?: (ctx: TourEnterContext) => void | Promise<void>
  leave?: () => void
  completed?: () => void
}

/**
 * Output type for tour step tickets.
 */
export type TourTicket<Z extends TourTicketInput = TourTicketInput> = StepTicket<Z>

/**
 * Input type for activator tickets, keyed by step id.
 *
 * @example
 * ```ts
 * import { createTour } from '@vuetify/v0'
 *
 * const tour = createTour()
 * const buttonEl = document.querySelector('button')
 *
 * if (buttonEl) tour.activators.register({ id: 'search', element: buttonEl, padding: 8 })
 * ```
 */
export interface TourActivatorTicketInput extends RegistryTicketInput {
  element: MaybeElementRef
  padding?: number
}

/**
 * Output type for activator tickets.
 */
export type TourActivatorTicket<
  Z extends TourActivatorTicketInput = TourActivatorTicketInput,
> = RegistryTicket & Z

export interface TourOptions {}

export interface TourContextOptions extends TourOptions {
  /** Namespace for dependency injection. @default 'v0:tour' */
  namespace?: string
}

export interface TourPluginOptions extends TourContextOptions {
  /** Show this tour in the Vue DevTools v0 inspector. @default false */
  devtools?: boolean
}

/**
 * Context returned by createTour.
 */
export interface TourContext<
  Z extends TourTicketInput = TourTicketInput,
  E extends TourTicket<Z> = TourTicket<Z>,
> {
  steps: StepContext<Z, E>
  activators: RegistryContext<TourActivatorTicketInput, TourActivatorTicket>
  form: FormContext
  isActive: Readonly<ShallowRef<boolean>>
  isComplete: Readonly<ShallowRef<boolean>>
  isReady: Readonly<ShallowRef<boolean>>
  isFirst: Readonly<Ref<boolean>>
  isLast: Readonly<Ref<boolean>>
  canGoBack: Readonly<Ref<boolean>>
  canGoNext: Readonly<Ref<boolean>>
  selectedId: Readonly<Ref<ID | undefined>>
  readonly total: number
  /**
   * Begin the tour. No-op when `!IN_BROWSER`.
   *
   * @example
   * ```ts
   * import { createTour } from '@vuetify/v0'
   *
   * const tour = createTour()
   *
   * tour.start()
   * tour.start({ stepId: 'search' })
   * ```
   */
  start: (options?: { stepId?: ID }) => void
  /**
   * Dismiss without marking complete.
   *
   * @example
   * ```ts
   * import { createTour } from '@vuetify/v0'
   *
   * const tour = createTour()
   *
   * tour.stop()
   * ```
   */
  stop: () => void
  /**
   * Dismiss and mark complete. Emits `completed` for the current step.
   * Resolves after an in-flight `next()` or `step()` finishes that completion,
   * or after its gate drops it.
   *
   * @example
   * ```ts
   * import { createTour } from '@vuetify/v0'
   *
   * const tour = createTour()
   *
   * await tour.complete()
   * ```
   */
  complete: () => Promise<void>
  /**
   * Stop, reset the form, and clear steps and activators.
   *
   * @example
   * ```ts
   * import { createTour } from '@vuetify/v0'
   *
   * const tour = createTour()
   *
   * tour.reset()
   * ```
   */
  reset: () => void
  /**
   * Advance one step. No-op while inactive, unready, or on the last step.
   * Validates the current form field when one is registered under this step id.
   *
   * @example
   * ```ts
   * import { createTour } from '@vuetify/v0'
   *
   * const tour = createTour()
   *
   * await tour.next()
   * ```
   */
  next: () => Promise<void>
  /**
   * Move back one step. No-op while inactive, unready, or on the first step.
   * Does not validate and does not emit `completed`.
   *
   * @example
   * ```ts
   * import { createTour } from '@vuetify/v0'
   *
   * const tour = createTour()
   *
   * await tour.prev()
   * ```
   */
  prev: () => Promise<void>
  /**
   * Jump to a 1-based step index. Validates when leaving a form step.
   *
   * @example
   * ```ts
   * import { createTour } from '@vuetify/v0'
   *
   * const tour = createTour()
   *
   * await tour.step(3)
   * ```
   */
  step: (index: number) => Promise<void>
  /**
   * Register a programmatic activator for the current step.
   *
   * @example
   * ```ts
   * import { createTour } from '@vuetify/v0'
   *
   * const tour = createTour()
   * const el = document.querySelector('[data-tour="search"]')
   *
   * if (el) tour.activate(el, { scroll: false })
   * ```
   */
  activate: (target: MaybeElementRef, options?: TourActivateOptions) => void
  /**
   * Unregister the programmatic activator and restore `anchor-name`.
   *
   * @example
   * ```ts
   * import { createTour } from '@vuetify/v0'
   *
   * const tour = createTour()
   *
   * tour.deactivate()
   * ```
   */
  deactivate: () => void
  /**
   * Mark this entry ready from outside the handler. No-op unless the tour is
   * active, `stepId` is still selected, and `visit` is the token from that
   * entry's context.
   *
   * @example
   * ```ts
   * import { createTour } from '@vuetify/v0'
   *
   * const tour = createTour()
   *
   * tour.steps.register({
   *   id: 'search',
   *   enter: ({ visit }) => {
   *     void fetch('/ready').then(() => tour.ready('search', visit))
   *   },
   * })
   * ```
   */
  ready: (stepId: ID, visit: number) => void
}

interface Programmatic {
  id: ID
  element: HTMLElement | SVGElement
  previous: string
  top: string
  bottom: string
  owned: boolean
}

/**
 * Creates a new tour instance.
 *
 * @param options Factory options. Collection membership is `steps.onboard` / `steps.register`.
 * @returns A tour context with steps, activators, form, and navigation.
 *
 * @example
 * ```ts
 * import { createTour } from '@vuetify/v0'
 *
 * const tour = createTour()
 *
 * tour.steps.onboard([{ id: 'intro' }, { id: 'done' }])
 * tour.start()
 * ```
 */
export function createTour<
  Z extends TourTicketInput = TourTicketInput,
  E extends TourTicket<Z> = TourTicket<Z>,
> (_options: TourOptions = {}): TourContext<Z, E> {
  const logger = useLogger()
  const steps = createStep<Z, E>({ events: true, reactive: true })
  const activators = createRegistry<TourActivatorTicketInput, TourActivatorTicket>({ reactive: true })
  const form = createForm()

  const isActive = shallowRef(false)
  const isComplete = shallowRef(false)
  const isReady = shallowRef(false)

  const isFirst = toRef(() => steps.selectedIndex.value === 0)
  const isLast = toRef(() => steps.size > 0 && steps.selectedIndex.value === steps.size - 1)
  const canGoBack = toRef(() => isReady.value && !isFirst.value)
  const canGoNext = toRef(() => isReady.value && !isLast.value)

  let generation = 0
  let navigating = false
  let leaving = false
  let instead = false
  let scope: EffectScope | undefined
  let programmatic: Programmatic | undefined
  let opener: HTMLElement | undefined
  let held: { stepId?: ID } | undefined
  let latched = false
  let flight: Promise<void> | undefined
  // Bumped when a running next/step/complete is retired. Its finally must
  // not unlock the navigation that replaced it.
  let epoch = 0
  let unwatch: (() => void) | undefined
  let submitting = false
  let departed = false

  function abort () {
    held = undefined
    unwatch?.()
    unwatch = undefined
  }

  function remember () {
    if (!IN_BROWSER || !isUndefined(opener)) return

    const active = getActiveElement()
    if (active instanceof HTMLElement && active.isConnected && active !== document.body) {
      opener = active
    }
  }

  function restore () {
    const el = opener
    opener = undefined
    if (isUndefined(el) || !el.isConnected) return

    el.focus({ preventScroll: true })
  }

  function end () {
    instead = false
    finish()
    // completed() may have stopped the tour. next() honors that and does
    // not leave again or mark complete. end() follows the same rule.
    if (!isActive.value) return
    leave()
    isActive.value = false
    isComplete.value = true
    restore()
  }

  // Complete without a second finish(). `left` skips leave() — the
  // caller is the tail that just ran it, and leave() must not nest.
  function dismiss (left: boolean) {
    instead = false
    if (!left) leave()
    isActive.value = false
    isComplete.value = true
    restore()
  }

  function ready (stepId: ID, visit: number) {
    if (!isActive.value) return
    if (visit !== generation) return
    if (stepId !== steps.selectedId.value) return
    isReady.value = true
  }

  function resolve (target: MaybeElementRef): HTMLElement | SVGElement | undefined {
    const found = toElement(target)
    if (found instanceof HTMLElement) return found
    if (typeof SVGElement !== 'undefined' && found instanceof SVGElement) return found
    return undefined
  }

  function activate (target: MaybeElementRef, options?: TourActivateOptions) {
    if (!IN_BROWSER || !isActive.value) return

    const id = steps.selectedId.value
    if (isUndefined(id)) {
      logger.warn('createTour: activate() requires a selected step')
      return
    }

    const element = resolve(target)
    if (isUndefined(element)) {
      logger.warn('createTour: activate() target not found')
      return
    }

    deactivate()

    const previous = element.style.getPropertyValue('anchor-name')
    const top = element.style.scrollMarginTop
    const bottom = element.style.scrollMarginBottom
    element.style.setProperty('anchor-name', `--tour-${id}`)
    element.style.scrollMarginTop = '100px'
    element.style.scrollMarginBottom = '100px'

    const owned = !activators.has(id)
    if (owned) {
      activators.register({ id, element, padding: options?.padding })
    }

    programmatic = { id, element, previous, top, bottom, owned }

    if (options?.scroll !== false) {
      element.scrollIntoView({ block: 'center', behavior: 'instant' })
    }
  }

  function deactivate () {
    if (isUndefined(programmatic)) return

    const { id, element, previous, top, bottom, owned } = programmatic
    if (previous) {
      element.style.setProperty('anchor-name', previous)
    } else {
      element.style.removeProperty('anchor-name')
    }
    element.style.scrollMarginTop = top
    element.style.scrollMarginBottom = bottom

    if (owned) {
      activators.unregister(id)
    }

    programmatic = undefined
  }

  function leave () {
    if (leaving) return

    leaving = true
    departed = true
    try {
      generation++
      const ticket = steps.selectedItem.value
      if (!isUndefined(ticket)) {
        steps.emit('leave', ticket)
      }
      if (isFunction(ticket?.leave)) {
        ticket.leave()
      }
    } finally {
      // The hook can throw. Cleanup still has to drop the anchor, and
      // `leaving` has to clear or begin() never starts again.
      try {
        scope?.stop()
        scope = undefined
        deactivate()
        isReady.value = false
      } finally {
        leaving = false
      }
    }
  }

  function enter (direction: TourDirection) {
    departed = false
    const ticket = steps.selectedItem.value
    const token = ++generation

    function done () {
      if (isUndefined(ticket)) return
      ready(ticket.id, token)
    }

    function pin (target: MaybeElementRef, options?: TourActivateOptions) {
      if (token !== generation) return
      activate(target, options)
    }

    function unpin () {
      if (token !== generation) return
      deactivate()
    }

    const handler = ticket?.enter
    if (isUndefined(ticket) || !isFunction(handler)) {
      isReady.value = true
      if (!isUndefined(ticket)) steps.emit('enter', ticket)
      return
    }

    isReady.value = false
    scope = effectScope()
    scope.run(() => {
      const ctx: TourEnterContext = {
        done,
        visit: token,
        next: async () => {
          if (token !== generation) return
          await next()
        },
        direction,
        activate: pin,
        deactivate: unpin,
      }

      try {
        const result = handler(ctx)
        if (isThenable(result)) {
          result.then(() => done(), error => {
            logger.warn('createTour: enter rejected', error)
            done()
          })
        } else if (handler.length === 0) {
          done()
        }
      } catch (error) {
        logger.warn('createTour: enter threw', error)
        done()
      }
    })

    steps.emit('enter', ticket)
  }

  function finish () {
    const ticket = steps.selectedItem.value
    if (isUndefined(ticket)) return
    if (isFunction(ticket.completed)) {
      ticket.completed()
    }
    steps.emit('completed', ticket)
  }

  async function gate (): Promise<boolean> {
    const id = steps.selectedId.value
    if (isUndefined(id) || !form.has(id)) return true

    // True only while submit() is on the stack. complete() from inside
    // submit must not await this navigation — that cycle never settles.
    submitting = true
    let pending: Promise<boolean> | boolean
    try {
      pending = form.submit(id)
    } catch (error) {
      logger.warn('createTour: form submit failed', error)
      return false
    } finally {
      submitting = false
    }

    try {
      return await pending
    } catch (error) {
      logger.warn('createTour: form submit failed', error)
      return false
    }
  }

  function begin (options: { stepId?: ID } = {}) {
    // leave() is still on the stack. Selecting here changes the step the
    // outer next/prev/step then moves from, and that leave() stops the
    // enter this start just opened.
    if (leaving) return

    if (steps.size === 0) {
      if (isActive.value) {
        leave()
        isActive.value = false
        restore()
      }
    } else if (isActive.value) {
      leave()
    }

    // After leave(), so a hook that calls complete() still sees this
    // navigation and does not start a second one. That hook may set
    // instead for the navigation this start replaces.
    instead = false
    epoch++
    navigating = false
    flight = undefined

    if (steps.size === 0) return

    remember()
    isComplete.value = false
    isActive.value = true

    const id = options.stepId
    if (!isUndefined(id) && steps.has(id)) {
      steps.select(id)
      enter('resume')
      return
    }

    steps.first()
    enter('forward')
  }

  function queueMounted (options: { stepId?: ID }) {
    held = options
    if (latched) return

    latched = true
    onMounted(() => {
      latched = false
      if (isUndefined(held)) return
      const queued = held
      held = undefined
      begin(queued)
    })
    // Clears the latch only. A tour that already started must keep running
    // when this child unmounts.
    onScopeDispose(() => {
      held = undefined
      latched = false
      unwatch?.()
      unwatch = undefined
    })
  }

  function queueHydration (options: { stepId?: ID }) {
    held = options
    if (!isUndefined(unwatch)) return

    const hydration = useHydration()
    unwatch = watch(hydration.isHydrated, hydrated => {
      if (!hydrated || isUndefined(held)) return
      const queued = held
      held = undefined
      unwatch?.()
      unwatch = undefined
      begin(queued)
    })
  }

  function start (options: { stepId?: ID } = {}) {
    if (!IN_BROWSER) return

    // setup() runs before hydration. Applying isActive here would render
    // Highlight and activator state the server HTML does not have.
    const instance = getCurrentInstance()
    if (instance && !instance.isMounted) {
      queueMounted(options)
      return
    }

    // No instance, but a hydration plugin that has not settled yet
    // (app.runWithContext, or a call from outside setup). The fallback
    // context is already hydrated, so apps without the plugin stay sync.
    if (!instance && hasInjectionContext() && !useHydration().isHydrated.value) {
      queueHydration(options)
      return
    }

    begin(options)
  }

  function stop () {
    instead = false
    abort()
    if (!isActive.value) {
      epoch++
      navigating = false
      flight = undefined
      return
    }

    try {
      // leave() already ran for this visit (prev, or a hook that stopped
      // from inside leave). A second leave repeats the step hook.
      if (!departed) leave()
    } finally {
      // A throwing leave hook must still end the tour and retire the
      // in-flight navigation. The throw propagates after this.
      isActive.value = false
      restore()
      epoch++
      navigating = false
      flight = undefined
    }
  }

  async function complete () {
    abort()

    if (!isActive.value) {
      isComplete.value = true
      restore()
      return
    }

    if (navigating) {
      instead = true
      if (submitting || isUndefined(flight)) return
      return flight
    }

    navigating = true
    const token = generation
    const mine = epoch
    // Published before the body. form.submit() runs before gate()
    // awaits, and a restart there must replace this flight, not lose
    // the replacement when this body returns.
    const settled: {
      resolve?: () => void
      reject?: (error: unknown) => void
    } = {}
    const run = new Promise<void>((resolve, reject) => {
      settled.resolve = resolve
      settled.reject = reject
    })
    flight = run
    void (async () => {
      let failed = false
      try {
        if (!await gate()) {
          if (mine === epoch) instead = false
          return
        }
        if (token !== generation || !isActive.value) {
          if (mine === epoch) instead = false
          return
        }

        end()
      } catch (error) {
        failed = true
        settled.reject?.(error)
      } finally {
        if (mine === epoch) {
          navigating = false
          flight = undefined
        }
        // Early returns above skip anything after this try. Resolve here.
        if (!failed) settled.resolve?.()
      }
    })()
    return run
  }

  function reset () {
    stop()
    form.reset()
    steps.clear()
    activators.clear()
    isComplete.value = false
    isReady.value = false
  }

  async function next () {
    if (leaving || navigating || !isActive.value || !isReady.value || isLast.value) return

    navigating = true
    const token = generation
    const mine = epoch
    // Flight is published before the body, same as complete().
    const settled: {
      resolve?: () => void
      reject?: (error: unknown) => void
    } = {}
    const run = new Promise<void>((resolve, reject) => {
      settled.resolve = resolve
      settled.reject = reject
    })
    flight = run
    void (async () => {
      let failed = false
      try {
        if (!await gate()) {
          if (mine === epoch) instead = false
          return
        }
        // stop/start/reset during validation invalidates this navigation.
        // A second next() during the await is dropped by `navigating`.
        // complete() during the await sets instead and must not gate again.
        if (token !== generation || !isActive.value) {
          if (mine === epoch) instead = false
          return
        }
        if (instead) {
          end()
          return
        }
        if (!isReady.value || isLast.value) return

        finish()
        if (!isActive.value) return
        if (instead) {
          dismiss(false)
          return
        }

        leave()
        if (!isActive.value) return
        if (instead) {
          dismiss(true)
          return
        }

        steps.next()
        enter('forward')
      } catch (error) {
        failed = true
        settled.reject?.(error)
      } finally {
        if (mine === epoch) {
          navigating = false
          flight = undefined
        }
        // Early returns above skip anything after this try. Resolve here.
        if (!failed) settled.resolve?.()
      }
    })()
    return run
  }

  async function prev () {
    if (leaving || navigating || !isActive.value || !isReady.value || isFirst.value) return

    // navigating so complete() during leave sets `instead` and does not
    // start its own gate. Cleared before enter so a fresh ctx.next can run.
    navigating = true
    let stopped = false
    try {
      leave()
      if (!isActive.value) {
        stopped = true
      } else if (instead) {
        // Back does not emit completed. An explicit complete() from leave does.
        instead = false
        finish()
        if (isActive.value) dismiss(true)
        stopped = true
      }
    } finally {
      navigating = false
    }

    if (stopped) return

    steps.prev()
    enter('back')
  }

  async function step (index: number) {
    if (leaving || navigating || !isActive.value || !isReady.value) return

    const id = steps.lookup(index - 1)
    if (isUndefined(id) || id === steps.selectedId.value) return

    navigating = true
    const token = generation
    const mine = epoch
    // Flight is published before the body, same as complete().
    const settled: {
      resolve?: () => void
      reject?: (error: unknown) => void
    } = {}
    const run = new Promise<void>((resolve, reject) => {
      settled.resolve = resolve
      settled.reject = reject
    })
    flight = run
    void (async () => {
      let failed = false
      try {
        if (!await gate()) {
          if (mine === epoch) instead = false
          return
        }
        if (token !== generation || !isActive.value) {
          if (mine === epoch) instead = false
          return
        }
        if (instead) {
          end()
          return
        }
        if (!isReady.value || id === steps.selectedId.value) return

        finish()
        if (!isActive.value) return
        if (instead) {
          dismiss(false)
          return
        }

        leave()
        if (!isActive.value) return
        if (instead) {
          dismiss(true)
          return
        }

        steps.select(id)
        enter('jump')
      } catch (error) {
        failed = true
        settled.reject?.(error)
      } finally {
        if (mine === epoch) {
          navigating = false
          flight = undefined
        }
        // Early returns above skip anything after this try. Resolve here.
        if (!failed) settled.resolve?.()
      }
    })()
    return run
  }

  onScopeDispose(() => {
    abort()
    if (isActive.value) {
      leave()
      isActive.value = false
      restore()
      return
    }

    scope?.stop()
    scope = undefined
    deactivate()
  }, true)

  return {
    steps,
    activators,
    form,
    isActive,
    isComplete,
    isReady,
    isFirst,
    isLast,
    canGoBack,
    canGoNext,
    selectedId: steps.selectedId,
    get total () {
      return steps.size
    },
    start,
    stop,
    complete,
    reset,
    next,
    prev,
    step,
    activate,
    deactivate,
    ready,
  }
}

/**
 * Creates a tour context with dependency injection support.
 *
 * @param options Configuration options including namespace
 * @returns Trinity tuple: [useTour, provideTour, defaultTour]
 *
 * @example
 * ```ts
 * import { createTourContext } from '@vuetify/v0'
 *
 * const [useTour, provideTour, tour] = createTourContext({
 *   namespace: 'v0:tour',
 * })
 *
 * provideTour()
 * ```
 */
export function createTourContext<
  Z extends TourTicketInput = TourTicketInput,
  E extends TourTicket<Z> = TourTicket<Z>,
> (_options: TourContextOptions = {}): ContextTrinity<TourContext<Z, E>> {
  const {
    namespace = 'v0:tour',
    ...options
  } = _options

  const context = createTour<Z, E>(options)

  return createTrinity<TourContext<Z, E>>(namespace, context)
}

/**
 * Installs one tour on the app. `useTour()` reads it during component setup.
 * A local `provide` from `createTourContext` shadows it for that subtree.
 *
 * The plugin does not store a catalog. Stop the running tour, clear its
 * steps, and onboard the next tour's steps. Leave activators registered.
 * `reset()` clears those too.
 *
 * @example
 * ```ts
 * import { createTourPlugin } from '@vuetify/v0'
 *
 * app.use(createTourPlugin())
 * ```
 */
export function createTourPlugin (_options: TourPluginOptions = {}): Plugin {
  const {
    namespace = 'v0:tour',
    devtools,
    ...options
  } = _options

  return createPlugin({
    namespace,
    devtools: devtools === true,
    provide: app => {
      const [, provideTour, context] = createTourContext({ ...options, namespace })
      provideTour(context, app)
      bindPluginContext(app, namespace, context)
    },
  })
}

/**
 * Returns the current tour context from dependency injection.
 *
 * @param namespace The namespace for the tour context. Defaults to `v0:tour`.
 * @returns The current tour context.
 *
 * @throws An error if the tour context is not found and no default is provided.
 *
 * @example
 * ```ts
 * import { useTour } from '@vuetify/v0'
 *
 * const tour = useTour()
 *
 * await tour.next()
 * ```
 */
export function useTour<
  Z extends TourTicketInput = TourTicketInput,
  E extends TourTicket<Z> = TourTicket<Z>,
> (namespace = 'v0:tour'): TourContext<Z, E> {
  return useContext<TourContext<Z, E>>(namespace)
}
