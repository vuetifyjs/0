<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxCodeGroupItem {
    /** Tab label */
    label: string
    /** Raw code string */
    code: string
    /** Language identifier */
    language?: string
  }

  export interface HxCodeGroupProps extends V0PaperProps {
    /** Code items to display as tabs */
    items: HxCodeGroupItem[]
  }
</script>

<script setup lang="ts">
  // Components
  import HxCodeBlock from '#helix/components/HxCodeBlock/HxCodeBlock.vue'
  import HxCodeBlockActions from '#helix/components/HxCodeBlock/HxCodeBlockActions.vue'
  import HxTabPanel from '#helix/components/HxTabs/HxTabPanel.vue'
  import HxTabs from '#helix/components/HxTabs/HxTabs.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'HxCodeGroup' })

  const {
    items,
    ...paperProps
  } = defineProps<HxCodeGroupProps>()

  const active = defineModel<string>({ default: undefined })

  const tabs = toRef(() => items.map(item => ({
    value: item.label,
    label: item.label,
  })))
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="helix-code-group"
  >
    <HxTabs v-model="active" :items="tabs">
      <HxTabPanel
        v-for="item in items"
        :key="item.label"
        :value="item.label"
      >
        <HxCodeBlock
          :code="item.code"
          :language="item.language"
        >
          <HxCodeBlockActions :code="item.code" />
        </HxCodeBlock>
      </HxTabPanel>
    </HxTabs>
  </V0Paper>
</template>

<style scoped>
  .helix-code-group {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--v0-divider);
    border-radius: 0.5rem;
    background-color: var(--v0-surface);
  }

  .helix-code-group :deep(.helix-code-block) {
    border: none;
    border-radius: 0;
  }

  .helix-code-group :deep([role='tablist']) {
    display: flex;
    background-color: var(--v0-surface-tint);
    border-bottom: 1px solid var(--v0-divider);
  }

  .helix-code-group :deep([role='tab']) {
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--v0-on-surface-variant);
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }

  .helix-code-group :deep([role='tab'][data-selected]),
  .helix-code-group :deep([role='tab'][aria-selected='true']) {
    color: var(--v0-primary);
    border-bottom-color: var(--v0-primary);
  }
</style>
