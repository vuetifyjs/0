<script lang="ts">
  // Framework
  import { SwitchGroup } from '@vuetify/v0'

  export interface EmSwitchGroupProps {
    disabled?: boolean
    mandatory?: boolean | 'force'
    label?: string
    name?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSwitchGroup' })

  const {
    disabled = false,
    mandatory = false,
    label,
    name,
  } = defineProps<EmSwitchGroupProps>()

  const model = defineModel<unknown[]>({ default: () => [] })
</script>

<template>
  <SwitchGroup
    v-model="model"
    class="emerald-switch-group"
    :disabled
    :label
    :mandatory
    :name
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </SwitchGroup>
</template>

<style>
.emerald-switch-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
