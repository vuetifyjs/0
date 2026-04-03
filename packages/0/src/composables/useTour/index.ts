/**
 * @module useTour
 *
 * @remarks
 * Headless guided tour plugin. Composes createStep, createRegistry,
 * and createForm for step orchestration, activator tracking,
 * and validation gates.
 *
 * Key features:
 * - Step types: tooltip, dialog, floating, wait
 * - Form validation gates on navigation
 * - Activator element registry
 * - isReady gate for wait-type steps
 */

// Composables
import { createForm } from '#v0/composables/createForm'
import { createPluginContext } from '#v0/composables/createPlugin'
import { createRegistry } from '#v0/composables/createRegistry'
import { createStep } from '#v0/composables/createStep'

// Utilities
import { isUndefined } from '#v0/utilities'
import { readonly, shallowRef, toRef } from 'vue'

// Types
import type { FormContext } from '#v0/composables/createForm'
import type { RegistryContext, RegistryTicket } from '#v0/composables/createRegistry'
import type { StepContext, StepTicket, StepTicketInput } from '#v0/composables/createStep'
import type { MaybeElementRef } from '#v0/composables/toElement'
import type { ID } from '#v0/types'
import type { Ref, ShallowRef } from 'vue'

// ---- Types ----

export type TourStepType = 'tooltip' | 'dialog' | 'floating' | 'wait'

export type TourStepInput = StepTicketInput & {
  type?: TourStepType
  placement?: string
  placementMobile?: string
}

export type TourStepTicket = StepTicket<TourStepInput>

export type TourActivatorTicket = RegistryTicket & {
  element: MaybeElementRef
  padding?: number
}

export interface TourContext {
  steps: StepContext<TourStepTicket>
  activators: RegistryContext<TourActivatorTicket>
  form: FormContext

  isActive: Readonly<ShallowRef<boolean>>
  isComplete: Readonly<ShallowRef<boolean>>
  isFirst: Readonly<Ref<boolean>>
  isLast: Readonly<Ref<boolean>>
  canGoBack: Readonly<Ref<boolean>>
  canGoNext: Readonly<Ref<boolean>>
  isReady: Readonly<ShallowRef<boolean>>
  selectedId: StepContext<TourStepTicket>['selectedId']
  total: number

  start: (options?: { stepId?: ID }) => void
  ready: () => void
  stop: () => void
  complete: () => void
  reset: () => void
  next: () => Promise<void>
  prev: () => void
  step: (index: number) => Promise<void>
}

// ---- Factory ----

export function createTour (): TourContext {
  const steps = createStep<TourStepTicket>({ events: true, reactive: true })
  const activators = createRegistry<TourActivatorTicket>()
  const form = createForm()

  const isActive = shallowRef(false)
  const isComplete = shallowRef(false)
  const isReady = shallowRef(true)

  const isFirst = toRef(() => steps.selectedIndex.value === 0)
  const isLast = toRef(() => steps.selectedIndex.value === steps.size - 1)
  const canGoBack = toRef(() => isReady.value && steps.selectedIndex.value > 0)
  const canGoNext = toRef(() => isReady.value && steps.selectedIndex.value < steps.size - 1)

  function start (options?: { stepId?: ID }) {
    isActive.value = true
    isComplete.value = false

    if (options?.stepId && steps.has(options.stepId)) {
      steps.select(options.stepId)
    } else {
      steps.first()
    }

    syncReady()
  }

  function ready () {
    isReady.value = true
  }

  function stop () {
    isActive.value = false
    isReady.value = true
  }

  function complete () {
    isActive.value = false
    isComplete.value = true
    isReady.value = true
  }

  function reset () {
    form.reset()
    steps.clear()
    isActive.value = false
    isComplete.value = false
    isReady.value = true
  }

  function syncReady () {
    const current = steps.selectedItem.value
    if (!current) {
      isReady.value = true
      return
    }
    isReady.value = current.type !== 'wait'
  }

  async function next () {
    if (!isReady.value) return

    const current = steps.selectedItem.value
    if (!current) return

    if (form.has(current.id)) {
      const isValid = await form.submit(current.id)
      if (!isValid) return
    }

    steps.next()
    syncReady()
  }

  function prev () {
    if (!isReady.value) return

    const current = steps.selectedItem.value
    if (!current) return

    steps.prev()
    syncReady()
  }

  async function step (index: number) {
    if (!isReady.value) return

    const current = steps.selectedItem.value
    const id = steps.lookup(index - 1)
    if (isUndefined(id)) return

    if (current && current.id !== id && form.has(current.id)) {
      const isValid = await form.submit(current.id)
      if (!isValid) return
    }

    steps.select(id)
    syncReady()
  }

  return {
    steps,
    activators,
    form,

    isActive: readonly(isActive),
    isComplete: readonly(isComplete),
    isFirst,
    isLast,
    canGoBack,
    canGoNext,
    isReady: readonly(isReady),
    selectedId: steps.selectedId,
    get total () {
      return steps.size
    },

    start,
    ready,
    stop,
    complete,
    reset,
    next,
    prev,
    step,
  }
}

// ---- Plugin ----

export const [createTourContext, createTourPlugin, useTour] = createPluginContext<
  { namespace?: string },
  TourContext
>(
  'v0:tour',
  () => createTour(),
)
