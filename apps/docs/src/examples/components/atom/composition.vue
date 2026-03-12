<script setup lang="ts">
  import Card from './Card.vue'
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <Card
      description="Build headless components with sensible defaults and full override control."
      image="https://picsum.photos/seed/v0-start/400/200"
      title="Getting Started"
    />

    <Card
      description="Foundation composables that power every v0 component."
      href="#"
      image="https://picsum.photos/seed/v0-composables/400/200"
      title="Composables Guide"
    />
  </div>
</template>
