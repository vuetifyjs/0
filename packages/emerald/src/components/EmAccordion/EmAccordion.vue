<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmAccordionProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAccordion' })

  const {} = defineProps<EmAccordionProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-accordion">
    <slot />
  </V0Paper>
</template>
