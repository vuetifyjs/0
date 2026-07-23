<script lang="ts">
  export interface EmAvatarBadgeProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmAvatarBadge' })
</script>

<template>
  <span class="emerald-avatar__badge">
    <slot />
  </span>
</template>
