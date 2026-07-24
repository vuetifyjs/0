<script lang="ts">
  // Framework
  import { Avatar } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatarImage' })

  const { src, alt } = defineProps<{ src: string, alt?: string }>()
</script>

<template>
  <Avatar.Image :alt class="emerald-avatar__image" :src />
</template>
