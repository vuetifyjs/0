<script setup lang="ts">
  // Composables
  import { useSettings, type CodeSize } from '@/composables/useSettings'

  // Types
  import type { SingleSelectOption } from './AppSettingsSingleSelect.vue'

  const settings = useSettings()

  const sizes: SingleSelectOption<CodeSize>[] = [
    { id: 'small', value: 'small', label: 'Small', icon: 'size-small' },
    { id: 'medium', value: 'medium', label: 'Medium', icon: 'size-medium' },
    { id: 'large', value: 'large', label: 'Large', icon: 'size-large' },
  ]
</script>

<template>
  <section>
    <AppSettingsHeader icon="size-medium" title="Code Size" />

    <AppSettingsSingleSelect
      v-model="settings.codeSize.value"
      aria-label="Code size"
      layout="group"
      :options="sizes"
    />

    <p class="text-xs text-on-surface-variant/60 mt-2">
      Font size for code blocks
    </p>
  </section>
</template>
