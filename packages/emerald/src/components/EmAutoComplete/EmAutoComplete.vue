<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmAutoCompleteProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAutoComplete' })

  const {} = defineProps<EmAutoCompleteProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-auto-complete">
    <slot />
  </V0Paper>
</template>
