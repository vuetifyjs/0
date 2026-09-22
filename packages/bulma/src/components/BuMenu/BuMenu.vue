/**
 * @module BuMenu
 *
 * @remarks
 * Bulma `aside.menu` slot host over v0 Single.Root. Compose BuMenuLabel,
 * BuMenuList, BuMenuItem, and BuMenuLink — selection is exclusive via
 * v-model; nested lists use BuMenuList with `nested`.
 */

<script lang="ts">
  // Framework
  import { Single } from '@vuetify/v0'
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'BuMenu' })

  defineSlots<{
    /** Labels, lists, items, and links */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: T]
  }>()

  const model = defineModel<T>()
</script>

<template>
  <aside class="menu">
    <Single.Root v-model="model">
      <slot />
    </Single.Root>
  </aside>
</template>
