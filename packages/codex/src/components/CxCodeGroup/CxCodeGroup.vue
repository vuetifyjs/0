<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxCodeGroupItem {
    /** Tab label */
    label: string
    /** Raw code string */
    code: string
    /** Language identifier */
    language?: string
  }

  export interface CxCodeGroupProps extends V0PaperProps {
    /** Code items to display as tabs */
    items: CxCodeGroupItem[]
  }
</script>

<script setup lang="ts">
  // Utilities
  import { toRef } from 'vue'

  // Components
  import CxCodeBlock from '../CxCodeBlock/CxCodeBlock.vue'
  import CxCodeBlockActions from '../CxCodeBlock/CxCodeBlockActions.vue'
  import CxTabPanel from '../CxTabs/CxTabPanel.vue'
  import CxTabs from '../CxTabs/CxTabs.vue'

  defineOptions({ name: 'CxCodeGroup' })

  const {
    items,
    ...paperProps
  } = defineProps<CxCodeGroupProps>()

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
    class="codex-code-group"
  >
    <CxTabs v-model="active" :items="tabs">
      <CxTabPanel
        v-for="item in items"
        :key="item.label"
        :value="item.label"
      >
        <CxCodeBlock
          :code="item.code"
          :language="item.language"
        >
          <CxCodeBlockActions :code="item.code" />
        </CxCodeBlock>
      </CxTabPanel>
    </CxTabs>
  </V0Paper>
</template>

<style scoped>
  .codex-code-group {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>
