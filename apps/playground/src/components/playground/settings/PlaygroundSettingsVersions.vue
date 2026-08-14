<script setup lang="ts">
  // Framework
  import { isArray, Switch } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppSelect from '@/components/app/AppSelect.vue'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Utilities
  import { computed, onMounted, toRef } from 'vue'

  // Types
  import type { AppSelectItem } from '@/components/app/AppSelect.vue'
  import type { ID } from '@vuetify/v0'

  const playground = usePlayground()

  onMounted(() => playground.fetchVersions())

  const isVuetifyPreset = toRef(() => playground.activePreset.value === 'vuetify')
  const isLocked = toRef(() => playground.isLocked.value)

  // Vue: null means "latest" in the ref, but the select uses 'latest' as the item id
  const vueModel = computed({
    get: (): ID => playground.vueVersion.value ?? 'latest',
    set: (id: ID | ID[]) => {
      if (isLocked.value) return
      const value = isArray(id) ? id[0] : id
      playground.vueVersion.value = value === 'latest' ? null : String(value)
    },
  })

  // v0: 'latest' string is used directly as the item id
  const v0Model = computed({
    get: (): ID => playground.v0Version.value,
    set: (id: ID | ID[]) => {
      if (isLocked.value) return
      playground.v0Version.value = String(isArray(id) ? id[0] : id)
    },
  })

  // Vuetify: 'latest' string is used directly as the item id
  const vuetifyModel = computed({
    get: (): ID => playground.vuetifyVersion.value,
    set: (id: ID | ID[]) => {
      if (isLocked.value) return
      playground.vuetifyVersion.value = String(isArray(id) ? id[0] : id)
    },
  })

  const vuetifyNightly = computed({
    get: () => playground.vuetifyNightly.value,
    set: (value: boolean) => {
      if (isLocked.value) return
      playground.vuetifyNightly.value = value
      // When toggling nightly, reset to latest/head of the new list
      playground.vuetifyVersion.value = 'latest'
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

  const vuetifyItems = toRef((): AppSelectItem[] => {
    const versions = vuetifyNightly.value
      ? playground.vuetifyNightlyVersions.value
      : playground.vuetifyVersions.value
    return [
      { id: 'latest', label: 'Latest' },
      ...(versions ?? []).map(v => ({ id: v, label: v })),
    ]
  })

  function openVueReleaseNotes () {
    const version = vueModel.value === 'latest'
      ? playground.vueVersions.value?.[0]
      : String(vueModel.value)
    if (version) {
      window.open(`https://github.com/vuejs/core/releases/tag/v${version}`, '_blank')
    }
  }

  function openVuetifyReleaseNotes () {
    window.open('https://vuetifyjs.com/getting-started/release-notes/', '_blank')
  }

  function openV0ReleaseNotes () {
    const version = v0Model.value === 'latest'
      ? playground.v0Versions.value?.[0]
      : String(v0Model.value)
    if (version) {
      window.open(`https://github.com/vuetifyjs/0/releases/tag/v${version}`, '_blank')
    }
  }
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Vue version -->
    <div class="dep-row">
      <div class="dep-header">
        <AppIcon class="dep-icon text-[#42b883]" icon="lang-vue" :size="18" />
        <label class="field-label">Vue</label>

        <button
          class="release-btn"
          title="Release notes"
          type="button"
          @click="openVueReleaseNotes"
        >
          <AppIcon icon="book-open" :size="12" />
        </button>
      </div>

      <div v-if="playground.fetching.value" class="select-skeleton" />

      <AppSelect
        v-else
        v-model="vueModel"
        :disabled="isLocked"
        :items="vueItems"
        mandatory
      />
    </div>

    <!-- Vuetify version (only shown with vuetify preset) -->
    <div v-if="isVuetifyPreset" class="dep-row">
      <div class="dep-header">
        <AppIcon class="dep-icon text-[#1867c0]" icon="vuetify" :size="18" />
        <label class="field-label">Vuetify</label>

        <button
          class="release-btn"
          title="Release notes"
          type="button"
          @click="openVuetifyReleaseNotes"
        >
          <AppIcon icon="book-open" :size="12" />
        </button>
      </div>

      <div v-if="playground.fetching.value" class="select-skeleton" />

      <AppSelect
        v-else
        v-model="vuetifyModel"
        :disabled="isLocked"
        :items="vuetifyItems"
        mandatory
      />

      <!-- Nightly toggle -->
      <div class="nightly-row">
        <span class="nightly-label">Nightly</span>

        <Switch.Root
          v-model="vuetifyNightly"
          aria-label="Use nightly builds"
          class="shrink-0 inline-flex items-center border-none bg-transparent p-0 outline-none"
          :disabled="isLocked"
        >
          <Switch.Track
            class="relative inline-flex items-center rounded-full transition-colors w-8 h-4"
            :class="isLocked ? 'opacity-50 cursor-not-allowed' : ''"
            :style="{ background: vuetifyNightly ? 'var(--v0-primary)' : 'var(--v0-on-surface, #666)/20%' }"
          >
            <Switch.Thumb
              class="![visibility:visible] block size-3 rounded-full bg-white shadow-sm transition-transform"
              :style="{ transform: vuetifyNightly ? 'translateX(16px)' : 'translateX(2px)' }"
            />
          </Switch.Track>
        </Switch.Root>
      </div>
    </div>

    <!-- v0 version (only shown when NOT using vuetify preset) -->
    <div v-if="!isVuetifyPreset" class="dep-row">
      <div class="dep-header">
        <AppIcon class="dep-icon text-primary" icon="vuetify-0" :size="18" />
        <label class="field-label">@vuetify/v0</label>

        <button
          class="release-btn"
          title="Release notes"
          type="button"
          @click="openV0ReleaseNotes"
        >
          <AppIcon icon="book-open" :size="12" />
        </button>
      </div>

      <div v-if="playground.fetching.value" class="select-skeleton" />

      <AppSelect
        v-else
        v-model="v0Model"
        :disabled="isLocked"
        :items="v0Items"
        mandatory
      />
    </div>

    <!-- Add Dependency (disabled, Coming Soon parity with play) -->
    <button
      class="add-dep-btn"
      disabled
      type="button"
    >
      <AppIcon icon="file-plus" :size="14" />
      <span>Add Dependency</span>
      <span class="coming-soon">soon</span>
    </button>
  </div>
</template>

<style scoped>
.dep-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dep-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dep-icon {
  flex-shrink: 0;
  opacity: 0.9;
}

.field-label {
  flex: 1;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--v0-on-surface-variant);
  opacity: 0.7;
}

.release-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  color: var(--v0-on-surface-variant);
  opacity: 0.6;
  transition: opacity 0.15s, background 0.15s;
}

.release-btn:hover {
  opacity: 1;
  background: var(--v0-surface-tint);
}

.nightly-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
}

.nightly-label {
  font-size: 12px;
  color: var(--v0-on-surface-variant);
}

.select-skeleton {
  background: var(--v0-surface-variant);
  border: 1px solid var(--v0-outline-variant, var(--v0-outline));
  border-radius: 6px;
  height: 32px;
  opacity: 0.5;
  animation: pulse 1.5s ease-in-out infinite;
}

.add-dep-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px dashed var(--v0-outline-variant, var(--v0-outline));
  border-radius: 6px;
  color: var(--v0-on-surface-variant);
  font-size: 12px;
  opacity: 0.5;
  cursor: not-allowed;
}

.coming-soon {
  margin-left: auto;
  font-size: 10px;
  border: 1px solid currentColor;
  border-radius: 3px;
  padding: 1px 4px;
  opacity: 0.6;
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.25; }
}
</style>
