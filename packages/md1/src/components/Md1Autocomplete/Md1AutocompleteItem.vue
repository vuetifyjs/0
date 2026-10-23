<script lang="ts">
  // Framework
  import { Combobox, isNull, isString } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Autocomplete } from './context'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { Md1IconName } from '../../icons'

  // Components
  import Md1Icon from '../Md1Icon/Md1Icon.vue'
  import Md1Ripple from '../Md1Ripple/Md1Ripple.vue'

  export interface Md1AutocompleteItemProps {
    /** The value `v-model` takes when this suggestion is chosen. Its text is the field's `displayValue` of it. */
    value: unknown
    /** Kept in the list at the disabled ink and skipped by the keyboard. */
    disabled?: boolean
    /** A glyph role at the 16 dp leading keyline; one iconed row moves every row's text to the 72 dp keyline. */
    icon?: Md1IconName
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1AutocompleteItem' })

  defineSlots<{
    /** The suggestion text. Defaults to the field's display text for `value`. */
    default?: () => any
  }>()

  const { value, disabled = false, icon } = defineProps<Md1AutocompleteItemProps>()

  const context = useMd1Autocomplete()

  orphan('Md1AutocompleteItem', context)

  const active = toRef(() => !isNull(context))
</script>

<template>
  <Combobox.Item
    v-if="active"
    class="md1-autocomplete__item"
    :data-icon="isString(icon) || undefined"
    :disabled
    :namespace="context?.namespace.value"
    :value
  >
    <Md1Ripple />

    <span v-if="icon" aria-hidden="true" class="md1-autocomplete__icon">
      <Md1Icon :name="icon" :size="context?.dense.value ? 's' : 'm'" />
    </span>

    <span class="md1-autocomplete__label">
      <slot>{{ context?.display(value) }}</slot>
    </span>
  </Combobox.Item>
</template>
