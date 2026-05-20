<script lang="ts">
  // Framework
  import { Atom, SelectRoot } from '@vuetify/v0'

  // Types
  import type { AtomProps, ID } from '@vuetify/v0'

  export interface EmSelectProps extends AtomProps {
    disabled?: boolean
    multiple?: boolean
    mandatory?: boolean | 'force'
    name?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelect' })

  const {
    disabled = false,
    multiple = false,
    mandatory = false,
    name,
    as = 'div',
    renderless = false,
  } = defineProps<EmSelectProps>()

  const model = defineModel<ID | ID[] | undefined>()
</script>

<template>
  <Atom
    :as
    class="emerald-select"
    :data-disabled="disabled || undefined"
    :renderless
  >
    <SelectRoot
      v-model="model"
      :disabled
      :mandatory
      :multiple
      :name
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </SelectRoot>
  </Atom>
</template>

<style>
.emerald-select {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  gap: 0;
  border-radius: 4px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: 20px;
  color: #000000;
}

.emerald-select[data-disabled] {
  opacity: 0.5;
  pointer-events: none;
}
</style>
