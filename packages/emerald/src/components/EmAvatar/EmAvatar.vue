<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmAvatarProps extends V0PaperProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatar' })

  const {} = defineProps<EmAvatarProps>()
</script>

<template>
  <V0Paper as="span" class="emerald-avatar">
    <slot />
  </V0Paper>
</template>
