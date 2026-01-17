/**
 * @module createTour
 *
 * @remarks
 * Tour composable for guided feature discovery. Manages step-based navigation
 * through UI elements with element targeting, positioning, and validation.
 *
 * Key features:
 * - Step-based navigation with first/last/next/prev/goto
 * - Element targeting via CSS selectors
 * - Auto-advance on step validation
 * - Configurable positioning for tooltips
 * - Progress tracking
 */

// Foundational
import { createContext } from '@vuetify/v0'
import { createTrinity } from '@vuetify/v0'

// Utilities
import { computed, shallowRef, watch, onScopeDispose } from 'vue'

// Types
import type { App, ComputedRef, ShallowRef } from 'vue'
import type { ContextTrinity } from '@vuetify/v0'

export type TourPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TourStep {
  /** Unique step identifier */
  id: string
  /** CSS selector for target element */
  selector: string
  /** Step title */
  title: string
  /** Step content/description */
  content: string
  /** Tooltip position relative to target */
  position?: TourPosition
  /** Optional validation function for auto-advance */
  validate?: () => boolean
  /** Callback when step becomes active */
  onEnter?: () => void
  /** Callback when step is exited */
  onExit?: () => void
}

export interface TourContext {
  /** Whether the tour is currently active */
  isActive: ShallowRef<boolean>
  /** Current step index (0-based) */
  currentIndex: ShallowRef<number>
  /** Current step definition */
  currentStep: ComputedRef<TourStep | undefined>
  /** All step definitions */
  steps: ShallowRef<TourStep[]>
  /** Progress info */
  progress: ComputedRef<{ current: number; total: number }>
  /** Whether on first step */
  isFirst: ComputedRef<boolean>
  /** Whether on last step */
  isLast: ComputedRef<boolean>
  /** Current target element */
  targetElement: ComputedRef<Element | null>
  /** Current target element rect */
  targetRect: ShallowRef<DOMRect | null>

  /** Start the tour */
  start: (stepIndex?: number) => void
  /** Stop the tour */
  stop: () => void
  /** Go to next step */
  next: () => void
  /** Go to previous step */
  prev: () => void
  /** Go to specific step by index */
  goto: (index: number) => void
  /** Set step definitions */
  setSteps: (steps: TourStep[]) => void
  /** Update target rect (for resize/scroll) */
  updateRect: () => void
}

export interface TourOptions {
  /** Initial step definitions */
  steps?: TourStep[]
  /** Namespace for dependency injection */
  namespace?: string
}

/**
 * Creates a new tour instance.
 *
 * @param options Configuration options.
 * @returns Tour context with state and navigation methods.
 *
 * @example
 * ```ts
 * import { createTour } from '@/composables/tour'
 *
 * const tour = createTour({
 *   steps: [
 *     { id: 'step-1', selector: '#search', title: 'Search', content: 'Find anything...' },
 *     { id: 'step-2', selector: '#menu', title: 'Menu', content: 'Navigate here...' },
 *   ]
 * })
 *
 * tour.start()
 * tour.next()
 * tour.stop()
 * ```
 */
