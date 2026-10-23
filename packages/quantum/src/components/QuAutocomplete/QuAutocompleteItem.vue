<script lang="ts">
  // Framework
  import { Combobox, isNull, isString } from '@vuetify/v0'

  // Context
  import { orphan, useQuAutocomplete } from './context'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { QuIconName } from '../../icons'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'
  import QuRipple from '../QuRipple/QuRipple.vue'

  export interface QuAutocompleteItemProps {
    /** The value `v-model` takes when this suggestion is chosen. Its text is the field's `displayValue` of it. */
    value: unknown
    /** Kept in the list at the disabled ink and skipped by the keyboard. */
    disabled?: boolean
    /** A glyph role at the 16 dp leading keyline; one iconed row moves every row's text to the 72 dp keyline. */
    icon?: QuIconName
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuAutocompleteItem' })

  defineSlots<{
    /** The suggestion text. Defaults to the field's display text for `value`. */
    default?: () => any
  }>()

  const { value, disabled = false, icon } = defineProps<QuAutocompleteItemProps>()

  const context = useQuAutocomplete()

  orphan('QuAutocompleteItem', context)

  const active = toRef(() => !isNull(context))
</script>

<template>
  <Combobox.Item
    v-if="active"
    class="quantum-autocomplete__item"
    :data-icon="isString(icon) || undefined"
    :disabled
    :namespace="context?.namespace.value"
    :value
  >
    <QuRipple />

    <span v-if="icon" aria-hidden="true" class="quantum-autocomplete__icon">
      <QuIcon :name="icon" :size="context?.dense.value ? 's' : 'm'" />
    </span>

    <span class="quantum-autocomplete__label">
      <slot>{{ context?.display(value) }}</slot>
    </span>
  </Combobox.Item>
</template>
