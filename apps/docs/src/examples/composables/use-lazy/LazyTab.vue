<script setup lang="ts">
  import { useLazy } from '@vuetify/v0'
  import HeavyPanel from './HeavyPanel.vue'
  import type { Tab } from './tabs'

  const { tab, active } = defineProps<{ tab: Tab, active: boolean }>()

  const { hasContent, isBooted } = useLazy(() => active)
</script>

<template>
  <div v-show="active" class="p-3" role="tabpanel">
    <HeavyPanel v-if="hasContent" :tab />

    <p class="mt-2 text-xs text-on-surface-variant">
      isBooted: {{ isBooted }} · hasContent: {{ hasContent }}
    </p>
  </div>
</template>
