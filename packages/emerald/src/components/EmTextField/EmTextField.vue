<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmTextFieldProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextField' })

  const {} = defineProps<EmTextFieldProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-text-field">
    <slot />
  </V0Paper>
</template>
