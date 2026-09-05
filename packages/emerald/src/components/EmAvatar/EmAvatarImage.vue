<script lang="ts">
  // Framework
  import { Avatar } from '@vuetify/v0'

  // Types
  import type { AvatarImageProps } from '@vuetify/v0'

  export interface EmAvatarImageProps extends Pick<AvatarImageProps, 'alt' | 'namespace'> {
    /** Required here, unlike v0 — an Emerald avatar image always has a source. */
    src: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatarImage' })

  const { src, alt, namespace } = defineProps<EmAvatarImageProps>()
</script>

<template>
  <Avatar.Image :alt class="emerald-avatar__image" :namespace :src />
</template>
