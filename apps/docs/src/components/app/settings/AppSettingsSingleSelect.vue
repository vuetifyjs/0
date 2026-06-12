<script setup lang="ts" generic="T extends string">
  // Framework
  import { createSingle } from '@vuetify/v0'

  // Utilities
  import { watch } from 'vue'

  export interface SingleSelectOption<V = string> {
    id: string
    value: V
    label: string
    icon?: string
  }

  const props = defineProps<{
    options: SingleSelectOption<T>[]
    ariaLabel: string
    layout?: 'grid' | 'list' | 'radio' | 'group'
    columns?: number
    mono?: boolean
  }>()

  const model = defineModel<T>({ required: true })

  const single = createSingle({ mandatory: true })
  single.onboard(props.options)
  single.select(model.value)

  watch(() => single.selectedValue.value, val => {
    if (val) model.value = val as T
  })

  watch(model, val => {
    if (val !== single.selectedValue.value) single.select(val)
  })
</script>

<template>
  <!-- Grid layout (Theme, PackageManager) -->
  <div
    v-if="layout === 'grid' || !layout"
    :aria-label
    class="grid gap-2"
    role="radiogroup"
    :style="{ gridTemplateColumns: `repeat(${columns ?? 2}, 1fr)` }"
  >
    <button
      v-for="option in options"
      :key="option.id"
      :aria-checked="single.selectedId.value === option.id"
      :class="[
        'flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors text-sm',
        mono && 'font-mono justify-center',
        single.selectedId.value === option.id
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-divider hover:border-primary/50 text-on-surface',
      ]"
      role="radio"
      type="button"
      @click="single.select(option.id)"
    >
      <AppIcon v-if="option.icon" :icon="option.icon" size="16" />
      <span>{{ option.label }}</span>
    </button>
  </div>

  <!-- List layout -->
  <div
    v-else-if="layout === 'list'"
    :aria-label
    class="space-y-1"
    role="radiogroup"
  >
    <button
      v-for="option in options"
      :key="option.id"
      :aria-checked="single.selectedId.value === option.id"
      :class="[
        'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left',
        single.selectedId.value === option.id
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-surface-variant text-on-surface',
      ]"
      role="radio"
      type="button"
      @click="single.select(option.id)"
    >
      <AppIcon v-if="option.icon" :icon="option.icon" size="16" />
      <span>{{ option.label }}</span>
    </button>
  </div>

  <!-- Button group layout (CodeSize) -->
  <div
    v-else-if="layout === 'group'"
    :aria-label
    class="flex items-center gap-0.5 border border-divider rounded-lg p-0.5 bg-surface"
    role="radiogroup"
  >
    <button
      v-for="option in options"
      :key="option.id"
      :aria-checked="single.selectedId.value === option.id"
      :class="[
        'flex-1 flex items-center justify-center gap-2 px-2.5 py-1 text-xs font-medium rounded-md transition-colors',
        single.selectedId.value === option.id
          ? 'bg-primary text-on-primary'
          : 'text-on-surface-variant hover:text-on-surface',
      ]"
      role="radio"
      type="button"
      @click="single.select(option.id)"
    >
      <AppIcon v-if="option.icon" :icon="option.icon" size="16" />
      <span>{{ option.label }}</span>
    </button>
  </div>

  <!-- Radio layout (Motion) -->
  <div
    v-else-if="layout === 'radio'"
    :aria-label
    class="space-y-1"
    role="radiogroup"
  >
    <button
      v-for="option in options"
      :key="option.id"
      :aria-checked="single.selectedId.value === option.id"
      :class="[
        'w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left',
        single.selectedId.value === option.id
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-surface-variant text-on-surface',
      ]"
      role="radio"
      type="button"
      @click="single.select(option.id)"
    >
      <span
        :class="[
          'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
          single.selectedId.value === option.id ? 'border-primary' : 'border-divider',
        ]"
      >
        <span
          v-if="single.selectedId.value === option.id"
          class="w-2 h-2 rounded-full bg-primary"
        />
      </span>

      <span>{{ option.label }}</span>
    </button>
  </div>
</template>
