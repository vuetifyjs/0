<script lang="ts">
  // Framework
  import { isNullOrUndefined, useLogger } from '@vuetify/v0'

  // Context
  import { orphan, useMd1List, useMd1ListItem } from './context'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ListAction' })

  defineSlots<{
    /** An `Md1Checkbox`, `Md1Switch`, `Md1Radio` or `Md1IconToggle`, or Caption text: the secondary action or secondary info. */
    default?: () => any
  }>()

  const item = useMd1ListItem()
  const list = useMd1List()

  orphan('Md1ListAction', 'Md1List.Item', item)

  // An option cannot own a second target: the listbox pattern allows options and nothing else.
  if (__DEV__ && !isNullOrUndefined(list) && list.select.value !== 'none') {
    useLogger().warn('[Md1ListAction] a selectable list is a listbox and its options cannot host a secondary action; use select="none" for tiles with controls')
  }
</script>

<template>
  <div class="md1-list__action">
    <slot />
  </div>
</template>
