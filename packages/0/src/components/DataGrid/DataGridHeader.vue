<script lang="ts">
  /**
   * @module DataGridHeader
   *
   * @see https://0.vuetifyjs.com/components/data/data-grid
   *
   * @remarks
   * The `<thead>` element wrapper. Exposes the 2D header grid from the context
   * for rendering nested header rows.
   */

  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useDataGridRoot } from './DataGridRoot.vue'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { mergeProps, ref, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { InternalHeader } from '#v0/composables/createDataTable'
  import type { Ref } from 'vue'

  export interface DataGridHeaderContext {
    register: () => {
      index: Readonly<Ref<number | undefined>>
      unregister: () => void
    }
  }

  const [useDataGridHeader, provideDataGridHeader] = createContext<DataGridHeaderContext | null>({ suffix: 'header' })
  export { useDataGridHeader }

  export interface DataGridHeaderProps extends AtomProps {
    /** Namespace for dependency injection. @default 'v0:data-grid' */
    namespace?: string
  }

  export interface DataGridHeaderSlotProps {
    /** 2D header grid for rendering multi-level headers */
    headers: readonly InternalHeader[][]
    attrs: {
      role: 'rowgroup' | undefined
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DataGridHeader', inheritAttrs: false })

  defineSlots<{
    default: (props: DataGridHeaderSlotProps) => unknown
  }>()

  const {
    as = 'thead',
    namespace = 'v0:data-grid',
    renderless,
  } = defineProps<DataGridHeaderProps>()

  const attrs = useAttrs()
  const context = useDataGridRoot(namespace)
  const rows = ref<object[]>([])

  function register () {
    const token = {}
    rows.value.push(token)

    const index = toRef(() => {
      const pos = rows.value.indexOf(token)
      return pos === -1 ? undefined : pos + 1
    })

    function unregister () {
      const pos = rows.value.indexOf(token)
      if (pos !== -1) rows.value.splice(pos, 1)
    }

    return { index, unregister }
  }

  provideDataGridHeader(namespace, { register })

  const slotProps = toRef((): DataGridHeaderSlotProps => ({
    headers: context.headers.value,
    attrs: {
      role: as === 'thead' ? undefined : 'rowgroup',
    },
  }))
</script>

<template>
  <Atom
    :as
    :renderless
    v-bind="mergeProps(attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
