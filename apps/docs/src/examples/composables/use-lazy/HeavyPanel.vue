<script setup lang="ts">
  import { range } from '@vuetify/v0'
  import { onMounted } from 'vue'
  import { useMounts } from './tabs'
  import type { Tab } from './tabs'

  const { tab } = defineProps<{ tab: Tab }>()

  const { track } = useMounts()

  // Mounting this subtree is the expensive work useLazy defers.
  onMounted(() => track(tab.id))

  const rows = range(tab.rows, 1)
</script>

<template>
  <div class="max-h-40 overflow-auto rounded bg-surface">
    <p
      v-for="row in rows"
      :key="row"
      class="px-3 py-1.5 border-b border-divider last:border-b-0 text-sm text-on-surface"
    >
      {{ tab.label }} row {{ row }}
    </p>
  </div>
</template>
