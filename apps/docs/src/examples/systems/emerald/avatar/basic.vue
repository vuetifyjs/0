<script setup lang="ts">
  import { EmAvatar, EmAvatarFallback, EmAvatarImage } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmAvatar>
      <EmAvatarImage alt="Sarah Chen" src="https://i.pravatar.cc/96?img=47" />

      <EmAvatarFallback>SC</EmAvatarFallback>
    </EmAvatar>

    <EmAvatar>
      <EmAvatarImage alt="Marcus Webb" src="https://i.pravatar.cc/96?img=12" />

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
