<script setup lang="ts">
  import RetryableImage from './RetryableImage.vue'
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <RetryableImage
      alt="Working photo"
      src="https://picsum.photos/seed/retry-ok/400/300"
    />

    <RetryableImage
      alt="Broken photo — click Retry"
      src="https://invalid.example/missing.jpg"
    />
  </div>
</template>
