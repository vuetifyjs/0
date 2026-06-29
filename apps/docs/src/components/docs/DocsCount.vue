<script setup lang="ts">
  import { MATURITY_COUNTS } from '@/constants/maturity'

  // Types
  import type { MaturityCountKey } from '@/constants/maturity'

  const { type = 'total' } = defineProps<{
    type?: MaturityCountKey
  }>()
</script>

<template>{{ MATURITY_COUNTS[type] }}</template>
