/**
 * @module useDiscovery
 *
 * @remarks
 * Composable for managing guided tours through documentation.
 * Handles tour navigation, step progression, dynamic handler loading,
 * and integration with form validation.
 *
 * Key features:
 * - Event-based lifecycle (enter/leave/back) for UI synchronization
 * - Dynamic handler loading from tour definition modules
 * - Form validation integration per step
 * - Activator and root registry for positioning
 */

// Framework
import { createContext, createForm, createPlugin, createRegistry, createSingle, createStep, createTrinity, IN_BROWSER, isUndefined, useContext } from '@vuetify/v0'

// Utilities
import { readonly, shallowRef, toRef } from 'vue'

// Types
import type {
  ContextTrinity,
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
import type { App, Ref, ShallowRef } from 'vue'

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

type StepHandler = () => void
type StepHandlers = {
  enter?: StepHandler
  leave?: StepHandler
  back?: StepHandler
  completed?: StepHandler
}
type HandlersMap = Partial<Record<ID, StepHandlers>>

export interface TourDefinition {
  handlers?: HandlersMap
}

export interface TourDefinitionModule {
  defineTour: (context?: Record<string, unknown>) => TourDefinition
}

export interface DiscoveryContext {
  activators: RegistryContext<DiscoveryActivatorTicket>
  roots: RegistryContext<DiscoveryRootTicket>
  steps: StepContext<DiscoveryStepTicket>
  tours: SingleContext<DiscoveryTourTicket>
  form: ReturnType<typeof createForm>

  isActive: Readonly<ShallowRef<boolean>>
  isComplete: Readonly<ShallowRef<boolean>>
  isFirst: Readonly<ShallowRef<boolean>>
  isLast: Readonly<ShallowRef<boolean>>
  canGoBack: Readonly<Ref<boolean>>
  canGoNext: Readonly<Ref<boolean>>
  selectedId: StepContext<DiscoveryStepTicket>['selectedId']
  total: number

  start: (id: ID, options?: { stepId?: ID, context?: Record<string, unknown> }) => Promise<void>
  stop: () => void
  complete: () => void
  reset: () => void
  next: () => Promise<void>
  prev: () => void
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

  const isFirst = toRef(() => steps.selectedIndex.value === 0)
  const isLast = toRef(() => steps.selectedIndex.value === steps.size - 1)
  const canGoBack = toRef(() => steps.selectedIndex.value > 0)
  const canGoNext = toRef(() => steps.selectedIndex.value < steps.size - 1)

  // Handler state
  let handlers: HandlersMap = {}
  let isStarting = false

  function onEnter (ticket: DiscoveryStepTicket) {
    handlers[ticket.id]?.enter?.()
  }

  function onLeave (ticket: DiscoveryStepTicket) {
    handlers[ticket.id]?.leave?.()
  }

  function onBack (ticket: DiscoveryStepTicket) {
    handlers[ticket.id]?.back?.()
  }

  function onCompleted (ticket: DiscoveryStepTicket) {
    handlers[ticket.id]?.completed?.()
  }

  function attachHandlers () {
    steps.on('enter', onEnter)
    steps.on('leave', onLeave)
    steps.on('back', onBack)
    steps.on('completed', onCompleted)
  }

  function detachHandlers () {
    steps.off('enter', onEnter)
    steps.off('leave', onLeave)
    steps.off('back', onBack)
    steps.off('completed', onCompleted)
    handlers = {}
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
          } else {
            console.error(`[v0:discovery] Tour definition for "${id}" missing defineTour export`)
          }
        } catch (error) {
          console.error(`[v0:discovery] Failed to load tour definition for "${id}":`, error)
          // Continue without handlers instead of blocking
        }
      }

      attachHandlers()

      isActive.value = true
      isComplete.value = false

      tour.select()

      // Start at specific step if provided, otherwise first
      if (options?.stepId && steps.has(options.stepId)) {
        steps.select(options.stepId)
      } else {
        steps.first()
      }

      // Emit enter for initial step
      const initial = steps.selectedItem.value
      if (initial) steps.emit('enter', initial)
    } finally {
      isStarting = false
    }
  }

  function stop () {
    const current = steps.selectedItem.value
    if (current) steps.emit('leave', current)
    detachHandlers()
    isActive.value = false
  }

  function reset () {
    detachHandlers()
    form.reset()
    steps.reset()
    tours.reset()
    isActive.value = false
    isComplete.value = false
  }

  function complete () {
    const current = steps.selectedItem.value
    if (current) steps.emit('leave', current)
    detachHandlers()
    isActive.value = false
    isComplete.value = true
  }

  async function next () {
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

    steps.emit('completed', current)
    steps.emit('leave', current)
    steps.next()

    // Emit enter with newly selected item after navigation
    const newItem = steps.selectedItem.value
    if (newItem && newItem.id !== current.id) {
      steps.emit('enter', newItem)
    }
  }

  function prev () {
    const current = steps.selectedItem.value
    if (!current) return

    steps.emit('back', current)
    steps.prev()

    // Emit enter with newly selected item after navigation
    const newItem = steps.selectedItem.value
    if (newItem && newItem.id !== current.id) {
      steps.emit('enter', newItem)
    }
  }

  async function step (index: number) {
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

    // Emit completed and leave for current step if navigating away
    if (current && current.id !== id) {
      steps.emit('completed', current)
      steps.emit('leave', current)
    }

    steps.select(id)

    // Emit enter for newly selected step
    const newItem = steps.selectedItem.value
    if (newItem && (!current || newItem.id !== current.id)) {
      steps.emit('enter', newItem)
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
