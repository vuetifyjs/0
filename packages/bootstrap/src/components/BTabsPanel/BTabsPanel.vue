<script lang="ts">
  // Framework
  import { isUndefined } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  import { useBTabs } from '../BTabs/BTabs.vue'

  export interface BTabsPanelProps {
    /** Matches `BTabs.Item` `value`. */
    value: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BTabsPanel' })

  defineSlots<{
    default?: () => any
  }>()

  const { value } = defineProps<BTabsPanelProps>()

  const tabs = useBTabs()

  orphan('BTabsPanel', 'BTabs', tabs)

  const ticket = toRef(() => tabs?.selection.values().find(item => item.value === value))

  const selected = toRef(() => ticket.value?.isSelected.value ?? false)

  const paneClass = toRef(() => {
    const list = ['tab-pane']

    if (tabs?.instant.value) list.push('tab-pane-instant')
    if (selected.value) list.push('show', 'active')

    return list
  })

  const labelledBy = toRef(() => {
    const id = ticket.value?.id
    return isUndefined(id) ? undefined : String(id)
  })
</script>

<template>
  <div
    :id="ticket?.panelId"
    :aria-labelledby="labelledBy"
    :class="paneClass"
    role="tabpanel"
    :tabindex="selected ? 0 : undefined"
  >
    <slot />
  </div>
</template>
