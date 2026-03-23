<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmTooltipProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTooltip' })

  const {} = defineProps<EmTooltipProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-tooltip">
    <slot />
  </V0Paper>
</template>
