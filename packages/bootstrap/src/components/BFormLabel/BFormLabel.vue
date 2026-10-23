<script lang="ts">
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

  const { for: htmlFor } = defineProps<BFormLabelProps>()
</script>

<template>
  <label class="form-label" :for="htmlFor">
    <slot />
  </label>
</template>
