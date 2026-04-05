<script setup lang="ts">
  // Components
  import AppBar from '@/components/app/AppBar.vue'
  import AppFooter from '@/components/app/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-on-background flex flex-col">
    <AppBar />

    <main class="pt-14 flex-1 max-w-4xl mx-auto px-6 w-full">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>
