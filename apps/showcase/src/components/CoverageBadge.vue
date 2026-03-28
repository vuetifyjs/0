<script setup lang="ts">
  import { HxBadge } from '@paper/helix'

  // Composables
  import { useCoverage } from '../composables/useCoverage'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { score } = useCoverage()
  const slug = toRef(() => route.params.ds as string)
  const value = toRef(() => score(slug.value))
  const color = toRef(() => value.value >= 90 ? 'success' : (value.value >= 70 ? 'warning' : 'error'))
</script>

<template>
  <HxBadge :color>{{ value }}%</HxBadge>
</template>
