<script lang="ts">
  // Framework
  import { AvatarFallback } from '@vuetify/v0'

  // Types
  import type { AvatarFallbackProps } from '@vuetify/v0'

  export interface EmAvatarFallbackProps extends AvatarFallbackProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatarFallback' })

  const { ...fallbackProps } = defineProps<EmAvatarFallbackProps>()
</script>

<template>
  <AvatarFallback v-bind="fallbackProps" class="emerald-avatar__fallback">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </AvatarFallback>
</template>
