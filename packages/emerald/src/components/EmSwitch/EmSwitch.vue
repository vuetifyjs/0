<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmSwitchProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSwitch' })

  const {} = defineProps<EmSwitchProps>()
</script>

<template>
  <V0Paper as="div" class="emerald-switch">
    <slot />
  </V0Paper>
</template>
