<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmSelectProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSelect' })

  const {} = defineProps<EmSelectProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-select">
    <slot />
  </V0Paper>
</template>
