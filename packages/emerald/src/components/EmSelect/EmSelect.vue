<script lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'
  // Utilities
  import { useId } from '@vuetify/v0/utilities'

  export interface EmSelectProps {
    id?: string
    name?: string
    form?: string
    disabled?: boolean
    multiple?: boolean
    mandatory?: boolean | 'force'
    namespace?: string
    /** Visible field label associated with the activator */
    label?: string
  }
</script>

<script setup lang="ts" generic="T = unknown">
  defineOptions({ name: 'EmSelect' })

  const {
    id: idProp,
    name,
    form,
    disabled = false,
    multiple = false,
    mandatory = false,
    namespace,
    label,
  } = defineProps<EmSelectProps>()

  const model = defineModel<T | T[]>()
  const fallbackId = useId()
  const id = idProp ?? fallbackId
</script>

<template>
  <!-- Select.Root is renderless — host class on a real element -->
  <div class="emerald-select" :data-disabled="disabled || undefined">
    <label
      v-if="label"
      class="emerald-select__label"
      :for="`${id}-activator`"
    >
      {{ label }}
    </label>

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

  .emerald-select__label {
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 21px);
    font-weight: var(--emerald-text-b2-bold-weight, 600);
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .emerald-select[data-disabled] .emerald-select__label {
    color: var(--emerald-neutral-400, #aeb6be);
  }
</style>
