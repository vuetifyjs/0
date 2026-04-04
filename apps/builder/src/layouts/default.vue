<script setup lang="ts">
  // Components
  import AppBar from '@/components/app/AppBar.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-on-background">
    <AppBar />

    <main class="pt-14">
      <slot />
    </main>
  </div>
</template>
