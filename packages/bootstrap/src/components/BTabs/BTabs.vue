<script lang="ts">
  // Framework
  import { createContext, createSingle, isUndefined, useProxyModel, useRovingFocus } from '@vuetify/v0'

  // Utilities
  import { toRef, watch } from 'vue'

  // Types
  import type { ID, SingleContext, SingleTicketInput } from '@vuetify/v0'
  import type { ShallowRef } from 'vue'

  export type BTabsVariant = 'tabs' | 'pills'

  export interface BTabsProps {
    /**
     * Adds `.tab-pane-instant` on each pane and skips the opacity fade.
     *
     * @default false
     */
    instant?: boolean
    /**
     * `nav-tabs` or `nav-pills`. Vertical lists use pills.
     *
     * @default 'tabs'
     */
    variant?: BTabsVariant
    /**
     * Arrow keys run vertically. The list is `.nav-pills.nav-pills-vertical`.
     *
     * @default false
     */
    vertical?: boolean
  }

  export interface BTabsTicketInput extends SingleTicketInput<string> {
    panelId: string
    el?: Readonly<ShallowRef<HTMLButtonElement | null>>
  }

  export interface BTabsContext {
    focus: (id: ID) => void
    instant: Readonly<ReturnType<typeof toRef<boolean>>>
    isTabbable: (id: ID) => boolean
    onKeydown: (event: KeyboardEvent) => void
    selection: SingleContext<BTabsTicketInput>
    variant: Readonly<ReturnType<typeof toRef<BTabsVariant>>>
    vertical: Readonly<ReturnType<typeof toRef<boolean>>>
  }

  const [useBTabs, provideBTabs] = createContext<BTabsContext | null>('bootstrap:tabs', null)

  export { provideBTabs, useBTabs }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BTabs' })

  defineSlots<{
    /** `BTabs.List` and `BTabs.Content`. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: string | undefined]
  }>()

  const model = defineModel<string>()

  const {
    instant = false,
    variant = 'tabs',
    vertical = false,
  } = defineProps<BTabsProps>()

  const selection = createSingle<BTabsTicketInput>({
    events: true,
    mandatory: 'force',
  })

  useProxyModel(selection, model)

  const roving = useRovingFocus(
    () => selection.values().map(item => ({
      id: item.id,
      disabled: item.disabled,
      el: item.el,
    })),
    {
      circular: true,
      orientation: vertical ? 'vertical' : 'horizontal',
      onFocus: id => {
        selection.select(id)
      },
    },
  )

  watch(selection.selectedId, id => {
    if (isUndefined(id) || roving.focusedId.value === id) return
    roving.focusedId.value = id
  })

  provideBTabs({
    focus: roving.focus,
    instant: toRef(() => instant),
    isTabbable: roving.isTabbable,
    onKeydown: roving.onKeydown,
    selection,
    variant: toRef(() => variant),
    vertical: toRef(() => vertical),
  })
</script>

<template>
  <slot />
</template>
