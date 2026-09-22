<script setup lang="ts">
  import { EmAvatar, EmAvatarFallback, EmAvatarImage } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-row">
    <!-- The image never loads, so the initials stay. -->
    <EmAvatar>
      <EmAvatarImage alt="Riley Okafor" src="https://invalid.example/missing.jpg" />

      <EmAvatarFallback>RO</EmAvatarFallback>
    </EmAvatar>

    <!-- No image at all — the fallback is the avatar. -->
    <EmAvatar>
      <EmAvatarFallback>AL</EmAvatarFallback>
    </EmAvatar>

    <EmAvatar>
      <EmAvatarFallback>+4</EmAvatarFallback>
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
