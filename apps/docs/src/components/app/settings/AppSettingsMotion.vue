<script setup lang="ts">
  // Composables
  import { useSettings, type DocSettings } from '@/composables/useSettings'

  // Types
  import type { SingleSelectOption } from './AppSettingsSingleSelect.vue'

  const { reduceMotion } = useSettings()

  const motionOptions: SingleSelectOption<DocSettings['reduceMotion']>[] = [
    { id: 'system', value: 'system', label: 'System default' },
    { id: 'on', value: 'on', label: 'Reduce motion' },
    { id: 'off', value: 'off', label: 'Full motion' },
  ]
</script>

<template>
  <section>
    <AppSettingsHeader icon="vapor" title="Motion" />
    <AppSettingsSingleSelect
      v-model="reduceMotion"
      aria-label="Motion preference"
      layout="radio"
      :options="motionOptions"
    />
    <p class="text-xs text-on-surface-variant/60 mt-2">
      Reduce or disable animations
    </p>
  </section>
</template>
