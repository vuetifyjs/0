<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import { TabsRoot } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'
  import type { TabsActivation } from '@vuetify/v0'

  export type EmTabsOrientation = 'horizontal' | 'vertical'

  export interface EmTabsProps extends V0PaperProps {
    disabled?: boolean
    mandatory?: boolean | 'force'
    circular?: boolean
    orientation?: EmTabsOrientation
    activation?: TabsActivation
  }
</script>

<script setup lang="ts" generic="T">
  defineOptions({ name: 'EmTabs' })

  const {
    disabled = false,
    mandatory = 'force',
    circular = true,
    orientation = 'horizontal',
    activation = 'automatic',
    ...paperProps
  } = defineProps<EmTabsProps>()

  const model = defineModel<T | T[]>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    as="div"
    class="emerald-tabs"
    :data-disabled="disabled || undefined"
    :data-orientation="orientation"
  >
    <TabsRoot
      v-model="model"
      :activation
      :circular
      :disabled
      :mandatory
      :orientation
    >
      <template #default="slotProps">
        <slot v-bind="slotProps" />
      </template>
    </TabsRoot>
  </V0Paper>
</template>

<style>
.emerald-tabs {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  color: var(--emerald-primary-950, #221065);
}

.emerald-tabs[data-orientation="vertical"] {
  flex-direction: row;
}
</style>
