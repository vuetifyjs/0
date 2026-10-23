<script lang="ts">
  // Framework
  import { createContext, ExpansionPanel } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ExpansionPanelGroupProps } from '@vuetify/v0'
  import type { Ref } from 'vue'

  /** What the parts read from the root: the group-level disabled state the items fold into their own. */
  export interface Md1ExpansionPanelContext {
    disabled: Readonly<Ref<boolean>>
  }

  /**
   * MD1 withholds `enroll` and `mandatory` from v0's group props: the
   * expansion-panels page states no auto-expand and no cannot-collapse rule,
   * and whether one or several panels may be open is the one behaviour it
   * leaves to the implementer (single-open by default, `multiple` otherwise).
   */
  export interface Md1ExpansionPanelProps extends Pick<
    ExpansionPanelGroupProps,
    'disabled' | 'multiple' | 'namespace'
  > {}

  const [useMd1ExpansionPanel, provideMd1ExpansionPanel] = createContext<Md1ExpansionPanelContext | null>('md1:expansion-panel', null)

  export { useMd1ExpansionPanel }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'Md1ExpansionPanel' })

  defineSlots<{
    /** `Md1ExpansionPanel.Item` children, stacked on one card. */
    default?: () => any
  }>()

  defineEmits<{
    /** The expanded value, or the array of expanded values under `multiple`. */
    'update:model-value': [value: T | T[]]
  }>()

  const { disabled = false, multiple = false, namespace } = defineProps<Md1ExpansionPanelProps>()

  const model = defineModel<T | T[]>()

  provideMd1ExpansionPanel({ disabled: toRef(() => disabled) })
</script>

<template>
  <ExpansionPanel.Group
    v-model="model"
    class="md1-expansion-panel"
    :disabled
    :multiple
    :namespace
  >
    <slot />
  </ExpansionPanel.Group>
</template>

<!-- Unscoped: the group renders through Atom, and every part keeps its own sheet under the md1- prefix. -->
<style>
  /*
   * The group paints nothing itself: each item is a sheet, so a run of
   * collapsed panels reads as one card and an expanded panel can leave it
   * (Md1ExpansionPanelItem). Block layout, not flex, so the 16 dp margins of
   * two adjacent expanded panels collapse into one 16 dp gap.
   */
  .md1-expansion-panel {
    display: block;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }
</style>
