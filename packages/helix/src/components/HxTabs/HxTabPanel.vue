<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  export interface HxTabPanelProps {
    /** Value matching the corresponding tab item */
    value: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxTabPanel' })

  const { value } = defineProps<HxTabPanelProps>()
</script>

<template>
  <Tabs.Panel
    class="helix-tab-panel"
    :value
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </Tabs.Panel>
</template>
