<script lang="ts">
  // Framework
  import { Avatar } from '@vuetify/v0'
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatarFallback' })
</script>

<template>
  <Avatar.Fallback class="emerald-avatar__fallback">
    <slot />
  </Avatar.Fallback>
</template>
