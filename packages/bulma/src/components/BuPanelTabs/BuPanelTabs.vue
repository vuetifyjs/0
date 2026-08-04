/**
 * @module BuPanelTabs
 *
 * @remarks
 * Bulma `p.panel-tabs` — its own single-selection scope, independent of the
 * block selection BuPanel owns. `mandatory="force"` reproduces Bulma's docs,
 * where one tab is always active.
 */

<script lang="ts">
  // Framework
  import { Single } from '@vuetify/v0'
</script>

<script lang="ts" setup generic="T = string">
  defineOptions({ name: 'BuPanelTabs' })

  defineSlots<{
    /** BuPanelTab anchors. */
    default: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: T]
  }>()

  const model = defineModel<T>()

  function onModel (value: T | T[] | undefined) {
    model.value = value as T | undefined
  }
</script>

<template>
  <p class="panel-tabs">
    <Single.Root
      mandatory="force"
      :model-value="model"
      @update:model-value="onModel"
    >
      <slot />
    </Single.Root>
  </p>
</template>
