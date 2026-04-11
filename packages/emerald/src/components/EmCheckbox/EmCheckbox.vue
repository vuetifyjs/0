<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmCheckboxProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCheckbox' })

  const {} = defineProps<EmCheckboxProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-checkbox">
    <slot />
  </V0Paper>
</template>
