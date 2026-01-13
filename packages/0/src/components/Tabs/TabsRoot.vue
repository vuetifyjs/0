/**
 * @module TabsRoot
 *
 * @remarks
 * Root component for tabs navigation. Creates and provides step context
 * to child TabsTab and TabsPanel components. Supports horizontal/vertical
 * orientation and automatic/manual activation modes.
 *
 * @see {@link https://0.vuetifyjs.com/components/navigation/tabs}
 */

<script lang="ts">
  // Foundational
  import { createContext } from '#v0/composables/createContext'

  // Types
  import type { StepContext, StepTicket } from '#v0/composables/createStep'
  import type { ID } from '#v0/types'
  import type { MaybeRef, Ref } from 'vue'

  /** Visual state of the tab for styling purposes */
  export type TabsState = 'active' | 'inactive'

  /** Tab orientation for keyboard navigation */
  export type TabsOrientation = 'horizontal' | 'vertical'

  /** Tab activation mode */
  export type TabsActivation = 'automatic' | 'manual'

  /** Ticket for tab items with element reference for focus management */
  export interface TabsTicket extends StepTicket {
    /** Element reference for roving tabindex focus management */
    el?: MaybeRef<HTMLElement | null | undefined>
  }

  export interface TabsRootProps {
    /** Namespace for dependency injection (must match child namespace) */
    namespace?: string
    /**
     * Disables the entire tabs instance
     *
     * @example
     * ```vue
     * <template>
     *   <Tabs.Root disabled>
     *     <Tabs.List>
     *       <Tabs.Tab value="a">Tab A</Tabs.Tab>
     *     </Tabs.List>
     *   </Tabs.Root>
     * </template>
     * ```
     */
    disabled?: boolean
    /** Auto-select non-disabled items on registration */
    enroll?: boolean
    /**
     * Controls mandatory tab behavior:
     * - false: No mandatory tab enforcement
     * - true: Prevents deselecting the last selected item
     * - `force` (default): Automatically selects the first non-disabled tab
     *
     * @example
     * ```vue
     * <template>
     *   <!-- Auto-selects first tab on mount -->
     *   <Tabs.Root mandatory="force">
     *     <Tabs.List>
     *       <Tabs.Tab value="a">Tab A</Tabs.Tab>
     *       <Tabs.Tab value="b">Tab B</Tabs.Tab>
     *     </Tabs.List>
     *   </Tabs.Root>
     * </template>
     * ```
     */
    mandatory?: boolean | 'force'
    /**
     * Whether arrow key navigation wraps around
     *
     * @example
     * ```vue
     * <template>
     *   <!-- Pressing right on last tab goes to first -->
     *   <Tabs.Root loop>
     *     <Tabs.List>
     *       <Tabs.Tab value="a">Tab A</Tabs.Tab>
     *       <Tabs.Tab value="b">Tab B</Tabs.Tab>
     *     </Tabs.List>
     *   </Tabs.Root>
     * </template>
     * ```
     */
    loop?: boolean
    /**
     * Tab orientation for keyboard navigation
     *
     * @example
     * ```vue
     * <template>
     *   <!-- Use up/down arrows instead of left/right -->
     *   <Tabs.Root orientation="vertical">
     *     <Tabs.List>
     *       <Tabs.Tab value="a">Tab A</Tabs.Tab>
     *       <Tabs.Tab value="b">Tab B</Tabs.Tab>
     *     </Tabs.List>
     *   </Tabs.Root>
     * </template>
     * ```
     */
    orientation?: TabsOrientation
    /**
     * Activation mode:
     * - `automatic`: Tab activates on focus (arrow keys)
     * - `manual`: Tab activates on Enter/Space only
     *
     * @example
     * ```vue
     * <template>
     *   <!-- User must press Enter/Space to activate -->
     *   <Tabs.Root activation="manual">
     *     <Tabs.List>
     *       <Tabs.Tab value="a">Tab A</Tabs.Tab>
     *     </Tabs.List>
     *   </Tabs.Root>
     * </template>
     * ```
     */
    activation?: TabsActivation
  }

  export interface TabsRootSlotProps {
    /** Whether the tabs instance is disabled */
    isDisabled: boolean
    /** Current orientation */
    orientation: TabsOrientation
    /** Current activation mode */
    activation: TabsActivation
    /** Select the first tab */
    first: () => void
    /** Select the last tab */
    last: () => void
    /** Select the next tab */
    next: () => void
    /** Select the previous tab */
    prev: () => void
    /** Step forward or backward by a specific count */
    step: (count: number) => void
    /** Select a tab by ID */
    select: (id: ID) => void
    /** Unselect a tab by ID */
    unselect: (id: ID) => void
    /** Toggle a tab's selection state by ID */
    toggle: (id: ID) => void
    /** Attributes to bind to the root element */
    attrs: {
      'aria-multiselectable': false
    }
  }

  export interface TabsContext extends StepContext<TabsTicket> {
    /** Tab orientation */
    orientation: Readonly<Ref<TabsOrientation>>
    /** Activation mode */
    activation: Readonly<Ref<TabsActivation>>
    /** Whether navigation loops */
    loop: Readonly<Ref<boolean>>
    /** Root ID for generating tab/panel IDs */
    rootId: string
  }

  export const [useTabsRoot, provideTabsRoot] = createContext<TabsContext>()
</script>

<script lang="ts" setup generic="T = unknown">
  // Composables
  import { createStep } from '#v0/composables/createStep'
  import { useProxyModel } from '#v0/composables/useProxyModel'

  // Utilities
  import { genId } from '#v0/utilities'
  import { toRef, toValue } from 'vue'

  defineOptions({ name: 'TabsRoot' })

  defineSlots<{
    default: (props: TabsRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: T | T[]]
  }>()

  const {
    namespace = 'v0:tabs',
    disabled = false,
    enroll = false,
    mandatory = 'force',
    loop = true,
    orientation = 'horizontal',
    activation = 'automatic',
  } = defineProps<TabsRootProps>()

  const model = defineModel<T | T[]>()

  const rootId = genId()

  const step = createStep<TabsTicket>({
    disabled: toRef(() => disabled),
    enroll,
    mandatory,
    circular: loop,
    events: true,
  })

  useProxyModel(step, model, { multiple: false })

  const context: TabsContext = {
    ...step,
    orientation: toRef(() => orientation),
    activation: toRef(() => activation),
    loop: toRef(() => loop),
    rootId,
  }

  provideTabsRoot(namespace, context)

  const slotProps = toRef((): TabsRootSlotProps => ({
    isDisabled: toValue(step.disabled),
    orientation,
    activation,
    first: step.first,
    last: step.last,
    next: step.next,
    prev: step.prev,
    step: step.step,
    select: step.select,
    unselect: step.unselect,
    toggle: step.toggle,
    attrs: {
      'aria-multiselectable': false,
    },
  }))
</script>

<template>
  <slot v-bind="slotProps" />
</template>
