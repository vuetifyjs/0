<script lang="ts">
  // Framework
  import { TooltipActivator } from '@vuetify/v0'

  export interface EmTooltipActivatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipActivator' })
</script>

<template>
  <TooltipActivator class="emerald-tooltip__activator">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </TooltipActivator>
</template>
