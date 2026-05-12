<script lang="ts">
  // Framework
  import { PopoverActivator } from '@vuetify/v0'

  export interface EmMenuActivatorProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmMenuActivator' })
</script>

<template>
  <PopoverActivator class="emerald-menu__activator">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PopoverActivator>
</template>
