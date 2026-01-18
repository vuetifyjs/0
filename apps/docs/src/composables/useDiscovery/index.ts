/**
 * @module createDiscovery
 *
 * @remarks
 * Feature discovery and guided tour composable built on v0 primitives.
 *
 * Key features:
 * - Step-based navigation via createStep
 * - Dynamic step registration (components register themselves)
 * - Activator element tracking via createRegistry
 * - Component-composition based targeting (not CSS selectors)
 * - Plugin support for app-wide availability
 *
 * Architecture:
 * - createStep: Navigation (first/last/next/prev)
 * - createRegistry: Activator elements register themselves
 * - createContext: DI for component tree access
 *
 * Steps are registered dynamically by Discovery.Root components,
 * not declared upfront. This enables a true component-composition approach.
 */

// Framework
import {
  createContext,
  createForm,
  createPlugin,
  createRegistry,
  createStep,
  createTrinity,
  useContext,
} from '@vuetify/v0'

// Utilities
import { readonly, shallowRef, toValue } from 'vue'

// Types
import type { ID } from '#v0/types'
import type {
  ContextTrinity,
  FormContext,
  FormValidationRule,
  Plugin,
  RegistryTicket,
  StepContext,
  StepTicket,
} from '@vuetify/v0'
import type { App, MaybeRefOrGetter, Ref, ShallowRef } from 'vue'

// Re-export form validation types for convenience
export type { FormValidationResult, FormValidationRule } from '@vuetify/v0'

/** Step registration ticket */
export interface DiscoveryStepTicket extends StepTicket {
  type: 'step'
}

/** Activator registration ticket */
export interface DiscoveryActivatorTicket extends RegistryTicket {
  type: 'activator'
  /** The step ID this activator targets */
  step: ID
  /** Reference to the activator element */
  element: ShallowRef<HTMLElement | null>
}

/** Registration data for a step */
export interface DiscoveryStepRegistration {
  type: 'step'
  id: ID
  disabled?: MaybeRefOrGetter<boolean>
  rules?: FormValidationRule[]
}

/** Registration data for an activator */
export interface DiscoveryActivatorRegistration {
  type: 'activator'
  step: ID
  element: Ref<HTMLElement | null>
}

/** Union of all registration types */
export type DiscoveryRegistration = DiscoveryStepRegistration | DiscoveryActivatorRegistration

export interface DiscoveryContext<
  Z extends DiscoveryStepTicket = DiscoveryStepTicket,
> extends Omit<StepContext<Z>, 'register'> {
  /** Whether the discovery tour is currently active */
  isActive: Readonly<ShallowRef<boolean>>
  /** Form context for step validation */
  form: FormContext
  /** Register a step or activator */
  register: (registration: DiscoveryRegistration) => () => void
  /** Start the discovery tour, optionally at a specific step */
  start: (id?: ID) => void
  /** Stop the discovery tour */
  stop: () => void
  /** Get the element for a step's activator */
  getActivatorElement: (id: ID) => HTMLElement | null
  /** Get the bounding rect for a step's activator */
  getActivatorRect: (id: ID) => DOMRect | null
}

export interface DiscoveryOptions {
  /** Enable circular navigation (wrap at boundaries) */
  circular?: boolean
}

export interface DiscoveryContextOptions extends DiscoveryOptions {
  /** Namespace for dependency injection */
  namespace?: string
}

