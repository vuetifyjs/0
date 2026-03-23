<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmMenuProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmMenu' })

  const {} = defineProps<EmMenuProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-menu">
    <slot />
  </V0Paper>
</template>
