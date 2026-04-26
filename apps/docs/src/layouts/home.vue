<script setup lang="ts">
  // Framework
  import { IN_BROWSER } from '@vuetify/v0'

  // Utilities
  import { defineAsyncComponent, onMounted, shallowRef } from 'vue'

  // Defer ask dialog until after hydration (home-specific UI variant)
  const HomeAskDialog = defineAsyncComponent(() => import('@/components/home/HomeAskDialog.vue'))

  const hydrated = shallowRef(!IN_BROWSER)

  onMounted(() => {
    hydrated.value = true
  })
</script>

<template>
  <AppHomePage />
  <AppFooter />

  <HomeAskDialog v-if="hydrated" />
</template>
