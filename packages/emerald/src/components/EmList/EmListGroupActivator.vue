<script lang="ts">
  // Framework
  import { CollapsibleActivator } from '@vuetify/v0'

  export interface EmListGroupActivatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmListGroupActivator' })
</script>

<template>
  <CollapsibleActivator class="emerald-list__group-activator">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CollapsibleActivator>
</template>
