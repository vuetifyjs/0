<script setup lang="ts">
  //
</script>

<template>
  <div class="flex flex-col" style="min-height: calc(100vh - 72px)">
    <AppBanner />
    <AppBar />
    <main class="flex-1 flex flex-col">
      <router-view />
    </main>
  </div>
</template>