export function createTour (options: TourOptions = {}): TourContext {
  const { steps: initialSteps = [] } = options

  // State
  const isActive = shallowRef(false)
  const currentIndex = shallowRef(0)
  const steps = shallowRef<TourStep[]>(initialSteps)
  const targetRect = shallowRef<DOMRect | null>(null)

  // Derived state
  const currentStep = computed(() => {
    if (!isActive.value) return undefined
    return steps.value[currentIndex.value]
  })

  const progress = computed(() => ({
    current: currentIndex.value + 1,
    total: steps.value.length,
  }))

  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === steps.value.length - 1)

  const targetElement = computed(() => {
    const step = currentStep.value
    if (!step) return null
    return document.querySelector(step.selector)
  })

  // Rect update logic
  let resizeObserver: ResizeObserver | null = null
  let scrollHandler: (() => void) | null = null

  function updateRect () {
    const el = targetElement.value
    if (!el) {
      targetRect.value = null
      return
    }
    targetRect.value = el.getBoundingClientRect()
  }

  function setupObservers () {
    cleanupObservers()

    // Update on resize
    resizeObserver = new ResizeObserver(updateRect)
    if (targetElement.value) {
      resizeObserver.observe(targetElement.value)
    }
    resizeObserver.observe(document.body)

    // Update on scroll
    scrollHandler = () => updateRect()
    window.addEventListener('scroll', scrollHandler, { passive: true, capture: true })
  }

  function cleanupObservers () {
    resizeObserver?.disconnect()
    resizeObserver = null
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler, true)
      scrollHandler = null
    }
  }

  // Navigation
  function start (stepIndex = 0) {
    if (steps.value.length === 0) return

    currentIndex.value = Math.max(0, Math.min(stepIndex, steps.value.length - 1))
    isActive.value = true

    // Wait for DOM update then setup
    requestAnimationFrame(() => {
      updateRect()
      setupObservers()
      currentStep.value?.onEnter?.()
    })
  }

  function stop () {
    currentStep.value?.onExit?.()
    isActive.value = false
    currentIndex.value = 0
    targetRect.value = null
    cleanupObservers()
  }

  function next () {
    if (!isActive.value || isLast.value) return

    currentStep.value?.onExit?.()
    currentIndex.value++

    requestAnimationFrame(() => {
      updateRect()
      currentStep.value?.onEnter?.()
    })
  }

  function prev () {
    if (!isActive.value || isFirst.value) return

    currentStep.value?.onExit?.()
    currentIndex.value--

    requestAnimationFrame(() => {
      updateRect()
      currentStep.value?.onEnter?.()
    })
  }

  function goto (index: number) {
    if (!isActive.value) return
    if (index < 0 || index >= steps.value.length) return

    currentStep.value?.onExit?.()
    currentIndex.value = index

    requestAnimationFrame(() => {
      updateRect()
      currentStep.value?.onEnter?.()
    })
  }

  function setSteps (newSteps: TourStep[]) {
    steps.value = newSteps
  }

  // Watch for step changes to update rect
  watch(currentStep, () => {
    if (isActive.value) {
      requestAnimationFrame(() => {
        updateRect()
        if (targetElement.value) {
          resizeObserver?.disconnect()
          resizeObserver?.observe(targetElement.value)
          resizeObserver?.observe(document.body)
        }
      })
    }
  })

  // Cleanup on scope dispose
  onScopeDispose(() => {
    cleanupObservers()
  })

  return {
    isActive,
    currentIndex,
    currentStep,
    steps,
    progress,
    isFirst,
    isLast,
    targetElement,
    targetRect,
    start,
    stop,
    next,
    prev,
    goto,
    setSteps,
    updateRect,
  }
}

/**
 * Creates a providable tour context with Trinity pattern.
 *
 * @param options Configuration options.
 * @returns Trinity tuple [useTour, provideTour, defaultTour]
 *
 * @example
 * ```ts
 * const [useTour, provideTour, tour] = createTourContext()
 *
 * // In root component
 * provideTour()
 *
 * // In child component
 * const tour = useTour()
 * ```
 */
export function createTourContext (
  options: TourOptions = {}
): ContextTrinity<TourContext> {
  const { namespace = 'v0:tour', ...tourOptions } = options
  const [useContext, _provideContext] = createContext<TourContext>(namespace)

  const context = createTour(tourOptions)

  function provideContext (_context = context, app?: App) {
    return _provideContext(_context, app)
  }

  return createTrinity(useContext, provideContext, context)
}

/**
 * Returns the current tour context from the component tree.
 *
 * @param namespace The namespace for the tour context. Defaults to 'v0:tour'.
 * @returns The current tour context.
 *
 * @example
 * ```vue
 * <script setup>
 *   import { useTour } from '@/composables/tour'
 *
 *   const tour = useTour()
 * </script>
 * ```
 */
export function useTour (namespace = 'v0:tour'): TourContext {
  const [useContext] = createContext<TourContext>(namespace)
  return useContext()
}
