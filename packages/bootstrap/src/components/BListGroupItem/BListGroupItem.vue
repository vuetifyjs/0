<script lang="ts">
  // Framework
  import { isNullOrUndefined, isString, useId } from '@vuetify/v0'

  // Utilities
  import { onBeforeUnmount, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { SingleTicket } from '@vuetify/v0'

  import { useListGroup } from '../BListGroup/BListGroup.vue'

  export interface BListGroupItemProps {
    /** Presentational active state. Ignored when the group is `selectable`. */
    active?: boolean
    /** `button.list-group-item.list-group-item-action`, or `a` when `href` is set. */
    action?: boolean
    disabled?: boolean
    href?: string
    /** Id stored by a selectable group. Defaults to `useId()`. */
    value?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BListGroupItem' })

  defineSlots<{
    default?: () => any
  }>()

  const uid = useId()

  const {
    active = false,
    action = false,
    disabled = false,
    href,
    value,
    namespace = 'v0:list-group',
  } = defineProps<BListGroupItemProps>()

  const group = useListGroup(namespace, null)

  const id = toRef(() => isString(value) && value.length > 0 ? value : uid)

  const isLink = toRef(() => isString(href) && href.length > 0)

  const ticket = shallowRef<SingleTicket | undefined>()

  function enroll () {
    if (!isNullOrUndefined(ticket.value) || isNullOrUndefined(group) || !group.selectable.value) return
    ticket.value = group.selection.register({
      id: uid,
      value: id.value,
      disabled: () => disabled,
    })
  }

  watch(() => !isNullOrUndefined(group) && group.selectable.value, on => {
    if (on) {
      enroll()
      return
    }
    ticket.value?.unregister()
    ticket.value = undefined
  }, { immediate: true })

  // A value that arrives after setup has to re-register. useProxyModel only
  // applies a pending model on `register:ticket`, not on upsert.
  watch(id, value => {
    const current = ticket.value
    if (isNullOrUndefined(current) || isNullOrUndefined(group) || Object.is(current.value, value)) return
    const selected = current.isSelected.value
    current.unregister()
    ticket.value = group.selection.register({
      id: uid,
      value,
      disabled: () => disabled,
    })
    if (selected) ticket.value.select()
  })

  onBeforeUnmount(() => {
    ticket.value?.unregister()
    ticket.value = undefined
  })

  const isActive = toRef(() => {
    if (!isNullOrUndefined(group) && group.selectable.value) return ticket.value?.isSelected.value ?? false
    return active
  })

  const rowTab = toRef(() => {
    if (isLink.value || action) return undefined
    if (isNullOrUndefined(group) || !group.selectable.value) return undefined
    return disabled ? -1 : 0
  })

  function onClick (event: Event) {
    if (disabled) {
      event.preventDefault()
      return
    }
    ticket.value?.select()
  }

  function onRowKey (event: KeyboardEvent) {
    if (isLink.value || action) return
    // The slot can hold a button or a field. Their keys must not select the row.
    if (event.target !== event.currentTarget) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onClick(event)
  }
</script>

<template>
  <a
    v-if="isLink"
    :aria-current="isActive ? 'true' : undefined"
    :aria-disabled="disabled ? true : undefined"
    class="list-group-item list-group-item-action"
    :class="{ active: isActive, disabled }"
    :href
    :tabindex="disabled ? -1 : undefined"
    @click="onClick"
  >
    <slot />
  </a>

  <button
    v-else-if="action"
    :aria-current="isActive ? 'true' : undefined"
    class="list-group-item list-group-item-action"
    :class="{ active: isActive }"
    :disabled="disabled ? true : undefined"
    type="button"
    @click="onClick"
  >
    <slot />
  </button>

  <li
    v-else
    :aria-current="isActive ? 'true' : undefined"
    :aria-disabled="disabled ? true : undefined"
    class="list-group-item"
    :class="{ active: isActive, disabled }"
    :tabindex="rowTab"
    @click="onClick"
    @keydown="onRowKey"
  >
    <slot />
  </li>
</template>
