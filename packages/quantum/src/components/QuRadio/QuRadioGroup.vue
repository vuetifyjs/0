<script lang="ts">
  // Framework
  import { Radio } from '@vuetify/v0'

  // Types
  import type { RadioGroupProps } from '@vuetify/v0'

  /**
   * Quantum withholds `label`, `ariaDescribedby` and `ariaRequired` from v0's
   * group props; the group's accessible name is `ariaLabel` (v0's `label`),
   * or `aria-labelledby` pointing at a visible heading.
   */
  export interface QuRadioGroupProps extends Pick<
    RadioGroupProps,
    'disabled' | 'mandatory' | 'name' | 'activation' | 'namespace' | 'ariaLabelledby'
  > {
    /** Accessible name for the set of options. */
    ariaLabel?: string
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'QuRadioGroup' })

  defineSlots<{
    /** The `QuRadio` options. */
    default?: () => any
  }>()

  const {
    disabled = false,
    mandatory = false,
    name,
    activation = 'automatic',
    ariaLabel,
    ariaLabelledby,
    namespace,
  } = defineProps<QuRadioGroupProps>()

  const model = defineModel<T>()
</script>

<template>
  <Radio.Group
    v-model="model"
    :activation
    :aria-labelledby
    class="quantum-radio-group"
    :data-disabled="disabled || undefined"
    :disabled
    :label="ariaLabel"
    :mandatory
    :name
    :namespace
  >
    <slot />
  </Radio.Group>
</template>

<style>
  /* Radios stack; each row is its own 48 dp target, so the column needs no gap. */
  .quantum-radio-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
