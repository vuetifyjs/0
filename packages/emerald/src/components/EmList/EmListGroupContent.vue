<script lang="ts">
  // Framework
  import { CollapsibleContent } from '@vuetify/v0'

  export interface EmListGroupContentProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmListGroupContent' })
</script>

<template>
  <CollapsibleContent as="ul" class="emerald-list__group-content" role="list">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </CollapsibleContent>
</template>
