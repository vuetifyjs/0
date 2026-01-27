<script setup lang="ts">
  // Framework
  import { useBreakpoints, useDocumentEventListener } from '@vuetify/v0'

  // Components
  import DocsDiscoveryStep from '@/components/docs/DocsDiscoveryStep.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Types
  import type { SkillStep } from '@/types/skill'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'

  const skillz = useSkillzStore()
  const discovery = useDiscovery ()
  const { smAndDown } = useBreakpoints()
</script>

<template>
  <template v-if="discovery.isActive.value">
    <DocsDiscoveryStep
      v-for="step in discovery.steps.values()"
      :key="step.id"
      :hint="step.hint"
      :placement="step.placement"
      :placement-mobile="step.placementMobile"
      :step="step.id"
      :text="step.task"
      :title="step.title"
    />
  </template>
</template>
