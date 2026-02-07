/**
 * @module useDiscovery
 *
 * @remarks
 * Composable for managing guided and interactive tours through documentation.
 * Handles tour navigation, step progression, dynamic handler loading,
 * and integration with form validation.
 *
 * Key features:
 * - Unified `enter` handler runs on any step entry (forward, back, resume)
 * - Async handler support via Promise return or `done()` callback
 * - Interactive tour support with `done()` for user-action-driven progression
 * - Form validation integration per step
 * - Activator and root registry for positioning
 *
 * Handler execution:
 * - `enter(ctx)` - Runs when entering a step (any direction)
 * - `leave()` - Runs when leaving a step (any direction)
 * - `completed()` - Runs when step is completed (going forward only)
 *
 * Handler context:
 * - `done()` - Call to signal async setup complete (for interactive tours)
 * - `next()` - Advance to next step (auto-calls done internally)
 * - `direction` - How user arrived: 'forward' | 'back' | 'resume' | 'jump'
 *
 * Async patterns:
 * - Return Promise: `enter: async () => { await setup() }`
 * - Use done(): `enter: ({ done }) => { watchForAction(done) }`
 * - Use next(): `enter: ({ next }) => { watchForAction(next) }` (auto-advances)
 * - Sync (default): `enter: () => { doSetup() }`
 */

// Framework
import { createContext, createForm, createPlugin, createRegistry, createSingle, createStep, createTrinity, IN_BROWSER, isUndefined, useContext } from '@vuetify/v0'

// Utilities
import { effectScope, readonly, shallowRef, toRef } from 'vue'

// Types
import type {
  ContextTrinity,
  FormContext,
  FormValidationRule,
  RegistryTicket,
  RegistryContext,
  StepTicketInput,
  StepContext,
  StepTicket,
  SingleTicket,
  SingleContext,
  SingleTicketInput,
  useBreakpoints,
} from '@vuetify/v0'
import type { ID } from '@vuetify/v0/types'
import type { App, EffectScope, Ref, ShallowRef } from 'vue'

export type DiscoveryActivatorTicket = RegistryTicket & {
  element: ShallowRef<HTMLElement | null>
  padding?: number
}

export type DiscoveryRootTicket = RegistryTicket & {
  disabled: Readonly<Ref<boolean>>
  element: ShallowRef<HTMLElement | null>
}

export type DiscoveryTourStep = {
  id: ID
  title: string
  task: string
  hint?: string
  learn: string
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  placementMobile?: 'top' | 'bottom' | 'left' | 'right' | 'auto'
  /** Step has no activator element - hides highlight and skips activator polling */
  noActivator?: boolean
  /** Skip this step on mobile devices */
  skipOnMobile?: boolean
}

export type DiscoveryTour = {
  mode: 'guided' | 'interactive'
  id: string
  name: string
  level: 1 | 2 | 3
  track: string
  categories: string[]
  order: number
  prerequisites?: string[]
  description: string
  minutes: number
  startRoute: string
  /** Route to navigate to after tour completion */
  completeRoute?: string
  steps: DiscoveryTourStep[]
}

export type DiscoveryStepTicketInput = DiscoveryTourStep & StepTicketInput
export type DiscoveryStepTicket = StepTicket<DiscoveryStepTicketInput>

export type DiscoveryTourTicketInput = SingleTicketInput & DiscoveryTour & {
  rules?: FormValidationRule[]
}

export type DiscoveryTourTicket = SingleTicket<DiscoveryTourTicketInput>

/** Direction of navigation when entering a step */
export type StepDirection = 'forward' | 'back' | 'resume' | 'jump'

/** Context passed to step handlers */
export interface StepHandlerContext {
  /** Call when async setup is complete (for interactive tours) */
  done: () => void
  /** Advance to the next step (auto-calls done internally) */
  next: () => Promise<void>
  /** How the user arrived at this step */
  direction: StepDirection
}

