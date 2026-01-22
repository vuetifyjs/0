<script lang="ts" setup>
  // Components
  import { Discovery } from '@/components/discovery'
  import SkillzToursDocsIntro from '@/skillz/tours/SkillzToursDocsIntro.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useScrollLock } from '@/composables/useScrollLock'

  const discovery = useDiscovery()

  useScrollLock(() => discovery.isActive.value)
</script>

<template>
  <Discovery.Highlight blocking />

  <SkillzToursDocsIntro />
</template>
