<script setup lang="ts">
  // Components
  import PlaygroundSettingsVersions from './PlaygroundSettingsVersions.vue'
  import AppCloseButton from '@/components/app/AppCloseButton.vue'
  import AppIcon from '@/components/app/AppIcon.vue'

  // Utilities
  import { shallowRef } from 'vue'

  defineEmits<{ close: [] }>()

  const active = shallowRef('versions')

  const sections = [
    { id: 'versions', label: 'Versions', icon: 'cog', component: PlaygroundSettingsVersions, available: true },
    { id: 'presets', label: 'Presets', icon: 'folder', component: null, available: false },
    { id: 'export', label: 'Export', icon: 'file-plus', component: null, available: false },
  ] as const
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50"
        @click="$emit('close')"
      />

      <!-- Modal -->
      <div class="relative bg-surface border border-divider rounded-lg shadow-xl w-[560px] max-h-[80vh] flex overflow-hidden">
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
            <h2 class="text-sm font-medium">
              {{ sections.find(s => s.id === active)?.label }}
            </h2>
            <AppCloseButton @click="$emit('close')" />
          </div>

          <div class="flex-1 overflow-y-auto p-4">
            <component
              :is="sections.find(s => s.id === active)?.component"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
