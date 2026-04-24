<script lang="ts">
  // Framework
  import { AvatarImage } from '@vuetify/v0'

  // Types
  import type { AvatarImageProps } from '@vuetify/v0'

  export interface EmAvatarImageProps extends AvatarImageProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatarImage' })

  const { ...imageProps } = defineProps<EmAvatarImageProps>()
</script>

<template>
  <AvatarImage v-bind="imageProps" class="emerald-avatar__image">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </AvatarImage>
</template>
