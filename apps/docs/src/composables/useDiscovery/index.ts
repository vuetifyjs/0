// Framework
import { createContext, createForm, createPlugin, createRegistry, createSelection, createStep, createTrinity, IN_BROWSER, isUndefined, useContext, useProxyRegistry } from '@vuetify/v0'

// Utilities
import { readonly, shallowRef, toRef, watch, type App, type ShallowRef } from 'vue'

// Types
import type { RegistryTicket, ContextTrinity, FormValidationRule, StepTicket, StepContext, SelectionTicket } from '@vuetify/v0'

type ID = string | number

export interface DiscoveryActivatorTicket extends RegistryTicket {
  type: 'activator'
  element: ShallowRef<HTMLElement | null>
}

export interface DiscoveryStepTicket extends SelectionTicket {
  type: 'step'
  rules?: FormValidationRule[]
}

export type DiscoveryTicket = DiscoveryActivatorTicket | DiscoveryStepTicket

export interface DiscoveryContext extends Omit<StepContext<StepTicket>, 'register' | 'unregister'> {
  start: (id: ID) => void
  stop: () => void
  complete: () => void
  register: (registration: Partial<DiscoveryTicket>) => RegistryTicket
  unregister: (id: ID) => void
  /** Steps registry (registered step components) */
  steps: ReturnType<typeof createSelection<DiscoveryStepTicket>>
  /** Activators registry (element references) */
  activators: ReturnType<typeof createRegistry<DiscoveryActivatorTicket>>
  /** Whether the discovery is currently active */
  isActive: Readonly<ShallowRef<boolean>>
  /** Whether the discovery has been completed */
  isComplete: Readonly<ShallowRef<boolean>>
  /** Whether the current step is the first */
  isFirst: Readonly<ShallowRef<boolean>>
  /** Whether the current step is the last */
  isLast: Readonly<ShallowRef<boolean>>
  /** Form context for step validation */
  form: ReturnType<typeof createForm>
  /** Reactive step count in active tour */
  total: Readonly<ShallowRef<number>>
  /** Reactive number of defined tours */
  all: Readonly<ShallowRef<number>>
}

export interface DiscoveryOptions {
  /** Pre-defined tours: { tourId: [stepId1, stepId2, ...] } */
  tours?: Record<string, ID[]>
}

export interface DiscoveryContextOptions extends DiscoveryOptions {
  namespace?: string
}

export interface DiscoveryPluginOptions extends DiscoveryContextOptions {}

export function createDiscovery (options: DiscoveryOptions = {}): DiscoveryContext {
  const tourDefinitions: Record<string, ID[]> = { ...options.tours }

  const tours = createStep<StepTicket>({ events: true })
  const toursProxy = useProxyRegistry(tours)

  const steps = createSelection<DiscoveryStepTicket>({ events: true })

  const activators = createRegistry<DiscoveryActivatorTicket>()

  const form = createForm()

  const isActive = shallowRef(false)
  const isComplete = shallowRef(false)

  const all = toRef(() => Object.keys(tourDefinitions).length)
  const total = toRef(() => toursProxy.size)
  const isFirst = toRef(() => tours.selectedIndex.value === 0)
  const isLast = toRef(() => tours.selectedIndex.value === total.value - 1)

  // Sync tours selection with steps selection
  watch(tours.selectedId, (newId, oldId) => {
    // Deselect previous step
    if (!isUndefined(oldId) && steps.has(oldId)) {
      steps.unselect(oldId)
    }

    // Select new step
    if (!isUndefined(newId) && steps.has(newId)) {
      steps.select(newId)
    }
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

  function register (registration: Partial<DiscoveryTicket>): RegistryTicket {
    if (registration.type === 'activator') {
      return activators.register(registration)
    }

    if (registration.type === 'step') {
      return steps.register(registration as Partial<DiscoveryStepTicket>)
    }

    return registration as RegistryTicket
  }

  function unregister (id: ID) {
    if (activators.has(id)) activators.unregister(id)
    if (steps.has(id)) steps.unregister(id)
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

  async function next () {
    const selectedId = tours.selectedId.value
    if (isUndefined(selectedId)) return

    if (form.has(selectedId)) {
      const isValid = await form.submit(selectedId)
      if (!isValid) return
    }

    if (isLast.value) {
      complete()
    } else {
      tours.next()
    }
  }

  function prev () {
    tours.prev()
  }

  return {
    ...tours,
    steps,
    activators,
    isActive: readonly(isActive),
    isComplete: readonly(isComplete),
    isFirst: readonly(isFirst),
    isLast: readonly(isLast),
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
  }
}

export function createDiscoveryContext (options: DiscoveryContextOptions = {}): ContextTrinity<DiscoveryContext> {
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
