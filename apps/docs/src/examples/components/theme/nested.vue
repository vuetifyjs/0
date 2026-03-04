<script setup lang="ts">
  import { Theme } from '@vuetify/v0'
</script>

<template>
  <Theme class="p-4 rounded border border-divider" theme="dark">
    <p class="text-sm bg-surface text-on-surface p-3 rounded mb-4">
      Dark section
    </p>

    <Theme class="p-4 rounded border border-divider" theme="light">
      <p class="text-sm bg-surface text-on-surface p-3 rounded">
        Light nested inside dark
      </p>
    </Theme>
  </Theme>
</template>
