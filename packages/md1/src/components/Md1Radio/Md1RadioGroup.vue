<script lang="ts">
  // Framework
  import { Radio } from '@vuetify/v0'

  // Types
  import type { RadioGroupProps } from '@vuetify/v0'

  /**
   * MD1 withholds `label`, `ariaDescribedby` and `ariaRequired` from v0's
   * group props; the group's accessible name is `ariaLabel` (v0's `label`),
   * or `aria-labelledby` pointing at a visible heading.
   */
  export interface Md1RadioGroupProps extends Pick<
    RadioGroupProps,
    'disabled' | 'mandatory' | 'name' | 'namespace' | 'ariaLabelledby'
  > {
    /**
     * `automatic` selects on arrow focus; `manual` waits for Space. Declared
     * here rather than picked from v0, because the declaration bundler drops
     * v0's `RadioActivation` from a generic component's inlined props.
     */
    activation?: 'automatic' | 'manual'
    /** Accessible name for the set of options. */
    ariaLabel?: string
  }
</script>

<script lang="ts" setup generic="T = unknown">
  defineOptions({ name: 'Md1RadioGroup' })

  defineSlots<{
    /** The `Md1Radio` options. */
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
  } = defineProps<Md1RadioGroupProps>()

  const model = defineModel<T>()
</script>

<template>
  <Radio.Group
    v-model="model"
    :activation
    :aria-labelledby
    class="md1-radio-group"
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
  .md1-radio-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
</style>
