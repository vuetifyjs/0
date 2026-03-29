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
  }
</style>
