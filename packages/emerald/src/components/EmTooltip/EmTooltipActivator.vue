<script lang="ts">
  // Framework
  import { PopoverActivator } from '@vuetify/v0'

  export interface EmTooltipActivatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltipActivator' })
</script>

<template>
  <PopoverActivator class="emerald-tooltip__activator">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PopoverActivator>
</template>
