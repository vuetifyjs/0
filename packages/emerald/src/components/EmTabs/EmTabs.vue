<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Types
  import type { TabsOrientation, TabsRootProps } from '@vuetify/v0'

  export type EmTabsOrientation = TabsOrientation

  export interface EmTabsProps extends Pick<
    TabsRootProps,
    'disabled' | 'mandatory' | 'circular' | 'orientation' | 'activation' | 'namespace'
  > {}
</script>

<script lang="ts" setup generic="T">
  defineOptions({ name: 'EmTabs' })

  const {
    disabled = false,
    mandatory = 'force',
    circular = true,
    orientation = 'horizontal',
    activation = 'automatic',
    namespace,
  } = defineProps<EmTabsProps>()

  const model = defineModel<T | T[]>()
</script>

<template>
  <div class="emerald-tabs" :data-disabled="disabled || undefined" :data-orientation="orientation">
    <Tabs.Root
      v-slot="slotProps"
      v-model="model"
      :activation
      :circular
      :disabled
      :mandatory
      :namespace
      :orientation
    >
      <slot v-bind="slotProps" />
    </Tabs.Root>
  </div>
</template>

<style>
  .emerald-tabs {
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
    width: 100%;
  }
</style>
