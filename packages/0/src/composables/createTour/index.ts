/**
 * @module createTour
 *
 * @see https://0.vuetifyjs.com/composables/semantic/create-tour
 *
 * @remarks
 * Headless guided-tour sequencer. Owns one step collection, an activator
 * registry, a form gate on next/jump, programmatic activate/deactivate,
 * isReady gating, and per-step enter/leave/completed handlers plus events.
 *
 * Visual chrome (highlight, content, keyboard) belongs to a later Tour.*
 * compound. Catalog, progress, routing, and skipOnMobile filtering stay in
 * the consuming app.
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
import { createRegistry } from '#v0/composables/createRegistry'
import { createStep } from '#v0/composables/createStep'
import { createTrinity } from '#v0/composables/createTrinity'
import { useLogger } from '#v0/composables/useLogger'

// Transformers
import { toElement } from '#v0/composables/toElement'

// Globals
import { IN_BROWSER } from '#v0/constants/globals'

// Utilities
import { isElement, isFunction, isThenable, isUndefined } from '#v0/utilities'
import { effectScope, onScopeDispose, shallowRef, toRef } from 'vue'

// Types
import type { FormContext } from '#v0/composables/createForm'
import type { RegistryContext, RegistryTicket, RegistryTicketInput } from '#v0/composables/createRegistry'
import type { StepContext, StepTicket, StepTicketInput } from '#v0/composables/createStep'
import type { ContextTrinity } from '#v0/composables/createTrinity'
import type { MaybeElementRef } from '#v0/composables/toElement'
import type { ID } from '#v0/types'
import type { EffectScope, Ref, ShallowRef } from 'vue'

export type TourDirection = 'forward' | 'back' | 'resume' | 'jump'

/**
 * Context passed to a step `enter` handler.
 *
 * @example
 * ```ts
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
 * tour.activate(el, { padding: 8, scroll: false })
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
 * tour.steps.onboard([
 *   { id: 'intro', placement: 'bottom', enter: ({ done }) => done() },
 *   { id: 'done', leave: () => {}, completed: () => {} },
 * ])
 * ```
 */
