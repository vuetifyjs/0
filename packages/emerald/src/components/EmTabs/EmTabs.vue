<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'

  // Types
  import type { TabsActivation } from '@vuetify/v0'

  export type EmTabsOrientation = 'horizontal' | 'vertical'

  export interface EmTabsProps {
    disabled?: boolean
    mandatory?: boolean | 'force'
    circular?: boolean
    orientation?: EmTabsOrientation
    activation?: TabsActivation
  }
</script>

<script lang="ts" setup generic="T">
  defineOptions({ name: 'EmTabs' })

  const {
    disabled = false,
    mandatory = 'force',
    circular = true,
    orientation = 'horizontal',
    activation = 'automatic',
  } = defineProps<EmTabsProps>()

  const model = defineModel<T | T[]>()
</script>

<template>
  <div class="emerald-tabs" :data-disabled="disabled || undefined" :data-orientation="orientation">
    <Tabs.Root
      v-model="model"
      :activation
      :circular
      :disabled
      :mandatory
      :orientation
    >
      <slot />
    </Tabs.Root>
  </div>
</template>
