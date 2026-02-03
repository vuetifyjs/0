<script lang="ts" setup>
  // Components
  import { Discovery } from '@/components/discovery'
  import SkillzResume from '@/components/skillz/SkillzResume.vue'
  import SkillzTour from '@/components/skillz/SkillzTour.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useScrollLock } from '@/composables/useScrollLock'

  // Utilities
  import { toRef } from 'vue'

  const discovery = useDiscovery()

  useScrollLock(() => discovery.isActive.value)

  const blockActivator = toRef(() => !discovery.isInteractive.value)
</script>

<template>
  <Discovery.Highlight
    :block-activator
    blocking
  />

  <SkillzTour />
  <SkillzResume />
</template>
