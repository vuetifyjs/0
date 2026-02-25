<script setup lang="ts">
  // Framework
  import { Scrim } from '@vuetify/v0'
</script>

<template>
  <div>
    <router-view />

    <Scrim class="fixed inset-0 bg-black/30 transition-opacity" :teleport="false" />
  </div>
</template>
