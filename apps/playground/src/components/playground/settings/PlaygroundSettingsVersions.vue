<script setup lang="ts">
  // Components
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Utilities
  import { onMounted } from 'vue'

  const playground = usePlayground()

  onMounted(() => playground.fetchVersions())
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Vue version -->
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-medium opacity-60 uppercase tracking-wide" for="select-vue">Vue</label>
      <div v-if="playground.fetching.value" class="version-select-skeleton" />
      <select
        v-else
        id="select-vue"
        class="version-select"
        :value="playground.vueVersion.value ?? ''"
        @change="playground.vueVersion.value = ($event.target as HTMLSelectElement).value || null"
      >
        <option value="">Latest</option>
        <!-- If fetch failed, vueVersions is empty — only the Latest option shows -->
        <option
          v-for="v in playground.vueVersions.value"
          :key="v"
          :value="v"
        >{{ v }}</option>
      </select>
    </div>

    <!-- v0 version -->
    <div class="flex flex-col gap-1.5">
      <label class="text-xs font-medium opacity-60 uppercase tracking-wide" for="select-v0">@vuetify/v0</label>
      <div v-if="playground.fetching.value" class="version-select-skeleton" />
      <select
        v-else
        id="select-v0"
        class="version-select"
        :value="playground.v0Version.value"
        @change="playground.v0Version.value = ($event.target as HTMLSelectElement).value"
      >
        <option value="latest">Latest</option>
        <!-- If fetch failed, v0Versions is empty — only the Latest option shows -->
        <option
          v-for="v in playground.v0Versions.value"
          :key="v"
          :value="v"
        >{{ v }}</option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.version-select {
  appearance: none;
  background: var(--v0-surface-variant);
  border: 1px solid var(--v0-outline-variant, var(--v0-outline));
  border-radius: 6px;
  color: var(--v0-on-surface);
  cursor: pointer;
  font-size: 13px;
  padding: 6px 10px;
  width: 100%;
}

.version-select:focus {
  outline: 2px solid var(--v0-primary);
  outline-offset: -1px;
}

.version-select-skeleton {
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
