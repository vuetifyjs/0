<script setup lang="ts">
  // Framework
  import { Switch } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  const playground = usePlayground()

  interface Preference {
    id: 'wordWrap' | 'showErrors'
    label: string
    description: string
    icon: string
  }

  const preferences: Preference[] = [
    {
      id: 'wordWrap',
      label: 'Word wrap',
      description: 'Wrap long lines instead of scrolling horizontally',
      icon: 'wrap',
    },
    {
      id: 'showErrors',
      label: 'Show errors',
      description: 'Highlight type and syntax errors inline in the editor',
      icon: 'alert',
    },
  ]
</script>

<template>
  <div class="flex flex-col gap-1">
    <div
      v-for="preference in preferences"
      :key="preference.id"
      class="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-divider"
    >
      <AppIcon class="shrink-0 text-on-surface-variant" :icon="preference.icon" :size="16" />

      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-on-surface">{{ preference.label }}</div>
        <div class="text-xs text-on-surface-variant mt-0.5">{{ preference.description }}</div>
      </div>

      <Switch.Root
        class="shrink-0 inline-flex items-center border-none bg-transparent p-0 outline-none"
        :label="preference.label"
        :model-value="playground[preference.id].value"
        @update:model-value="playground[preference.id].value = $event"
      >
        <Switch.Track class="relative inline-flex items-center rounded-full transition-colors w-9 h-5 bg-on-surface/20 data-[state=checked]:bg-primary">
          <Switch.Thumb class="![visibility:visible] block size-3.5 rounded-full bg-white shadow-sm transition-transform translate-x-0.75 data-[state=checked]:translate-x-4.75" />
        </Switch.Track>
      </Switch.Root>
    </div>
  </div>
</template>