/**
 * Creates a new discovery instance for feature tours.
 *
 * @param options Configuration options
 * @returns Discovery context with navigation and activator tracking
 *
 * @remarks
 * Discovery provides a component-composition approach to feature tours.
 * Steps are registered dynamically when Discovery.Root components mount,
 * not declared upfront. This enables flexible, declarative tour definitions.
 *
 * **Built on v0 primitives:**
 * - `createStep` for navigation (first/last/next/prev, skip disabled)
 * - `createRegistry` for activator element tracking
 * - `createForm` for step validation
 *
 * **Usage pattern:**
 * 1. Install plugin or provide context
 * 2. Discovery.Root components register steps on mount
 * 3. Discovery.Activator components register target elements
 * 4. Call start() to begin the tour
 *
 * @example
 * ```ts
 * // Plugin provides empty context
 * app.use(createDiscoveryPlugin())
 *
 * // Components register themselves:
 * // <Discovery.Root step="search">
 * //   <Discovery.Activator>
 * //     <SearchInput />
 * //   </Discovery.Activator>
 * // </Discovery.Root>
 *
 * // Start the tour
 * const discovery = useDiscovery()
 * discovery.start()
 * ```
 */
export function createDiscovery<
  Z extends DiscoveryStepTicket = DiscoveryStepTicket,
  E extends DiscoveryContext<Z> = DiscoveryContext<Z>,
> (options: DiscoveryOptions = {}): E {
  const { circular = false } = options

  const isActive = shallowRef(false)

  // Step navigation (extends single selection with first/last/next/prev)
  const steps = createStep<Z>({ circular })

  // Form for step validation
  const form = createForm()

  // Activator registry (tracks elements for each step)
  const activators = createRegistry<DiscoveryActivatorTicket>()

  /**
   * Register a step or activator with the discovery system.
   *
   * @param registration The registration data (step or activator)
   * @returns A cleanup function to unregister the item
   *
   * @remarks
   * Steps are registered with navigation and optional validation rules.
   * Activators are registered with an element reference for a specific step.
   *
   * @example
   * ```ts
   * // Register a step
   * const cleanup = discovery.register({
   *   type: 'step',
   *   id: 'search',
   *   disabled: () => !hasFeature('search'),
   *   rules: [(v) => v !== '' || 'Search is required'],
   * })
   *
   * // Register an activator
   * const cleanup = discovery.register({
   *   type: 'activator',
   *   step: 'search',
   *   element: searchInputRef,
   * })
   *
   * // Cleanup on unmount
   * onUnmounted(cleanup)
   * ```
   */
  function register (registration: DiscoveryRegistration): () => void {
    if (registration.type === 'step') {
      const step = steps.register({
        id: registration.id,
        type: 'step',
        disabled: registration.disabled,
      } as Partial<Z>)

      let ticket: { id: ID } | null = null
      if (registration.rules && registration.rules.length > 0) {
        ticket = form.register({
          id: registration.id,
          rules: registration.rules,
        })
      }

      return () => {
        steps.unregister(step.id)
        if (!ticket) return

        form.unregister(ticket.id)
      }
    }

    const activator = activators.register({
      type: 'activator',
      step: registration.step,
      element: registration.element as ShallowRef<HTMLElement | null>,
    })

    return () => {
      activators.unregister(activator.id)
    }
  }

  /**
   * Start the discovery tour.
   *
   * @param id Optional ID of the step to start at
   *
   * @remarks
   * If no id is provided and no step is currently selected,
   * the tour will start at the first step.
   *
   * @example
   * ```ts
   * // Start at the beginning
   * discovery.start()
   *
   * // Start at a specific step
   * discovery.start('search')
   * ```
   */
  function start (id?: ID) {
    isActive.value = true

    if (id) {
      steps.select(id)
    } else if (steps.selectedId.value === undefined) {
      steps.first()
    }
  }

  /**
   * Stop the discovery tour.
   *
   * @remarks
   * Sets the active state to false. Does not reset the current step,
   * so calling start() again will resume from where the tour left off.
   *
   * @example
   * ```ts
   * discovery.stop()
   * ```
   */
  function stop () {
    isActive.value = false
  }

  /**
   * Get the DOM element for a step's activator.
   *
   * @param id The ID of the step to get the activator element for
   * @returns The activator element if found and still connected to the DOM, null otherwise
   */
  function getActivatorElement (id: ID): HTMLElement | null {
    for (const ticket of activators.values()) {
      if (ticket.step !== id) continue

      const element = toValue(ticket.element)
      if (!element || !element.isConnected) continue

      return element
    }
    return null
  }

  /**
   * Get the bounding rect for a step's activator element.
   *
   * @param id The ID of the step to get the activator rect for
   * @returns The bounding rect if the activator element is found and connected, null otherwise
   *
   * @remarks
   * Useful for positioning tooltips, popovers, or highlights around the activator element.
   *
   * @example
   * ```ts
   * const rect = discovery.getActivatorRect('search')
   * if (rect) {
   *   tooltip.style.top = `${rect.bottom}px`
   *   tooltip.style.left = `${rect.left}px`
   * }
   * ```
   */
  function getActivatorRect (id: ID): DOMRect | null {
    const element = getActivatorElement(id)
    return element?.getBoundingClientRect() ?? null
  }

  return {
    // Spread steps context (navigation, selection, registry methods)
    ...steps,

    isActive: readonly(isActive),

    form,

    register,
    start,
    stop,
    getActivatorElement,
    getActivatorRect,

    get size () {
      return steps.size
    },
  } as E
}

