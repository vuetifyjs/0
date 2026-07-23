<script lang="ts">
  // Framework
  import { CollapsibleRoot } from '@vuetify/v0'

  export interface EmListGroupProps {
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmListGroup' })

  const { disabled = false } = defineProps<EmListGroupProps>()

  const model = defineModel<boolean>({ default: false })
</script>

<template>
  <CollapsibleRoot
    v-model="model"
    as="li"
    class="emerald-list__group"
    :disabled
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CollapsibleRoot>
</template>
