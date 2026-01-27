<script setup lang="ts">
  // Components
  import DocsDiscoveryStep from '@/components/docs/DocsDiscoveryStep.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  const discovery = useDiscovery()
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
