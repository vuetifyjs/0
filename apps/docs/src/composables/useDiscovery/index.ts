// Framework
import { createContext, createForm, createPlugin, createRegistry, createSelection, createStep, createTrinity, IN_BROWSER, isUndefined, useContext, useProxyRegistry } from '@vuetify/v0'

// Utilities
import { readonly, shallowRef, toRef, toValue, watch, type App, type MaybeRefOrGetter, type ShallowRef } from 'vue'

// Types
import type {
  ContextTrinity,
  FormValidationRule,
  RegistryTicket,
  RegistryContext,
  SelectionTicketInput,
  SelectionTicket,
  SelectionContext,
  StepTicketInput,
  StepContext,
} from '@vuetify/v0'

type ID = string | number

/** Input/output type for activator tickets (no methods added, so same type) */
export interface DiscoveryActivatorTicket extends RegistryTicket {
  type: 'activator'
  element: ShallowRef<HTMLElement | null>
  /** Padding around the highlighted area */
  padding?: number
}

/** Input type for step tickets */
export interface DiscoveryStepTicketInput extends SelectionTicketInput {
  type: 'step'
  rules?: FormValidationRule[]
  /** Delay in ms before showing highlight (for animated elements) */
  delay?: number
}

/** Output type for step tickets (includes selection methods) */
export type DiscoveryStepTicket = SelectionTicket<DiscoveryStepTicketInput>

/** Union of ticket input types */
export type DiscoveryTicketInput = DiscoveryActivatorTicket | DiscoveryStepTicketInput

/** Union of ticket output types */
export type DiscoveryTicket = DiscoveryActivatorTicket | DiscoveryStepTicket

type DiscoveryBeforeHandler = (next: () => void, reject: () => void) => void

export interface DiscoveryStepConfig {
  /** Called when step becomes active */
  enter?: () => void
  /** Called when step becomes inactive */
  leave?: () => void
  /** Called when navigating back to this step */
  back?: () => void
  /** When truthy, automatically advance to next step */
  advanceWhen?: MaybeRefOrGetter<boolean>
}

export interface DiscoveryContext extends Omit<StepContext<StepTicketInput>, 'register' | 'unregister' | 'on' | 'step'> {
  start: (id: ID) => void
  stop: () => void
  complete: () => void
  register: (registration: Partial<DiscoveryTicketInput>) => DiscoveryTicket
  unregister: (id: ID, type?: 'activator' | 'step') => void
  /** Steps registry (registered step components) */
  steps: SelectionContext<DiscoveryStepTicketInput, DiscoveryStepTicket>
  /** Activators registry (element references) */
  activators: RegistryContext<DiscoveryActivatorTicket>
  /** Whether the discovery is currently active */
  isActive: Readonly<ShallowRef<boolean>>
  /** Whether the discovery has been completed */
  isComplete: Readonly<ShallowRef<boolean>>
  /** Whether the current step is the first */
  isFirst: Readonly<ShallowRef<boolean>>
  /** Whether the current step is the last */
  isLast: Readonly<ShallowRef<boolean>>
  /** Whether there is a previous non-disabled step */
  canGoBack: Readonly<ShallowRef<boolean>>
  /** Whether navigation can proceed (no rules or rules are valid) */
  canGoNext: Readonly<ShallowRef<boolean>>
  /** Form context for step validation */
  form: ReturnType<typeof createForm>
  /** Reactive step count in active tour */
  total: Readonly<ShallowRef<number>>
  /** Reactive number of defined tours */
  all: Readonly<ShallowRef<number>>
  /** Configure step behavior declaratively */
  step: (id: ID, config: DiscoveryStepConfig) => () => void
}

export interface DiscoveryOptions {
  /** Pre-defined tours: { tourId: [stepId1, stepId2, ...] } */
  tours?: Record<string, ID[]>
}

export interface DiscoveryContextOptions extends DiscoveryOptions {
  namespace?: string
}

export interface DiscoveryPluginOptions extends DiscoveryContextOptions {}

