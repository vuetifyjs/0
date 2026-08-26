<script lang="ts">
  // Framework
  import { Tabs } from '@vuetify/v0'
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'BuTabs', inheritAttrs: false })

  defineSlots<{
    /** Tabs context children — BuTabList and the BuTabPanel siblings that follow it. */
    default: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: T]
  }>()

  const model = defineModel<T>()
</script>

<template>
  <!--
    Renders no element of its own: Bulma's `.tabs` block is BuTabList, and the
    panels are siblings of it, so the selection context has to wrap both.
    Modifier classes belong on BuTabList.
  -->
  <Tabs.Root v-model="model">
    <slot />
  </Tabs.Root>
</template>
