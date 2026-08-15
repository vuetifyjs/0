<script lang="ts">
  // Framework
  import { Avatar } from '@vuetify/v0'

  export interface EmAvatarFallbackProps {
    namespace?: string
  }
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
