<script lang="ts" setup>
  // Components
  import { Discovery } from '@/components/discovery'
  import SkillzTour from '@/components/skillz/SkillzTour.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'
  import { useScrollLock } from '@/composables/useScrollLock'

  // Utilities
  import { toRef } from 'vue'

  // Stores
  import { useSkillzStore } from '@/stores/skillz'

  const discovery = useDiscovery()
  const skillz = useSkillzStore()

  // console.log(discovery)

  // const isGuided = toRef(() => skillz.active?.mode === 'guided')

  useScrollLock(() => discovery.isActive.value)
</script>

<template>
  <Discovery.Highlight block-activator blocking />

  <SkillzTour />
</template>
