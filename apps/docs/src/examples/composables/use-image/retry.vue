<script setup lang="ts">
  import RetryableImage from './RetryableImage.vue'
</script>

<template>
  <div class="max-w-md mx-auto">
    <RetryableImage
      alt="Photo that sometimes loads"
      src="https://picsum.photos/seed/retry-ok/400/300"
    />
  </div>
</template>
