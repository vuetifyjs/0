<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { Tabs } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxTabItem {
    /** Value used to match with CxTabPanel */
    value: string
    /** Display label for the tab */
    label: string
  }

  export interface CxTabsProps extends V0PaperProps {
    /** Tab items to render */
    items: CxTabItem[]
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxTabs' })

  const { items, ...paperProps } = defineProps<CxTabsProps>()

  const model = defineModel<string>()
</script>

<template>
  <Tabs.Root v-model="model" mandatory="force">
    <V0Paper
      v-bind="paperProps"
      as="div"
      class="codex-tabs"
    >
      <Tabs.List
        class="codex-tabs__list"
        label="Tabs"
      >
        <Tabs.Item
          v-for="item in items"
          :key="item.value"
          class="codex-tabs__tab"
          :value="item.value"
        >
          {{ item.label }}
        </Tabs.Item>
      </Tabs.List>
    </V0Paper>

    <slot />
  </Tabs.Root>
</template>

<style scoped>
  .codex-tabs__list {
    display: flex;
    gap: 0;
  }

  .codex-tabs__tab {
    cursor: pointer;
    background: none;
    border: none;
    font: inherit;
  }
</style>
