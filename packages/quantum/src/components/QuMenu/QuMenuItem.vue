<script lang="ts">
  // Framework
  import { isString, isUndefined, Menu } from '@vuetify/v0'

  // Context
  import { orphan, useQuMenu } from './QuMenu.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'
  import type { MenuItemProps } from '@vuetify/v0'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuMenuItemProps extends Pick<MenuItemProps, 'id' | 'label' | 'namespace'> {
    /** A glyph role drawn at the leading keyline; one icon in a menu moves every row's text to the content keyline. */
    icon?: QuIconName
    /**
     * Inline information at the trailing edge, such as a keyboard shortcut, in
     * the secondary ink; never truncated. Also published as `aria-keyshortcuts`;
     * pass that attribute yourself when the visible text is not in its syntax.
     */
    info?: string
    /** Kept in place at the disabled ink and skipped by the keyboard, never removed (menus page). */
    disabled?: boolean
    /** Committed to QuMenu's `v-model:selected` when the item is chosen; the matching row is drawn selected. */
    value?: unknown
  }

  const KEYS = new Set(['Enter', ' '])
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuMenuItem' })

  defineSlots<{
    /** The item text: a single word or a short phrase on one line. */
    default?: () => any
  }>()

  const emit = defineEmits<{
    /** The item was chosen, by pointer or keyboard. The menu closes after it. */
    select: []
  }>()

  const {
    id,
    label,
    namespace: _namespace,
    icon,
    info,
    disabled = false,
    value,
  } = defineProps<QuMenuItemProps>()

  const context = useQuMenu()

  orphan('QuMenuItem', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value ?? 'v0:menu')
  const inert = toRef(() => disabled || (context?.disabled.value ?? false))
  const selected = toRef(() => !isUndefined(value) && context?.selected.value === value)

  function onClick () {
    if (inert.value) return

    if (!isUndefined(value)) context?.select(value)

    emit('select')
  }

  /*
   * v0 activates a plain item from the keyboard inside the content's keydown
   * handler, which closes the menu without a click, so neither `select` nor a
   * consumer @click would hear Enter or Space. The item answers those keys
   * itself with a click, the path a pointer takes, and keeps the event from
   * the content so the item is not activated twice.
   */
  function onKeydown (event: KeyboardEvent) {
    if (!KEYS.has(event.key) || event.repeat || inert.value) return
    if (!(event.currentTarget instanceof HTMLElement)) return

    event.preventDefault()
    event.stopPropagation()
    event.currentTarget.click()
  }
</script>

<template>
  <Menu.Item
    :id
    :aria-current="selected || undefined"
    :aria-keyshortcuts="info"
    class="quantum-menu__item"
    :data-icon="isString(icon) || undefined"
    :data-selected="selected || undefined"
    :disabled="inert"
    :label
    :namespace
    @click="onClick"
    @keydown="onKeydown"
  >
    <QuRipple />

    <span v-if="icon" aria-hidden="true" class="quantum-menu__icon">
      <QuIcon :name="icon" :size="context?.desktop.value ? 's' : 'm'" />
    </span>

    <span class="quantum-menu__label"><slot /></span>

    <span v-if="info" aria-hidden="true" class="quantum-menu__info">{{ info }}</span>
  </Menu.Item>
</template>
