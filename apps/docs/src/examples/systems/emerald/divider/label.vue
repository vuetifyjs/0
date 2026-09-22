<script setup lang="ts">
  import { EmButton, EmDivider } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-stack">
    <EmButton variant="primary">Sign in with email</EmButton>

    <EmDivider>or continue with</EmDivider>

    <EmButton variant="secondary">Single sign-on</EmButton>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    width: 100%;
    max-width: 320px;
  }
</style>
