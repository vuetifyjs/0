<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmListProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmList' })

  const {} = defineProps<EmListProps>()
</script>

<template>
  <V0Paper as="ul" class="emerald-list">
    <slot />
  </V0Paper>
</template>
