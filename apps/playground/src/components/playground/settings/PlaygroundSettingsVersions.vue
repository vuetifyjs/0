<script setup lang="ts">
  // Framework
  import { isArray } from '@vuetify/v0'

  // Components
  import AppSelect from '@/components/app/AppSelect.vue'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Utilities
  import { computed, onMounted, toRef } from 'vue'

  // Types
  import type { AppSelectItem } from '@/components/app/AppSelect.vue'
  import type { ID } from '@vuetify/v0'

  const playground = usePlayground()

  onMounted(() => playground.fetchVersions())

  // Vue: null means "latest" in the ref, but the select uses 'latest' as the item id
  const vueModel = computed({
    get: (): ID => playground.vueVersion.value ?? 'latest',
    set: (id: ID | ID[]) => {
      const value = isArray(id) ? id[0] : id
      playground.vueVersion.value = value === 'latest' ? null : String(value)
    },
  })

  // v0: 'latest' string is used directly as the item id
  const v0Model = computed({
    get: (): ID => playground.v0Version.value,
    set: (id: ID | ID[]) => {
      playground.v0Version.value = String(isArray(id) ? id[0] : id)
    },
  })

  const vueItems = toRef((): AppSelectItem[] => [
    { id: 'latest', label: 'Latest' },
    ...(playground.vueVersions.value ?? []).map(v => ({ id: v, label: v })),
  ])

  const v0Items = toRef((): AppSelectItem[] => [
    { id: 'latest', label: 'Latest' },
    ...(playground.v0Versions.value ?? []).map(v => ({ id: v, label: v })),
  ])
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Vue version -->
    <div class="flex flex-col gap-1.5">
      <label class="field-label">Vue</label>
      <div v-if="playground.fetching.value" class="select-skeleton" />
      <AppSelect v-else v-model="vueModel" :items="vueItems" mandatory />
    </div>

    <!-- v0 version -->
    <div class="flex flex-col gap-1.5">
      <label class="field-label">@vuetify/v0</label>
      <div v-if="playground.fetching.value" class="select-skeleton" />
      <AppSelect v-else v-model="v0Model" :items="v0Items" mandatory />
    </div>
  </div>
</template>

<style scoped>
.field-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--v0-on-surface-variant);
  opacity: 0.7;
}

.select-skeleton {
  background: var(--v0-surface-variant);
  border: 1px solid var(--v0-outline-variant, var(--v0-outline));
  border-radius: 6px;
  height: 32px;
  opacity: 0.5;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.25; }
}
</style>
