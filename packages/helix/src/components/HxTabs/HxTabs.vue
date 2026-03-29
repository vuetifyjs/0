<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { Tabs } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxTabItem {
    /** Value used to match with HxTabPanel */
    value: string
    /** Display label for the tab */
    label: string
  }

  export interface HxTabsProps extends V0PaperProps {
    /** Tab items to render */
    items: HxTabItem[]
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxTabs' })

  const { items, ...paperProps } = defineProps<HxTabsProps>()

  const model = defineModel<string>()
</script>

<template>
  <Tabs.Root v-model="model" mandatory="force">
    <V0Paper
      v-bind="paperProps"
      as="div"
      class="helix-tabs"
    >
      <Tabs.List
        class="helix-tabs__list"
        label="Tabs"
      >
        <Tabs.Item
          v-for="item in items"
          :key="item.value"
          class="helix-tabs__tab"
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
  .helix-tabs__list {
    display: flex;
    gap: 0;
  }

  .helix-tabs__tab {
    cursor: pointer;
    background: none;
    border: none;
    font: inherit;
  }
</style>