/**
 * Step handler function signature.
 * Supports multiple patterns:
 * - Sync: `() => { doSetup() }`
 * - Async Promise: `async () => { await setup() }`
 * - Async callback: `({ done }) => { watchForAction(done) }`
 * - Auto-advance: `({ next }) => { watchForAction(next) }`
 * - With direction: `({ direction }) => { if (direction === 'back') ... }`
 */
export type StepHandler = (ctx: StepHandlerContext) => void | Promise<void>

/** Simple handler for leave/completed (no async needed) */
export type SimpleHandler = () => void

export type StepHandlers = {
  /** Runs when entering a step (any direction: forward, back, resume, jump) */
  enter?: StepHandler
  /** Runs when leaving a step (any direction) */
  leave?: SimpleHandler
  /** Runs when step is completed successfully (forward only, before leave) */
  completed?: SimpleHandler
}

type HandlersMap = Partial<Record<ID, StepHandlers>>

export interface TourDefinition {
  handlers?: HandlersMap
  exit?: SimpleHandler
}

export interface TourDefinitionModule {
  defineTour: (context?: Record<string, unknown>) => TourDefinition
}

export interface DiscoveryContext {
  activators: RegistryContext<DiscoveryActivatorTicket>
  roots: RegistryContext<DiscoveryRootTicket>
  steps: StepContext<DiscoveryStepTicket>
  tours: SingleContext<DiscoveryTourTicket>
  form: FormContext

  isActive: Readonly<ShallowRef<boolean>>
  isComplete: Readonly<ShallowRef<boolean>>
  isFirst: Readonly<ShallowRef<boolean>>
  isLast: Readonly<ShallowRef<boolean>>
  /** Whether the current step's handler has completed (for interactive tours) */
  isReady: Readonly<ShallowRef<boolean>>
  /** Whether the current tour is interactive mode */
  isInteractive: Readonly<Ref<boolean>>
  canGoBack: Readonly<Ref<boolean>>
  canGoNext: Readonly<Ref<boolean>>
  selectedId: StepContext<DiscoveryStepTicket>['selectedId']
  total: number

  start: (id: ID, options?: { stepId?: ID, context?: Record<string, unknown> }) => Promise<void>
  stop: () => void
  complete: () => void
  reset: () => void
  next: () => Promise<void>
  prev: () => Promise<void>
  step: (index: number) => Promise<void>
}

const globTours = import.meta.glob<DiscoveryTour>(
  '@/skillz/tours/**/index.json',
  { eager: true, import: 'default' },
)

const globTourDefinitions = import.meta.glob<TourDefinitionModule>(
  '@/skillz/tours/**/index.ts',
)