export interface TourTicketInput extends StepTicketInput {
  /** Opaque passthrough for Tour.Content; not interpreted here. */
  placement?: string
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
 * tour.activators.register({ id: 'search', element: buttonEl, padding: 8 })
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
   * tour.stop()
   * ```
   */
  stop: () => void
  /**
   * Dismiss and mark complete. Emits `completed` for the current step.
   *
   * @example
   * ```ts
   * tour.complete()
   * ```
   */
  complete: () => void
  /**
   * Stop, reset the form, and clear steps and activators.
   *
   * @example
   * ```ts
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
   * await tour.prev()
   * ```
   */
  prev: () => Promise<void>
  /**
   * Jump to a 1-based step index. Validates when leaving a form step.
   *
   * @example
   * ```ts
   * await tour.step(3)
   * ```
   */
  step: (index: number) => Promise<void>
  /**
   * Register a programmatic activator for the current step.
   *
   * @example
   * ```ts
   * tour.activate(el, { scroll: false })
   * ```
   */
  activate: (target: MaybeElementRef, options?: TourActivateOptions) => void
  /**
   * Unregister the programmatic activator and restore `anchor-name`.
   *
   * @example
   * ```ts
   * tour.deactivate()
   * ```
   */
  deactivate: () => void
  /**
   * Public alias of enter-context `done()`. Sets `isReady` when the tour is active.
   *
   * @example
   * ```ts
   * tour.ready()
   * ```
   */
  ready: () => void
}

interface Programmatic {
  id: ID
  element: HTMLElement
  previous: string
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
 * const tour = createTour()
 * tour.steps.onboard([{ id: 'intro' }, { id: 'done' }])
 * tour.start()
 * ```
 */
export function createTour (_options: TourOptions = {}): TourContext {
  const logger = useLogger()
  const steps = createStep<TourTicketInput, TourTicket>({ events: true, reactive: true })
  const activators = createRegistry<TourActivatorTicketInput, TourActivatorTicket>()
  const form = createForm()

  const isActive = shallowRef(false)
  const isComplete = shallowRef(false)
  const isReady = shallowRef(false)

  const isFirst = toRef(() => steps.selectedIndex.value === 0)
  const isLast = toRef(() => steps.size > 0 && steps.selectedIndex.value === steps.size - 1)
  const canGoBack = toRef(() => isReady.value && !isFirst.value)
  const canGoNext = toRef(() => isReady.value && !isLast.value)

  let generation = 0
  let scope: EffectScope | undefined
  let programmatic: Programmatic | undefined

  function ready () {
    if (!isActive.value) return
    isReady.value = true
  }

  function resolve (target: MaybeElementRef): HTMLElement | undefined {
    const found = toElement(target)
    if (!isElement(found)) return undefined
    return found as HTMLElement
  }

  function activate (target: MaybeElementRef, options?: TourActivateOptions) {
    if (!IN_BROWSER) return

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
    element.style.setProperty('anchor-name', `--tour-${id}`)

    const owned = !activators.has(id)
    if (owned) {
      activators.register({ id, element, padding: options?.padding })
    }

    programmatic = { id, element, previous, owned }

    if (options?.scroll !== false) {
      element.scrollIntoView({ block: 'center', behavior: 'instant' })
    }
  }

  function deactivate () {
    if (isUndefined(programmatic)) return

    const { id, element, previous, owned } = programmatic
    if (previous) {
      element.style.setProperty('anchor-name', previous)
    } else {
      element.style.removeProperty('anchor-name')
    }

    if (owned) {
      activators.unregister(id)
    }

    programmatic = undefined
  }

  function leave () {
    generation++
    const ticket = steps.selectedItem.value
    if (ticket) {
      steps.emit('leave', ticket)
    }
    if (isFunction(ticket?.leave)) {
      ticket.leave()
    }
    scope?.stop()
    scope = undefined
    deactivate()
    isReady.value = false
  }

  function enter (direction: TourDirection) {
    const ticket = steps.selectedItem.value
    const token = ++generation

    function done () {
      if (token !== generation) return
      ready()
    }

    const handler = ticket?.enter
    if (!ticket || !isFunction(handler)) {
      isReady.value = true
      if (ticket) steps.emit('enter', ticket)
      return
    }

    isReady.value = false
    scope = effectScope()
    scope.run(() => {
      const ctx: TourEnterContext = {
        done,
        next,
        direction,
        activate,
        deactivate,
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
    if (!ticket) return
    if (isFunction(ticket.completed)) {
      ticket.completed()
    }
    steps.emit('completed', ticket)
  }

  async function gate (): Promise<boolean> {
    const id = steps.selectedId.value
    if (isUndefined(id) || !form.has(id)) return true
    try {
      return await form.submit(id)
    } catch (error) {
      logger.warn('createTour: form submit failed', error)
      return false
    }
  }

  function start (options: { stepId?: ID } = {}) {
    if (!IN_BROWSER) return
    if (isActive.value) {
      leave()
    }

    isComplete.value = false
    isActive.value = true

    const stepId = options.stepId
    if (!isUndefined(stepId) && steps.has(stepId)) {
      steps.select(stepId)
      enter('resume')
      return
    }

    steps.first()
    enter('forward')
  }

  function stop () {
    if (!isActive.value) return
    leave()
    isActive.value = false
  }

  function complete () {
    if (isActive.value) {
      finish()
      leave()
      isActive.value = false
    }
    isComplete.value = true
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
    if (!isActive.value || !isReady.value || isLast.value) return
    if (!await gate()) return
    finish()
    leave()
    steps.next()
    enter('forward')
  }

  async function prev () {
    if (!isActive.value || !isReady.value || isFirst.value) return
    leave()
    steps.prev()
    enter('back')
  }

  async function step (index: number) {
    if (!isActive.value || !isReady.value) return
    const id = steps.lookup(index - 1)
    if (isUndefined(id) || id === steps.selectedId.value) return
    if (!await gate()) return
    finish()
    leave()
    steps.select(id)
    enter('jump')
  }

  onScopeDispose(() => {
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
 * const [useTour, provideTour, tour] = createTourContext({
 *   namespace: 'v0:tour',
 * })
 *
 * provideTour()
 * ```
 */
export function createTourContext (_options: TourContextOptions = {}): ContextTrinity<TourContext> {
  const {
    namespace = 'v0:tour',
    ...options
  } = _options

  const context = createTour(options)

  return createTrinity<TourContext>(namespace, context)
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
 * const tour = useTour()
 * await tour.next()
 * ```
 */
export function useTour (namespace = 'v0:tour'): TourContext {
  return useContext<TourContext>(namespace)
}
