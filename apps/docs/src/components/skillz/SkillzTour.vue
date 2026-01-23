<script setup lang="ts">
  // Framework
  import { useDocumentEventListener } from '@vuetify/v0'

  // Components
  import DocsDiscoveryStep from '@/components/docs/DocsDiscoveryStep.vue'

  // Types
  import type { NextOnCallback } from '@/components/discovery/DiscoveryRoot.vue'
  import type { SkillStepNext } from '@/types/skill'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'

  const skillz = useSkillzStore()

  /**
   * Build a nextOn callback from the step's `next` config.
   */
  function buildNextOn (next: SkillStepNext | undefined): NextOnCallback | undefined {
    if (!next) return undefined

    const keys = typeof next === 'string'
      ? [next]
      : (Array.isArray(next)
        ? next
        : next.keys)

    const block = typeof next === 'object' && !Array.isArray(next)
      ? next.block ?? []
      : []

    return (advance: () => void) => {
      return useDocumentEventListener('keydown', (event: KeyboardEvent) => {
        if (block.includes(event.key)) {
          event.preventDefault()
          event.stopPropagation()
        }
        if (keys.includes(event.key)) {
          advance()
        }
      })
    }
  }
</script>

<template>
  <template v-if="skillz.active">
    <DocsDiscoveryStep
      v-for="step in skillz.active.steps"
      :key="step.id"
      :hint="step.hint"
      :next-on="buildNextOn(step.next)"
      :placement="step.placement"
      :step="step.id"
      :text="step.task"
      :title="step.title"
    />
  </template>
</template>
