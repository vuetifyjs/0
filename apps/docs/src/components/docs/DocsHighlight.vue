<script lang="ts" setup>
  // Components
  import { Discovery } from '@/components/discovery'
  import SkillzResume from '@/components/skillz/SkillzResume.vue'
  import SkillzTour from '@/components/skillz/SkillzTour.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useScrollLock } from '@/composables/useScrollLock'

  const discovery = useDiscovery()

  useScrollLock(() => discovery.isActive.value)
</script>

<template>
  <Discovery.Highlight block-activator blocking />

  <SkillzTour />
  <SkillzResume />
</template>
