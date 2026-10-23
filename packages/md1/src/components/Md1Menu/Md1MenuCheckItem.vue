<script lang="ts">
  // Framework
  import { Menu } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Menu } from './Md1Menu.vue'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { MenuCheckboxItemProps } from '@vuetify/v0'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1MenuCheckItemProps extends Pick<MenuCheckboxItemProps, 'id' | 'label' | 'namespace'> {
    /** Inline information at the trailing edge, in the secondary ink; published as `aria-keyshortcuts`. */
    info?: string
    /** Kept in place at the disabled ink and skipped by the keyboard; `v-model:checked` can still be written. */
    disabled?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1MenuCheckItem' })

  defineSlots<{
    /** The item text. */
    default?: () => any
  }>()

  defineEmits<{
    'update:checked': [value: boolean]
  }>()

  const {
    id,
    label,
    namespace: _namespace,
    info,
    disabled = false,
  } = defineProps<Md1MenuCheckItemProps>()

  /** Whether the check shows. Choosing the item flips it and keeps the menu open (menus page: multi-select menus stay up). */
  const checked = defineModel<boolean>('checked', { default: false })

  const context = useMd1Menu()

  orphan('Md1MenuCheckItem', context)

  const namespace = toRef(() => _namespace ?? context?.namespace.value ?? 'v0:menu')
  const inert = toRef(() => disabled || (context?.disabled.value ?? false))
</script>

<template>
  <Menu.CheckboxItem
    :id
    v-model:checked="checked"
    :aria-keyshortcuts="info"
    class="md1-menu__item"
    :data-check="true"
    :disabled="inert"
    :label
    :namespace
  >
    <Md1Ripple />

    <span v-if="checked" aria-hidden="true" class="md1-menu__icon">
      <Md1Icon name="check" :size="context?.desktop.value ? 's' : 'm'" />
    </span>

    <span class="md1-menu__label"><slot /></span>

    <span v-if="info" aria-hidden="true" class="md1-menu__info">{{ info }}</span>
  </Menu.CheckboxItem>
</template>
