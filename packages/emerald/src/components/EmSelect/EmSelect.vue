<script lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'

  export interface EmSelectProps {
    id?: string
    name?: string
    form?: string
    disabled?: boolean
    multiple?: boolean
    mandatory?: boolean | 'force'
    namespace?: string
  }
</script>

<script setup lang="ts" generic="T = unknown">
  defineOptions({ name: 'EmSelect' })

  const {
    id,
    name,
    form,
    disabled = false,
    multiple = false,
    mandatory = false,
    namespace,
  } = defineProps<EmSelectProps>()

  const model = defineModel<T | T[]>()
</script>

<template>
  <!-- Select.Root is renderless — host class on a real element -->
  <div class="emerald-select" :data-disabled="disabled || undefined">
    <Select.Root
      :id
      v-model="model"
      :disabled
      :form
      :mandatory
      :multiple
      :name
      :namespace
    >
      <slot />
    </Select.Root>
  </div>
</template>

<style>
  .emerald-select {
    display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    gap: var(--emerald-spacing-2xs, 4px);
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    width: 100%;
  }
</style>
