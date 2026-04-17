<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmTagProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTag' })

  const {} = defineProps<EmTagProps>()
</script>

<template>
  <V0Paper as="span" class="emerald-tag">
    <slot />
  </V0Paper>
</template>
