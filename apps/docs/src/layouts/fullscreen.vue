<script lang="ts" setup>
  //
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <AppBanner />
    <AppBar />
    <main class="flex-1 flex flex-col">
      <router-view />
    </main>
    <HomeFooter />
  </div>
</template>
