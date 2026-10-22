<script lang="ts">
  // Framework
  import { isNullOrUndefined, isString, isUndefined, useId } from '@vuetify/v0'

  // Utilities
  import { onBeforeUnmount, toRef } from 'vue'

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

  const id = toRef(() => isUndefined(value) ? uid : value)

  const isLink = toRef(() => isString(href))

  const ticket: SingleTicket | undefined = !isNullOrUndefined(group) && group.selectable.value
    ? group.selection.register({
      id: uid,
      value: id.value,
      disabled: () => disabled,
    })
    : undefined

  onBeforeUnmount(() => {
    ticket?.unregister()
  })

  const isActive = toRef(() => {
    if (!isNullOrUndefined(group) && group.selectable.value) return ticket?.isSelected.value ?? false
    return active
  })

  function onClick (event: MouseEvent) {
    if (disabled) {
      event.preventDefault()
      return
    }
    ticket?.select()
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
    @click="onClick"
  >
    <slot />
  </li>
</template>
