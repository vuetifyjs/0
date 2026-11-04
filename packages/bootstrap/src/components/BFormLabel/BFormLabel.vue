<script lang="ts">
  // Framework
  import { isString } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BFormLabelProps {
    /**
     * Id of the control this label names. Written to the `for` attribute.
     */
    for?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BFormLabel' })

  defineSlots<{
    default?: () => any
  }>()

  const { for: _for } = defineProps<BFormLabelProps>()

  const htmlFor = toRef(() => isString(_for) && _for.length > 0 ? _for : undefined)
</script>

<template>
  <label class="form-label" :for="htmlFor">
    <slot />
  </label>
</template>