export function createDiscovery (): DiscoveryContext {
  const tours = createSingle<DiscoveryTourTicket>({ events: true })

  tours.onboard(Object.values(globTours))

  const activators = createRegistry<DiscoveryActivatorTicket>()
  const roots = createRegistry<DiscoveryRootTicket>()
  const steps = createStep<DiscoveryStepTicket>({ events: true, reactive: true })
  const form = createForm()

  const isActive = shallowRef(false)
  const isComplete = shallowRef(false)
  const isReady = shallowRef(true)

  const isFirst = toRef(() => steps.selectedIndex.value === 0)
  const isLast = toRef(() => steps.selectedIndex.value === steps.size - 1)
  const canGoBack = toRef(() => isReady.value && steps.selectedIndex.value > 0)
  const canGoNext = toRef(() => isReady.value && steps.selectedIndex.value < steps.size - 1)
  const isInteractive = toRef(() => tours.selectedItem.value?.mode === 'interactive')

  // Handler state
  let handlers: HandlersMap = {}
  let exitHandler: SimpleHandler | undefined
  let stepScope: EffectScope | null = null
  let isStarting = false

  /**
   * Invoke a step handler with async support.
   * Handles three patterns:
   * 1. Sync handler (no done call, no Promise) - resolves immediately
   * 2. Promise return - awaits the Promise
   * 3. done() callback - resolves when done() is called
   */
  async function invokeEnterHandler (
    handler: StepHandler | undefined,
    direction: StepDirection,
  ): Promise<void> {
    // Stop previous step's scope if any
    stepScope?.stop()
    stepScope = null

    if (!handler) {
      isReady.value = true
      return
    }

    isReady.value = false

    // Create effect scope so composables work inside handlers
    stepScope = effectScope()

    return new Promise<void>(resolve => {
      let resolved = false

      function done () {
        if (resolved) return
        resolved = true
        isReady.value = true
        resolve()
      }

      const ctx: StepHandlerContext = {
        done,
        next: async () => {
          done()
          await next()
        },
        direction,
      }

      // Run handler inside effect scope
      stepScope!.run(() => {
        try {
          const result = handler(ctx)

          // If handler returns a Promise, await it then auto-done
          if (result instanceof Promise) {
            result
              .then(() => done())
              .catch(error => {
                console.error('[v0:discovery] Handler error:', error)
                done()
              })
          } else if (handler.length === 0) {
            // Handler takes no arguments - sync handler, auto-done
            done()
          }
          // Otherwise, handler uses done() callback - wait for it
        } catch (error) {
          console.error('[v0:discovery] Handler error:', error)
          done()
        }
      })
    })
  }

  async function onEnter (ticket: DiscoveryStepTicket, direction: StepDirection) {
    // Emit event for external listeners (e.g., tests, debugging)
    steps.emit('enter', ticket)
    // Invoke handler with async support
    const handler = handlers[ticket.id]?.enter
    await invokeEnterHandler(handler, direction)
  }

  function onLeave (ticket: DiscoveryStepTicket) {
    steps.emit('leave', ticket)
    handlers[ticket.id]?.leave?.()
    // Stop step's effect scope to clean up composables
    stepScope?.stop()
    stepScope = null
  }

  function onCompleted (ticket: DiscoveryStepTicket) {
    steps.emit('completed', ticket)
    handlers[ticket.id]?.completed?.()
  }

  async function start (id: ID, options?: { stepId?: ID, context?: Record<string, unknown> }) {
    if (!IN_BROWSER || !tours.has(id) || isStarting) return

    isStarting = true

    try {
      const tour = tours.get(id)
      if (!tour) return

      steps.reset()

      const breakpoints = options?.context?.breakpoints as ReturnType<typeof useBreakpoints>
      const isMobile = breakpoints?.isMobile?.value ?? false
      const filteredSteps = isMobile
        ? tour.steps.filter(step => !step.skipOnMobile)
        : tour.steps

      steps.onboard(filteredSteps)

      const path = Object.keys(globTourDefinitions).find(p => p.includes(`/${id}/`))

      if (path) {
        try {
          const module = await globTourDefinitions[path]()
          if (module?.defineTour) {
            const definition = module.defineTour(options?.context)
            handlers = definition.handlers ?? {}
            exitHandler = definition.exit
          } else {
            console.error(`[v0:discovery] Tour definition for "${id}" missing defineTour export`)
          }
        } catch (error) {
          console.error(`[v0:discovery] Failed to load tour definition for "${id}":`, error)
          // Continue without handlers instead of blocking
        }
      }

      isActive.value = true
      isComplete.value = false

      tour.select()

      // Determine direction based on whether resuming at a specific step
      const direction: StepDirection = options?.stepId ? 'resume' : 'forward'

      // Start at specific step if provided, otherwise first
      if (options?.stepId && steps.has(options.stepId)) {
        steps.select(options.stepId)
      } else {
        steps.first()
      }

      // Run enter handler for initial step
      const initial = steps.selectedItem.value
      if (initial) {
        await onEnter(initial, direction)
      }
    } finally {
      isStarting = false
    }
  }

  function stop () {
    const current = steps.selectedItem.value
    if (current) onLeave(current)
    exitHandler?.()
    handlers = {}
    exitHandler = undefined
    isActive.value = false
    isReady.value = true
  }

  function reset () {
    stepScope?.stop()
    stepScope = null
    handlers = {}
    exitHandler = undefined
    form.reset()
    steps.reset()
    tours.reset()
    isActive.value = false
    isComplete.value = false
    isReady.value = true
  }

  function complete () {
    const current = steps.selectedItem.value
    if (current) onLeave(current)
    exitHandler?.()
    handlers = {}
    exitHandler = undefined
    isActive.value = false
    isComplete.value = true
    isReady.value = true
  }

  async function next () {
    if (!isReady.value) return

    const current = steps.selectedItem.value
    if (!current) return

    if (form.has(current.id)) {
      try {
        const isValid = await form.submit(current.id)
        if (!isValid) return
      } catch (error) {
        console.error('[v0:discovery] Form validation error:', error)
        return
      }
    }

    onCompleted(current)
    onLeave(current)
    steps.next()

    // Run enter handler for new step
    const newItem = steps.selectedItem.value
    if (newItem && newItem.id !== current.id) {
      await onEnter(newItem, 'forward')
    }
  }

  async function prev () {
    if (!isReady.value) return

    const current = steps.selectedItem.value
    if (!current) return

    // Emit back event for current step (for backwards compatibility)
    steps.emit('back', current)
    onLeave(current)
    steps.prev()

    // Run enter handler for new step (same handler, different direction)
    const newItem = steps.selectedItem.value
    if (newItem && newItem.id !== current.id) {
      await onEnter(newItem, 'back')
    }
  }

  async function step (index: number) {
    if (!isReady.value) return

    const current = steps.selectedItem.value
    const id = steps.lookup(index - 1)
    if (isUndefined(id)) return

    // Validate current step before navigating away
    if (current && current.id !== id && form.has(current.id)) {
      try {
        const isValid = await form.submit(current.id)
        if (!isValid) return
      } catch (error) {
        console.error('[v0:discovery] Form validation error:', error)
        return
      }
    }

    // Leave current step if navigating away
    if (current && current.id !== id) {
      onCompleted(current)
      onLeave(current)
    }

    steps.select(id)

    // Run enter handler for new step
    const newItem = steps.selectedItem.value
    if (newItem && (!current || newItem.id !== current.id)) {
      await onEnter(newItem, 'jump')
    }
  }

  return {
    tours,
    activators,
    roots,
    steps,
    form,

    isActive: readonly(isActive),
    isComplete: readonly(isComplete),
    isFirst: readonly(isFirst),
    isLast: readonly(isLast),
    isReady: readonly(isReady),
    isInteractive: readonly(isInteractive),
    canGoBack: readonly(canGoBack),
    canGoNext: readonly(canGoNext),
    selectedId: steps.selectedId,
    get total () {
      return steps.size
    },

    start,
    next,
    prev,
    step,
    stop,
    complete,
    reset,
  }
}

function createDiscoveryContext (): ContextTrinity<DiscoveryContext> {
  const [useDiscoveryContext, _provideDiscoveryContext] = createContext<DiscoveryContext>('v0:discovery')

  const context = createDiscovery()

  function provideDiscoveryContext (_context: DiscoveryContext = context, app?: App): DiscoveryContext {
    return _provideDiscoveryContext(_context, app)
  }

  return createTrinity<DiscoveryContext>(useDiscoveryContext, provideDiscoveryContext, context)
}

export function createDiscoveryPlugin () {
  const [, provideDiscoveryContext, context] = createDiscoveryContext()

  return createPlugin({
    namespace: 'v0:discovery',
    provide: (app: App) => {
      provideDiscoveryContext(context, app)
    },
  })
}

export function useDiscovery (namespace = 'v0:discovery'): DiscoveryContext {
  return useContext<DiscoveryContext>(namespace)
}
