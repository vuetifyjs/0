/**
 * @module MenuRadioGroup
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @remarks
 * Single-select group of radio items. Choosing one leaves the menu open.
 * `v-model` is the selected item's `value`.
 *
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'
  import { createSingle } from '#v0/composables/createSingle'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { SingleContext } from '#v0/composables/createSingle'
  import type { Ref } from 'vue'

  export interface MenuRadioContext {
    single: SingleContext
    disabled: Readonly<Ref<boolean>>
  }

  const [useMenuRadio, provideMenuRadio] = createContext<MenuRadioContext>('v0:menu:radio')

  export { useMenuRadio }

  export interface MenuRadioGroupProps extends AtomProps {
    /** Accessible name for the group */
    label?: string
    /** Disables every radio in the group */
    disabled?: boolean
  }

  export interface MenuRadioGroupSlotProps {
    attrs: {
      'role': 'group'
      'aria-label': string | undefined
      'data-disabled': true | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'MenuRadioGroup', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: MenuRadioGroupSlotProps) => any
  }>()

  defineEmits<{
    'update:modelValue': [value: unknown]
  }>()

  const {
    as = 'div',
    renderless = false,
    label,
    disabled = false,
  } = defineProps<MenuRadioGroupProps>()

  const model = defineModel<unknown>()
  const single = createSingle({ events: true })
  const disabledRef = toRef(() => disabled)

  useProxyModel(single, model, { multiple: false })
  provideMenuRadio({ single, disabled: disabledRef })

  const slotProps = toRef((): MenuRadioGroupSlotProps => ({
    attrs: {
      'role': 'group',
      'aria-label': label,
      'data-disabled': disabled || undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