/**
 * Creates a discovery context with trinity pattern.
 *
 * @param options Configuration options
 * @returns Trinity tuple: [useDiscovery, provideDiscovery, defaultContext]
 *
 * @example
 * ```ts
 * const [useDiscovery, provideDiscovery, context] = createDiscoveryContext()
 *
 * // In parent component
 * provideDiscovery()
 *
 * // In child components
 * const discovery = useDiscovery()
 * ```
 */
export function createDiscoveryContext<
  Z extends DiscoveryStepTicket = DiscoveryStepTicket,
  E extends DiscoveryContext<Z> = DiscoveryContext<Z>,
> (options: DiscoveryContextOptions = {}): ContextTrinity<E> {
  const { namespace = 'v0:discovery', ...rest } = options
  const [useDiscoveryContext, _provideDiscoveryContext] = createContext<E>(namespace)
  const context = createDiscovery<Z, E>(rest)

  function provideDiscoveryContext (_context: E = context, app?: App): E {
    return _provideDiscoveryContext(_context, app)
  }

  return createTrinity<E>(useDiscoveryContext, provideDiscoveryContext, context)
}

/**
 * Injects the discovery context.
 *
 * @param namespace The namespace for the discovery context
 * @returns The discovery context
 * @throws Error if context not found
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { useDiscovery } from '@vuetify/v0'
 *
 *   const discovery = useDiscovery()
 *
 *   function startTour() {
 *     discovery.start()
 *   }
 * </script>
 * ```
 */
export function useDiscovery<
  Z extends DiscoveryStepTicket = DiscoveryStepTicket,
  E extends DiscoveryContext<Z> = DiscoveryContext<Z>,
> (namespace = 'v0:discovery'): E {
  return useContext<E>(namespace)
}

export interface DiscoveryPluginOptions extends DiscoveryContextOptions {}

/**
 * Creates a Vue plugin that provides discovery context app-wide.
 *
 * @param options Plugin configuration
 * @returns Vue plugin
 *
 * @example
 * ```ts
 * // main.ts
 * import { createDiscoveryPlugin } from '@vuetify/v0'
 *
 * // No steps declared here - they register dynamically
 * app.use(createDiscoveryPlugin())
 *
 * // In any component
 * const discovery = useDiscovery()
 * discovery.start()
 * ```
 */
export function createDiscoveryPlugin (options: DiscoveryPluginOptions = {}): Plugin {
  const { namespace = 'v0:discovery', ...rest } = options

  return createPlugin({
    namespace,
    provide: app => {
      const [, provideDiscovery, context] = createDiscoveryContext({ namespace, ...rest })
      provideDiscovery(context, app)
    },
  })
}
