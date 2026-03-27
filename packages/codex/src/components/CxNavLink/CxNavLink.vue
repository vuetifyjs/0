<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxNavLinkProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxNavLink' })

  const {} = defineProps<CxNavLinkProps>()
</script>

<template>
  <V0Paper as="li" class="codex-nav-link">
    <slot />
  </V0Paper>
</template>
