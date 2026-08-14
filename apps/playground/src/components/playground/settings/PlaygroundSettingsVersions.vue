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
    <div class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <AppIcon class="shrink-0 opacity-90 text-[#42b883]" icon="lang-vue" :size="18" />
        <label class="flex-1 text-xs font-semibold text-on-surface-variant uppercase tracking-wide opacity-70">Vue</label>

        <button
          class="flex items-center justify-center size-5 rounded text-on-surface-variant opacity-60 transition-opacity hover:opacity-100 hover:bg-surface-tint"
          title="Release notes"
          type="button"
          @click="openVueReleaseNotes"
        >
          <AppIcon icon="book-open" :size="12" />
        </button>
      </div>

      <div v-if="playground.fetching.value" class="h-8 rounded-md bg-surface-variant border border-outline-variant opacity-50 animate-pulse" />

      <AppSelect
        v-else
        v-model="vueModel"
        :disabled="isLocked"
        :items="vueItems"
        mandatory
      />
    </div>

    <!-- Vuetify version (only shown with vuetify preset) -->
    <div v-if="isVuetifyPreset" class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <AppIcon class="shrink-0 opacity-90 text-[#1867c0]" icon="vuetify" :size="18" />
        <label class="flex-1 text-xs font-semibold text-on-surface-variant uppercase tracking-wide opacity-70">Vuetify</label>

        <button
          class="flex items-center justify-center size-5 rounded text-on-surface-variant opacity-60 transition-opacity hover:opacity-100 hover:bg-surface-tint"
          title="Release notes"
          type="button"
          @click="openVuetifyReleaseNotes"
        >
          <AppIcon icon="book-open" :size="12" />
        </button>
      </div>

      <div v-if="playground.fetching.value" class="h-8 rounded-md bg-surface-variant border border-outline-variant opacity-50 animate-pulse" />

      <AppSelect
        v-else
        v-model="vuetifyModel"
        :disabled="isLocked"
        :items="vuetifyItems"
        mandatory
      />

      <!-- Nightly toggle -->
      <div class="flex items-center justify-between py-1.5">
        <span class="text-xs text-on-surface-variant">Nightly</span>

        <Switch.Root
          v-model="vuetifyNightly"
          aria-label="Use nightly builds"
          class="shrink-0 inline-flex items-center border-none bg-transparent p-0 outline-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
          :disabled="isLocked"
        >
          <Switch.Track class="relative inline-flex items-center rounded-full transition-colors w-9 h-5 bg-on-surface/20 data-[state=checked]:bg-primary">
            <Switch.Thumb class="![visibility:visible] block size-3.5 rounded-full bg-white shadow-sm transition-transform translate-x-0.75 data-[state=checked]:translate-x-4.75" />
          </Switch.Track>
        </Switch.Root>
      </div>
    </div>

    <!-- v0 version (only shown when NOT using vuetify preset) -->
    <div v-if="!isVuetifyPreset" class="flex flex-col gap-2">
      <div class="flex items-center gap-2">
        <AppIcon class="shrink-0 opacity-90 text-primary" icon="vuetify-0" :size="18" />
        <label class="flex-1 text-xs font-semibold text-on-surface-variant uppercase tracking-wide opacity-70">@vuetify/v0</label>

        <button
          class="flex items-center justify-center size-5 rounded text-on-surface-variant opacity-60 transition-opacity hover:opacity-100 hover:bg-surface-tint"
          title="Release notes"
          type="button"
          @click="openV0ReleaseNotes"
        >
          <AppIcon icon="book-open" :size="12" />
        </button>
      </div>

      <div v-if="playground.fetching.value" class="h-8 rounded-md bg-surface-variant border border-outline-variant opacity-50 animate-pulse" />

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
      class="flex items-center gap-2 px-3 py-2 border border-dashed border-outline-variant rounded-md text-xs text-on-surface-variant opacity-50 cursor-not-allowed"
      disabled
      type="button"
    >
      <AppIcon icon="file-plus" :size="14" />
      <span>Add Dependency</span>
      <span class="ml-auto text-[10px] border border-current rounded-sm px-1 opacity-60">soon</span>
    </button>
  </div>
</template>
