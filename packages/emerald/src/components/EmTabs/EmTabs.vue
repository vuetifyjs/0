<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmTabsProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTabs' })

  const {} = defineProps<EmTabsProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-tabs">
    <slot />
  </V0Paper>
</template>
