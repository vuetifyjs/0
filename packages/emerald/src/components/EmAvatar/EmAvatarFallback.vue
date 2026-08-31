<script lang="ts">
  // Framework
  import { Avatar } from '@vuetify/v0'

  // Types
  import type { AvatarFallbackProps } from '@vuetify/v0'

  export interface EmAvatarFallbackProps extends Omit<AvatarFallbackProps, 'as' | 'renderless'> {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatarFallback' })

  const { namespace } = defineProps<EmAvatarFallbackProps>()
</script>

<template>
  <Avatar.Fallback class="emerald-avatar__fallback" :namespace>
    <slot />
  </Avatar.Fallback>
</template>
