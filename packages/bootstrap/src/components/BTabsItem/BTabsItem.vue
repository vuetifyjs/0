<script lang="ts">
  // Framework
  import { useId } from '@vuetify/v0'

  // Utilities
  import { orphan } from '../../utilities/context'
  import { onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { BTabsTicketInput } from '../BTabs/BTabs.vue'
  import type { SingleTicket } from '@vuetify/v0'

  import { useBTabs } from '../BTabs/BTabs.vue'

  export interface BTabsItemProps {
    disabled?: boolean
    /** Selected value. Matches `BTabs.Panel`. */
    value: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BTabsItem' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    disabled = false,
    value,
  } = defineProps<BTabsItemProps>()

  const tabs = useBTabs()
  const button = useTemplateRef<HTMLButtonElement>('button')
  const tabId = useId()
  const panelId = useId()

  orphan('BTabsItem', 'BTabs', tabs)

  const ticket: SingleTicket<BTabsTicketInput> | undefined = tabs
    ? tabs.selection.register({
      id: tabId,
      value,
      panelId,
      el: button,
      disabled: () => disabled,
    })
    : undefined

  watch(() => value, next => {
    if (!ticket || !tabs || Object.is(ticket.value, next)) return
    const selected = ticket.isSelected.value
    tabs.selection.upsert(ticket.id, { value: next })
    if (selected) ticket.select()
  })

  onBeforeUnmount(() => {
    ticket?.unregister()
  })

  const selected = toRef(() => ticket?.isSelected.value ?? false)

  const tabIndex = toRef(() => {
    if (disabled || !ticket || !tabs) return disabled ? -1 : 0
    return tabs.isTabbable(String(ticket.id)) ? 0 : -1
  })

  function onClick () {
    if (disabled || !ticket || !tabs) return
    tabs.focus(String(ticket.id))
  }

  function onKeydown (event: KeyboardEvent) {
    if (disabled || !tabs) return
    tabs.onKeydown(event)
  }
</script>

<template>
  <li
    class="nav-item"
    role="presentation"
  >
    <button
      :id="tabId"
      ref="button"
      :aria-controls="panelId"
      :aria-selected="selected"
      class="nav-link"
      :class="{ active: selected }"
      :disabled="disabled || undefined"
      role="tab"
      :tabindex="tabIndex"
      type="button"
      @click="onClick"
      @keydown="onKeydown"
    >
      <slot />
    </button>
  </li>
</template>
