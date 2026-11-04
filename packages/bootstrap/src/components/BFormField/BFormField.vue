<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export interface BFormFieldProps {
    /**
     * Adds `.form-floating`.
     *
     * @default false
     */
    floating?: boolean
    /**
     * With `floating`, adds `.form-floating-always`. Ignored otherwise.
     *
     * @default false
     */
    always?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BFormField' })

  defineSlots<{
    /** Label, control, text, and feedback, in the order you want them. */
    default?: () => any
  }>()

  const {
    floating = false,
    always = false,
  } = defineProps<BFormFieldProps>()

  const fieldClass = toRef(() => {
    const list = ['form-field']

    if (floating) list.push('form-floating')
    if (floating && always) list.push('form-floating-always')

    return list
  })
</script>

<template>
  <div :class="fieldClass">
    <slot />
  </div>
</template>
