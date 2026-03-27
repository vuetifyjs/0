<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxSwitchProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxSwitch' })

  const {} = defineProps<CxSwitchProps>()
</script>

<template>
  <V0Paper as="button" class="codex-switch">
    <slot />
  </V0Paper>
</template>
