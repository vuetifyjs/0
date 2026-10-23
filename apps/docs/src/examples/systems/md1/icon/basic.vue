<script setup lang="ts">
  import { Md1Icon } from '@paper/md1'
</script>

<template>
  <div class="md1-docs-row">
    <Md1Icon class="md1-docs-icon-ink" name="menu" />

    <Md1Icon class="md1-docs-icon-ink" name="search" />

    <Md1Icon class="md1-docs-icon-ink" name="favorite" />

    <Md1Icon class="md1-docs-icon-ink" name="share" />

    <Md1Icon class="md1-docs-icon-ink" name="more-vert" />
  </div>
</template>

<style>
  /* The host sets the ink: active icons on the theme surface. */
  .md1-docs-icon-ink {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>
