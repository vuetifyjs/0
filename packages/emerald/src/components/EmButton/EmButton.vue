<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmButtonProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmButton' })

  const {} = defineProps<EmButtonProps>()
</script>

<template>
  <V0Paper as="button" class="emerald-button">
    <slot />
  </V0Paper>
</template>
