<script lang="ts">
  // Framework
  import { Avatar } from '@vuetify/v0'

  export interface EmAvatarImageProps {
    src: string
    alt?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatarImage' })

  const { src, alt, namespace } = defineProps<EmAvatarImageProps>()
</script>

<template>
  <Avatar.Image :alt class="emerald-avatar__image" :namespace :src />
</template>
