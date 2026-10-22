<script lang="ts">
  export interface BCardTitleProps {
    /** Heading element. The pin uses `h4`. */
    as?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BCardTitle' })

  defineSlots<{
    default?: () => any
  }>()

  const { as = 'h4' } = defineProps<BCardTitleProps>()
</script>

<template>
  <component
    :is="as"
    class="card-title"
  >
    <slot />
  </component>
</template>
