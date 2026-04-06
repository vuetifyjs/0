/**
 * @module ToggleGroup
 *
 * @see https://0.vuetifyjs.com/components/actions/toggle
 *
 * @remarks
 * Group container managing selection across child Toggle.Root components.
 * Uses createSingle for single-select and createGroup for multi-select.
 * Provides context so children detect group mode automatically.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { GroupContext, GroupTicket } from '#v0/composables/createGroup'
  import type { SingleContext, SingleTicket } from '#v0/composables/createSingle'
  import type { Ref } from 'vue'

  export type ToggleOrientation = 'horizontal' | 'vertical'

  export interface ToggleGroupContext<
    S extends SingleContext<SingleTicket> | GroupContext<GroupTicket> = SingleContext<SingleTicket> | GroupContext<GroupTicket>,
  > {
    disabled: Ref<boolean>
    orientation: Ref<ToggleOrientation>
    selection: S
  }

  export interface ToggleGroupProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Disables the entire toggle group */
    disabled?: boolean
    /** Allow multiple toggles active at once */
    multiple?: boolean
    /** Prevent deselecting the last active toggle */
    mandatory?: boolean | 'force'
    /** Layout direction for ARIA */
    orientation?: ToggleOrientation
  }

  export interface ToggleGroupSlotProps {
    /** Whether the toggle group is disabled */
    isDisabled: boolean
    /** Attributes to bind to the root element */
    attrs: {
      'role': 'group'
      'aria-orientation': ToggleOrientation
      'aria-disabled': boolean | undefined
      'data-orientation': ToggleOrientation
      'data-disabled': true | undefined
    }
  }

  export const [useToggleGroup, provideToggleGroup] = createContext<ToggleGroupContext>()
</script>

<script setup lang="ts" generic="T = unknown">
  // Composables
  import { createGroup } from '#v0/composables/createGroup'
  import { createSingle } from '#v0/composables/createSingle'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'ToggleGroup' })

  defineSlots<{
    default: (props: ToggleGroupSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:toggle:group',
    disabled = false,
    multiple = false,
    mandatory = false,
    orientation = 'horizontal',
  } = defineProps<ToggleGroupProps>()

  const model = defineModel<T | T[]>()

  const selection = multiple
    ? createGroup({
      disabled: toRef(() => disabled),
      mandatory,
      events: true,
    })
    : createSingle({
      disabled: toRef(() => disabled),
      mandatory,
      events: true,
    })

  useProxyModel(selection, model, { multiple })

  provideToggleGroup(namespace, {
    disabled: toRef(() => disabled),
    orientation: toRef(() => orientation),
    selection,
  })

  const slotProps = toRef((): ToggleGroupSlotProps => ({
    isDisabled: toValue(disabled),
    attrs: {
      'role': 'group',
      'aria-orientation': orientation,
      'aria-disabled': disabled || undefined,
      'data-orientation': orientation,
      'data-disabled': disabled ? true : undefined,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