function createDiscovery (options: DiscoveryOptions = {}): DiscoveryContext {
  const tourDefinitions: Record<string, ID[]> = { ...options.tours }

  const tours = createStep({ events: true })
  const toursProxy = useProxyRegistry(tours)

  const steps = createSelection<DiscoveryStepTicketInput>({ events: true })

  const activators = createRegistry<DiscoveryActivatorTicket>()

  const form = createForm()

  const isActive = shallowRef(false)
  const isComplete = shallowRef(false)

  const listeners = new Map<string, Set<(...args: any[]) => void>>()
  let direction: 'forward' | 'backward' = 'forward'

  function on (event: string, handler: (...args: any[]) => void): () => void {
    if (!listeners.has(event)) {
      listeners.set(event, new Set())
    }
    listeners.get(event)!.add(handler)

    return () => {
      listeners.get(event)?.delete(handler)
    }
  }

  function emit (event: string, value?: any) {
    const handlers = listeners.get(event)
    if (handlers) {
      for (const handler of handlers) {
        handler(value)
      }
    }
  }

  /**
   * Emit a 'before' event and wait for all handlers to call next() or reject()
   * Returns true if all handlers called next(), false if any called reject()
   */
  async function emitBefore (event: string): Promise<boolean> {
    const handlers = listeners.get(event)
    if (!handlers || handlers.size === 0) return true

    const promises: Promise<boolean>[] = []

    for (const handler of handlers) {
      promises.push(new Promise<boolean>(resolve => {
        ;(handler as DiscoveryBeforeHandler)(
          () => resolve(true),
          () => resolve(false),
        )
      }))
    }

    const results = await Promise.all(promises)
    return results.every(Boolean)
  }

  const all = toRef(() => Object.keys(tourDefinitions).length)
  const total = toRef(() => toursProxy.size)
  const isFirst = toRef(() => tours.selectedIndex.value === 0)
  const isLast = toRef(() => tours.selectedIndex.value === total.value - 1)

  // Check if there's a previous non-disabled step
  const canGoBack = toRef(() => {
    if (!isActive.value) return false
    const currentIndex = tours.selectedIndex.value
    const items = tours.values()

    for (let i = currentIndex - 1; i >= 0; i--) {
      const id = items[i]?.id
      if (id && steps.get(id)?.disabled !== true) return true
    }
    return false
  })

  // Check if we can proceed: no rules, or rules are valid (null = not validated yet, still allow)
  const canGoNext = toRef(() => {
    if (!isActive.value) return false
    const selectedId = tours.selectedId.value
    if (isUndefined(selectedId)) return false

    // If step has rules, check validation state
    if (form.has(selectedId)) {
      const field = form.get(selectedId)
      // If explicitly invalid, can't proceed
      if (field?.isValid.value === false) return false
    }

    return true
  })

  watch(tours.selectedId, (newId, oldId) => {
    // Emit complete/change for old step
    if (!isUndefined(oldId)) {
      emit(`complete:${oldId}`)
      emit(`change:${oldId}`, false)
      if (steps.has(oldId)) {
        steps.unselect(oldId)
      }
    }

    // Emit start/back/change for new step
    if (!isUndefined(newId)) {
      if (direction === 'backward') {
        emit(`back:${newId}`)
      } else {
        emit(`start:${newId}`)
      }
      emit(`change:${newId}`, true)
      if (steps.has(newId)) {
        steps.select(newId)
      }
    }

    // Reset direction after handling
    direction = 'forward'
  })

  // Form validation for steps
  watch(() => steps.selectedIds, () => {
    // Register form rules for selected steps
    for (const id of steps.selectedIds) {
      if (!form.has(id)) {
        const step = steps.get(id)
        if (step?.rules?.length) {
          form.register({ id, rules: step.rules })
        }
      }
    }

    // Unregister form rules for unselected steps
    for (const id of form.keys()) {
      if (!steps.selectedIds.has(id)) {
        form.unregister(id)
      }
    }
  }, { deep: true })

  function register (registration: Partial<DiscoveryTicketInput>): DiscoveryTicket {
    if (registration.type === 'activator') {
      return activators.register(registration as Partial<DiscoveryActivatorTicket>)
    }

    if (registration.type === 'step') {
      return steps.register(registration as Partial<DiscoveryStepTicketInput>)
    }

    return registration as DiscoveryTicket
  }

  function unregister (id: ID, type?: 'activator' | 'step') {
    // If type is specified, only unregister from that registry
    // This prevents activator unmount from removing the step registration (and vice versa)
    if (type === 'activator') {
      activators.unregister(id)
    } else if (type === 'step') {
      steps.unregister(id)
    } else {
      // Legacy behavior: remove from both (for backwards compatibility)
      if (activators.has(id)) activators.unregister(id)
      if (steps.has(id)) steps.unregister(id)
    }
  }

  function start (id: ID) {
    if (!IN_BROWSER) return
    if (isUndefined(id)) return

    const tourSteps = tourDefinitions[id]
    if (!tourSteps?.length) return

    isActive.value = true
    isComplete.value = false

    // Clear existing tour and onboard new steps
    tours.offboard(tours.keys())
    tours.onboard(tourSteps.map(stepId => ({ id: stepId })))
    tours.first()
  }

  function stop () {
    isActive.value = false
  }

  function complete () {
    isActive.value = false
    isComplete.value = true
  }

  function isStepDisabled (id: ID): boolean {
    return steps.get(id)?.disabled === true
  }

  function findNextEnabledStep (): ID | undefined {
    const currentIndex = tours.selectedIndex.value
    const items = tours.values()

    for (let i = currentIndex + 1; i < items.length; i++) {
      const id = items[i]?.id
      if (id && !isStepDisabled(id)) return id
    }
    return undefined
  }

  function findPrevEnabledStep (): ID | undefined {
    const currentIndex = tours.selectedIndex.value
    const items = tours.values()

    for (let i = currentIndex - 1; i >= 0; i--) {
      const id = items[i]?.id
      if (id && !isStepDisabled(id)) return id
    }
    return undefined
  }

  async function next () {
    const selectedId = tours.selectedId.value
    if (isUndefined(selectedId)) return

    if (form.has(selectedId)) {
      const isValid = await form.submit(selectedId)
      if (!isValid) return
    }

    const nextId = findNextEnabledStep()
    if (isUndefined(nextId)) {
      complete()
    } else {
      // Emit before event and wait for handlers
      const allowed = await emitBefore(`before:${nextId}`)
      if (!allowed) return

      tours.select(nextId)
    }
  }

  async function prev () {
    const prevId = findPrevEnabledStep()
    if (isUndefined(prevId)) return

    // Emit before event and wait for handlers
    const allowed = await emitBefore(`before:${prevId}`)
    if (!allowed) return

    direction = 'backward'
    tours.select(prevId)
  }

  function step (id: ID, config: DiscoveryStepConfig): () => void {
    let stopAdvanceWatcher: (() => void) | null = null

    const offChange = on(`change:${id}`, active => {
      if (active) {
        config.enter?.()

        if (config.advanceWhen) {
          stopAdvanceWatcher = watch(
            () => toValue(config.advanceWhen),
            shouldAdvance => {
              if (shouldAdvance) {
                stopAdvanceWatcher?.()
                stopAdvanceWatcher = null
                next()
              }
            },
          )
        }
      } else {
        stopAdvanceWatcher?.()
        stopAdvanceWatcher = null
        config.leave?.()
      }
    })

    const offBack = config.back ? on(`back:${id}`, config.back) : undefined

    return () => {
      offChange()
      offBack?.()
      stopAdvanceWatcher?.()
    }
  }

  return {
    ...tours,
    steps,
    activators,
    isActive: readonly(isActive),
    isComplete: readonly(isComplete),
    isFirst: readonly(isFirst),
    isLast: readonly(isLast),
    canGoBack: readonly(canGoBack),
    canGoNext: readonly(canGoNext),
    total: readonly(total),
    all: readonly(all),
    form,
    register,
    unregister,
    start,
    stop,
    complete,
    next,
    prev,
    step,
  }
}

function createDiscoveryContext (options: DiscoveryContextOptions = {}): ContextTrinity<DiscoveryContext> {
  const { namespace = 'v0:discovery', ...rest } = options
  const [useDiscoveryContext, _provideDiscoveryContext] = createContext<DiscoveryContext>(namespace)

  const context = createDiscovery(rest)

  function provideDiscoveryContext (_context: DiscoveryContext = context, app?: App): DiscoveryContext {
    return _provideDiscoveryContext(_context, app)
  }

  return createTrinity<DiscoveryContext>(useDiscoveryContext, provideDiscoveryContext, context)
}

export function createDiscoveryPlugin (options: DiscoveryPluginOptions = {}) {
  const { namespace = 'v0:discovery', ...rest } = options
  const [, provideDiscoveryContext, context] = createDiscoveryContext({ ...rest, namespace })

  return createPlugin({
    namespace,
    provide: (app: App) => {
      provideDiscoveryContext(context, app)
    },
  })
}

export function useDiscovery (namespace = 'v0:discovery'): DiscoveryContext {
  return useContext<DiscoveryContext>(namespace)
}
