<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmTableProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTable' })

  const {} = defineProps<EmTableProps>()
</script>

<template>
  <V0Paper as="table" class="emerald-table">
    <slot />
  </V0Paper>
</template>
