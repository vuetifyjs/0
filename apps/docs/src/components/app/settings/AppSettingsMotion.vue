<script setup lang="ts">
  // Framework
  import { createSingle } from '@vuetify/v0'

  // Composables
  import { useSettings, type DocSettings } from '@/composables/useSettings'

  // Utilities
  import { watch } from 'vue'

  const { reduceMotion } = useSettings()

  const motionOptions = [
    { id: 'system', value: 'system' as DocSettings['reduceMotion'], label: 'System default' },
    { id: 'on', value: 'on' as DocSettings['reduceMotion'], label: 'Reduce motion' },
    { id: 'off', value: 'off' as DocSettings['reduceMotion'], label: 'Full motion' },
  ]

  const motionSingle = createSingle({ mandatory: true })
  motionSingle.onboard(motionOptions)
  motionSingle.select(reduceMotion.value)

  watch(() => motionSingle.selectedValue.value, val => {
    if (val) reduceMotion.value = val as DocSettings['reduceMotion']
  })
</script>

<template>
  <section>
    <h3 class="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
      <AppIcon icon="vapor" size="16" />
      <span>Motion</span>
    </h3>
    <div aria-label="Motion preference" class="space-y-1" role="radiogroup">
      <button
        v-for="option in motionOptions"
        :key="option.id"
        :aria-checked="motionSingle.selectedId.value === option.id"
        :class="[
          'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left',
          motionSingle.selectedId.value === option.id
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-surface-tint text-on-surface',
        ]"
        role="radio"
        type="button"
        @click="motionSingle.select(option.id)"
      >
        <span
          :class="[
            'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
            motionSingle.selectedId.value === option.id ? 'border-primary' : 'border-divider',
          ]"
        >
          <span
            v-if="motionSingle.selectedId.value === option.id"
            class="w-2 h-2 rounded-full bg-primary"
          />
        </span>
        <span>{{ option.label }}</span>
      </button>
    </div>
    <p class="text-xs text-on-surface-variant/60 mt-2">
      Reduce or disable animations
    </p>
  </section>
</template>
