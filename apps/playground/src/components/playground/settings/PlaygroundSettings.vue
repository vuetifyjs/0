<script setup lang="ts">
  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'
  import AppIcon from '@/components/app/AppIcon.vue'
  import PlaygroundSettingsExport from './PlaygroundSettingsExport.vue'
  import PlaygroundSettingsPresets from './PlaygroundSettingsPresets.vue'
  import PlaygroundSettingsVersions from './PlaygroundSettingsVersions.vue'

  // Utilities
  import { type Component, shallowRef, toRef } from 'vue'

  defineEmits<{ close: [] }>()

  const active = shallowRef('versions')

  interface Section {
    id: string
    label: string
    icon: string
    component: Component | null
    available: boolean
  }

  const sections: Section[] = [
    { id: 'versions', label: 'Versions', icon: 'tags', component: PlaygroundSettingsVersions, available: true },
    { id: 'presets', label: 'Presets', icon: 'layers', component: PlaygroundSettingsPresets, available: true },
    { id: 'export', label: 'Export', icon: 'download', component: PlaygroundSettingsExport, available: true },
  ]

  const current = toRef(() => sections.find(s => s.id === active.value))
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center" tabindex="-1" @keydown.esc="$emit('close')">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50"
        @click="$emit('close')"
      />

      <!-- Modal -->
      <div aria-labelledby="settings-title" aria-modal="true" class="relative bg-surface border border-divider rounded-lg shadow-xl w-[560px] h-[460px] flex overflow-hidden" role="dialog">
        <!-- Left nav -->
        <nav class="w-40 shrink-0 border-r border-divider flex flex-col py-2">
          <button
            v-for="section in sections"
            :key="section.id"
            class="flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
            :class="[
              section.available ? 'cursor-pointer hover:bg-surface-tint' : 'cursor-default opacity-40',
              active === section.id ? 'bg-surface-tint opacity-100' : '',
            ]"
            :disabled="!section.available"
            type="button"
            @click="section.available && (active = section.id)"
          >
            <AppIcon :icon="section.icon" :size="16" />
            <span>{{ section.label }}</span>

            <span
              v-if="!section.available"
              class="ml-auto text-[10px] opacity-60 border border-current rounded px-1"
            >soon</span>
          </button>
        </nav>

        <!-- Content -->
        <div class="flex-1 flex flex-col min-h-0">
          <div class="flex items-center justify-between px-4 py-3 border-b border-divider">
            <h2 id="settings-title" class="text-sm font-medium">
              {{ current?.label }}
            </h2>

            <AppCloseButton @click="$emit('close')" />
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <component
              :is="current?.component"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
