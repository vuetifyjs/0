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
    gap: 0.25rem;
    border-bottom: 1px solid var(--v0-divider);
  }

  .helix-tabs__tab {
    cursor: pointer;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.5rem 1rem;
    font: inherit;
    color: var(--v0-on-surface-variant);
    transition: color 150ms ease, border-color 150ms ease;
    margin-bottom: -1px;
  }

  .helix-tabs__tab:hover {
    color: var(--v0-on-surface);
    background-color: var(--v0-surface-tint);
  }

  .helix-tabs__tab:focus-visible {
    outline: 2px solid var(--v0-primary);
    outline-offset: -2px;
  }

  .helix-tabs__tab[data-selected] {
    color: var(--v0-primary);
    border-bottom-color: var(--v0-primary);
    font-weight: 600;
  }
</style>
