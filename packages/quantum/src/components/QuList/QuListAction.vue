<script lang="ts">
  // Framework
  import { isNullOrUndefined, useLogger } from '@vuetify/v0'

  // Context
  import { orphan, useQuList, useQuListItem } from './context'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuListAction' })

  defineSlots<{
    /** A `QuCheckbox`, `QuSwitch`, `QuRadio` or `QuIconToggle`, or Caption text: the secondary action or secondary info. */
    default?: () => any
  }>()

  const item = useQuListItem()
  const list = useQuList()

  orphan('QuListAction', 'QuList.Item', item)

  // An option cannot own a second target: the listbox pattern allows options and nothing else.
  if (__DEV__ && !isNullOrUndefined(list) && list.select.value !== 'none') {
    useLogger().warn('[QuListAction] a selectable list is a listbox and its options cannot host a secondary action; use select="none" for tiles with controls')
  }
</script>

<template>
  <div class="quantum-list__action">
    <slot />
  </div>
</template>
