<script setup lang="ts">
  // Components
  import AppBar from '@/components/app/AppBar.vue'
  import AppFooter from '@/components/app/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-on-background">
    <AppBar />

    <main class="pt-14">
      <router-view />
    </main>

    <AppFooter />
  </div>
</template>
