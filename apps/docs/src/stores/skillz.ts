// Framework
import { useStorage } from '@vuetify/v0'

// Composables
import { useDiscovery } from '@/composables/useDiscovery'

// Utilities
import { defineStore } from 'pinia'
import { computed, shallowRef } from 'vue'

// Types
import type { DiscoveryStepTicket } from '@/composables/useDiscovery'

export type ProgressStatus = 'not-started' | 'in-progress' | 'completed'

export interface TourProgress {
  tourId: string
  status: ProgressStatus
  steps: string[]
  lastStep?: string
  startedAt?: number
  completedAt?: number
}

export interface SkillzProgress {
  version: number
  tours: Record<string, TourProgress>
}

const VERSION = 1

function defaults (): SkillzProgress {
  return { version: VERSION, tours: {} }
}

export const useSkillzStore = defineStore('skillz', () => {
  const discovery = useDiscovery()
  const storage = useStorage()
  const data = storage.get<SkillzProgress>('skillz', defaults())

  const active = shallowRef<string | null>(null)

  // Progress queries
  function get (id: string): TourProgress | undefined {
    return data.value.tours[id]
  }

  function completed (id: string): boolean {
    return data.value.tours[id]?.status === 'completed'
  }

  function pending (id: string): boolean {
    return data.value.tours[id]?.status === 'in-progress'
  }

  function steps (id: string): string[] {
    return data.value.tours[id]?.steps ?? []
  }

  function missing (id: string): string[] {
    const tour = discovery.tours.get(id)
    return tour?.prerequisites?.filter(p => !completed(p)) ?? []
  }

  function locked (id: string): boolean {
    return missing(id).length > 0
  }

  // Progress mutations - useStorage watches deep, so direct mutation persists
  function update (id: string, changes: Partial<TourProgress>): void {
    const existing = data.value.tours[id]
    data.value.tours[id] = {
      tourId: id,
      status: existing?.status ?? 'not-started',
      steps: existing?.steps ?? [],
      lastStep: existing?.lastStep,
      startedAt: existing?.startedAt,
      completedAt: existing?.completedAt,
      ...changes,
    }
  }

  function begin (id: string): void {
    const existing = data.value.tours[id]

    // Restart: clear previous progress
    if (existing?.status === 'completed') {
      delete data.value.tours[id]
    }

    update(id, {
      status: 'in-progress',
      startedAt: data.value.tours[id]?.startedAt ?? Date.now(),
    })
  }

  function record (id: string, stepId: string): void {
    const existing = data.value.tours[id]
    if (!existing) return

    const list = existing.steps.includes(stepId)
      ? existing.steps
      : [...existing.steps, stepId]

    update(id, { steps: list, lastStep: stepId })
  }

  function finish (id: string): void {
    update(id, { status: 'completed', completedAt: Date.now() })
  }

  function reset (id?: string): void {
    if (id) {
      delete data.value.tours[id]
    } else {
      data.value.tours = {}
      data.value.version = VERSION
    }
  }

  function dismiss (id: string): void {
    const existing = data.value.tours[id]
    if (existing?.status === 'in-progress') {
      delete data.value.tours[id]
    }
  }

  // Step completion listener
  function onStep (ticket: unknown) {
    if (active.value) {
      record(active.value, String((ticket as DiscoveryStepTicket).id))
    }
  }

  function cleanup () {
    discovery.steps.off('completed', onStep)
    active.value = null
  }

  async function start (id: string, options?: Parameters<typeof discovery.start>[1]) {
    active.value = id
    begin(id)
    discovery.steps.on('completed', onStep)

    // If no stepId provided, find first incomplete step before starting
    let stepId = options?.stepId
    if (!stepId) {
      const tour = discovery.tours.get(id)
      const completed = steps(id)
      if (tour && completed.length > 0) {
        const next = tour.steps.find(s => !completed.includes(String(s.id)))
        stepId = next?.id
      }
    }

    await discovery.start(id, { ...options, stepId })
  }

  function stop () {
    cleanup()
    discovery.stop()
  }

  function complete () {
    if (active.value) {
      // Record the final step before finishing
      const current = discovery.steps.selectedItem.value
      if (current) record(active.value, String(current.id))
      finish(active.value)
    }
    cleanup()
    discovery.complete()
  }

  const items = computed(() => discovery.tours.values())
  const done = computed(() => active.value ? steps(active.value) : [])

  // Find any tour that was started but not completed (and not currently active)
  const pendingTour = computed(() => {
    if (active.value) return null
    for (const [id, progress] of Object.entries(data.value.tours)) {
      if (progress.status === 'in-progress') {
        const tour = discovery.tours.get(id)
        if (tour) return { tour, progress }
      }
    }
    return null
  })

  return {
    // Actions
    start,
    stop,
    complete,
    reset,
    dismiss,

    // Queries
    get,
    completed,
    pending,
    locked,
    missing,
    steps,

    // State
    items,
    active,
    done,
    pendingTour,
  }
})
