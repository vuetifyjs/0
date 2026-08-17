<script setup lang="ts">
  import { EmAvatar, EmAvatarFallback } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmAvatar>
      <EmAvatarFallback>SC</EmAvatarFallback>
    </EmAvatar>

    <EmAvatar>
      <EmAvatarFallback>MW</EmAvatarFallback>
    </EmAvatar>

    <EmAvatar>
      <EmAvatarFallback>JD</EmAvatarFallback>
    </EmAvatar>
  </div>
</template>

<style>
  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-s, 12px);
  }
</style>
