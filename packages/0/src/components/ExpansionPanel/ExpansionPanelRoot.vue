<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useProxyModel } from '#v0/composables/useProxyModel'
  import { createSelectionContext } from '#v0/composables/useSelection'

  // Utilities
  import { toRef, toValue } from 'vue'

  // Types
  import type { ID } from '#v0/types'
  import type { AtomProps } from '#v0/components/Atom'

  export interface ExpansionPanelRootProps extends AtomProps {
    namespace?: string
    disabled?: boolean
    enroll?: boolean
    mandatory?: boolean | 'force'
    multiple?: boolean
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'ExpansionPanelRoot' })

  defineSlots<{
    default: (props: {
      /** Disables the entire expansion panel instance and all registered items */
      disabled: boolean
      /** Whether multiple panels can be expanded */
      multiple: boolean
      /** Select a panel by ID */
      select: (id: ID) => void
      /** Unselect a panel by ID */
      unselect: (id: ID) => void
      /** Toggle a panel's expansion state by ID */
      toggle: (id: ID) => void
      /** ARIA multiselectable state */
      ariaMultiselectable: boolean
    }) => any
  }>()

  const {
    as,
    renderless,
    namespace = 'v0:expansion-panel',
    disabled = false,
    enroll = false,
    mandatory = false,
    multiple = false,
  } = defineProps<ExpansionPanelRootProps>()

  const model = defineModel<T | T[]>()

  const [, provideExpansionControl, context] = createSelectionContext({
    namespace,
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    multiple,
    events: true,
  })

  useProxyModel(context, model, { multiple })

  provideExpansionControl(context)
</script>

<template>
  <Atom
    :aria-multiselectable="!renderless && multiple"
    :as
    :renderless
  >
    <slot
      :aria-multiselectable="multiple"
      :disabled="toValue(context.disabled)"
      :multiple="multiple"
      :select="context.select"
      :toggle="context.toggle"
      :unselect="context.unselect"
    />
  </Atom>
</template>
