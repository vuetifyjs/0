<script lang="ts">
  // Framework
  import { createContext, createOverflow, createRegistry, Tabs, useLogger } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { ID, OverflowContext, RegistryContext, RegistryTicket, TabsRootProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  /** What a tab shows: text (with or without an icon above it), or an icon alone. */
  export type Md1TabsItemKind = 'text' | 'icon'

  export interface Md1TabsItemMeasure {
    kind: Md1TabsItemKind
    /** The tab's unwrapped width at the device type size, padding included. */
    natural: number
  }

  export type Md1TabsItemTicket = RegistryTicket<Md1TabsItemMeasure>

  export interface Md1TabsContext {
    scrollable: Readonly<Ref<boolean>>
    /** The v0 `Tabs` namespace the root provides; parts default to it. */
    namespace: Readonly<Ref<string | undefined>>
    /** Decides when the desktop pagination arrows show. Its container is the tablist. */
    overflow: OverflowContext
    /** Every MD1 tab, with what it shows and how wide it wants to be. */
    items: RegistryContext<{ id?: ID, value?: Md1TabsItemMeasure }, Md1TabsItemTicket>
    /** The List registers the tablist element the overflow measures. */
    attach: (list: () => Element | null | undefined) => void
    /** A stable measurement key per tab, independent of registry indexes that shift on removal. */
    key: () => number
  }

  export interface Md1TabsProps extends Pick<TabsRootProps, 'disabled' | 'namespace'> {
    /**
     * Scrollable tabs: each tab takes its own width and the bar scrolls. The
     * default is fixed tabs, which share the bar's width and, from 600 px, centre
     * once the margin to the view edge exceeds 16 dp (tabs page).
     */
    scrollable?: boolean
  }

  const [useMd1Tabs, provideMd1Tabs] = createContext<Md1TabsContext | null>('md1:tabs', null)

  export { useMd1Tabs }
</script>

<script lang="ts" setup generic="T">
  defineOptions({ name: 'Md1Tabs' })

  defineSlots<{
    /** `Md1Tabs.List` with its items, then an `Md1Tabs.Panel` per tab. */
    default?: () => any
  }>()

  const {
    scrollable = false,
    disabled = false,
    namespace,
  } = defineProps<Md1TabsProps>()

  const model = defineModel<T>()

  const logger = useLogger()

  const list = shallowRef<() => Element | null | undefined>()

  const items = createRegistry<{ id?: ID, value?: Md1TabsItemMeasure }, Md1TabsItemTicket>({ reactive: true })

  const overflow = createOverflow({
    container: () => list.value?.(),
    // offsetWidth rounds every tab to a whole pixel, so fixed tabs sharing the
    // bar can sum past it by under a pixel each; this is that tolerance.
    reserved: () => -Math.ceil(items.size / 2),
  })

  let count = 0

  function key (): number {
    return count++
  }

  function attach (getter: () => Element | null | undefined) {
    list.value = getter
  }

  // The 2016 page: "Tab labels may be either all icons or all text." Mixing them is the spec's Don't.
  const mixed = toRef(() => {
    let text = false
    let icon = false

    for (const ticket of items.values()) {
      if (ticket.value.kind === 'text') text = true
      else icon = true
    }

    return text && icon
  })

  if (__DEV__) {
    watch(mixed, wrong => {
      if (wrong) logger.warn('[Md1Tabs] a tab bar mixes labelled and icon-only tabs; use either all text labels or all icon labels (tabs page)')
    }, { immediate: true })
  }

  provideMd1Tabs({
    scrollable: toRef(() => scrollable),
    namespace: toRef(() => namespace),
    overflow,
    items,
    attach,
    key,
  })
</script>

<template>
  <div
    class="md1-tabs"
    :data-disabled="disabled || undefined"
    :data-fixed="!scrollable || undefined"
    :data-overflow="overflow.isOverflowing.value || undefined"
    :data-scrollable="scrollable || undefined"
  >
    <Tabs.Root v-model="model" :disabled :namespace>
      <slot />
    </Tabs.Root>
  </div>
</template>

<!-- Unscoped, like every MD1 stylesheet; the class prefix is the isolation. -->
<style>
  /*
   * The bar sits in the first row and every panel shares the second, so the
   * outgoing and incoming panels overlap while they slide past each other.
   */
  .md1-tabs {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    overflow-x: clip;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
  }
</style>
