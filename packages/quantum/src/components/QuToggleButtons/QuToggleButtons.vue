<script lang="ts">
  // Framework
  import { createContext, createRegistry, Toggle, useLogger } from '@vuetify/v0'

  // Utilities
  import { watch } from 'vue'

  // Types
  import type { RegistryContext, ToggleGroupProps } from '@vuetify/v0'

  /** What the group shares with its items: a registry for the page's minimum of three. */
  export interface QuToggleButtonsContext {
    /** Enrols an item; `unregister()` the ticket on unmount. */
    register: RegistryContext['register']
  }

  /**
   * Quantum withholds `orientation` from v0's group props: the buttons page
   * draws toggle buttons as a row. The accessible-name props stay because the
   * group needs a name of its own (`role="group"`).
   */
  export interface QuToggleButtonsProps extends Pick<
    ToggleGroupProps,
    'disabled' | 'multiple' | 'mandatory' | 'label' | 'ariaLabelledby' | 'ariaDescribedby' | 'namespace'
  > {}

  export const [useQuToggleButtons, provideQuToggleButtons] = createContext<QuToggleButtonsContext | null>('quantum:toggle-buttons', null)
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'QuToggleButtons' })

  defineSlots<{
    /** The `QuToggleButtons.Item` children: at least three. */
    default?: () => any
  }>()

  const {
    disabled = false,
    multiple = false,
    mandatory = false,
    label,
    ariaLabelledby,
    ariaDescribedby,
    namespace,
  } = defineProps<QuToggleButtonsProps>()

  const model = defineModel<T | T[]>()

  // Toggle.Group owns the selection; this registry only counts the items so
  // the group can hold the page's rule that a toggle group has at least three.
  const items = createRegistry({ reactive: true })
  const logger = useLogger()

  provideQuToggleButtons({ register: items.register })

  if (__DEV__) {
    // Post flush: the items register one by one during mount, and the count
    // that matters is the one left standing after the tree settles.
    watch(() => items.size, size => {
      if (size > 0 && size < 3) logger.warn(`[QuToggleButtons] a toggle button group has at least three options (buttons page); this one renders ${size}`)
    }, { flush: 'post' })
  }
</script>

<template>
  <Toggle.Group
    v-model="model"
    :aria-describedby
    :aria-labelledby
    class="quantum-toggle-buttons"
    :data-multiple="multiple || undefined"
    :disabled
    :label
    :mandatory
    :multiple
    :namespace
  >
    <slot />
  </Toggle.Group>
</template>

<!-- Unscoped, like every Quantum stylesheet; the items style themselves in QuToggleButtonsItem.vue. -->
<style>
  /*
   * The page shows the group only as an image, so the container is a Quantum
   * decision: one 2 dp radius shared by the items, edged in the divider colour
   * so the row reads as a single control ("layout and spacing should convey
   * grouping"). Items butt against each other and divide themselves.
   */
  .quantum-toggle-buttons {
    position: relative;
    display: inline-flex;
    align-items: stretch;
    box-sizing: border-box;
    border: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
    border-radius: var(--quantum-radius, 2px);
    background: transparent;
    vertical-align: middle;
  }
</style>
