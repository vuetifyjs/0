<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  export interface CxTabPanelProps {
    /** Value matching the corresponding tab item */
    value: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxTabPanel' })

  const { value } = defineProps<CxTabPanelProps>()
</script>

<template>
  <Tabs.Panel
    class="codex-tab-panel"
    :value
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </Tabs.Panel>
</template>
