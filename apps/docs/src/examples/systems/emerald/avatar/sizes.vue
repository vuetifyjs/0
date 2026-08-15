<script setup lang="ts">
  import { EmAvatar, EmAvatarFallback, EmAvatarImage } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <EmAvatar size="sm">
      <EmAvatarImage alt="Sarah Chen" src="https://i.pravatar.cc/96?img=47" />

      <EmAvatarFallback>SC</EmAvatarFallback>
    </EmAvatar>

    <EmAvatar size="md">
      <EmAvatarImage alt="Sarah Chen" src="https://i.pravatar.cc/96?img=47" />

      <EmAvatarFallback>SC</EmAvatarFallback>
    </EmAvatar>

    <EmAvatar size="lg">
      <EmAvatarImage alt="Sarah Chen" src="https://i.pravatar.cc/96?img=47" />

      <EmAvatarFallback>SC</EmAvatarFallback>
    </EmAvatar>

    <EmAvatar size="sm">
      <EmAvatarFallback>SC</EmAvatarFallback>
    </EmAvatar>

    <EmAvatar size="md">
      <EmAvatarFallback>SC</EmAvatarFallback>
    </EmAvatar>

    <EmAvatar size="lg">
      <EmAvatarFallback>SC</EmAvatarFallback>
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
