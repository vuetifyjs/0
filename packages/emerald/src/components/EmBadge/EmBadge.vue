<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmBadgeProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmBadge' })

  const {} = defineProps<EmBadgeProps>()
</script>

<template>
  <V0Paper as="span" class="emerald-badge">
    <slot />
  </V0Paper>
</template>
