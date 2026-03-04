<script setup lang="ts">
  import BookmarkConsumer from './BookmarkConsumer.vue'
  import BookmarkProvider from './BookmarkProvider.vue'
</script>

<template>
  <BookmarkProvider>
    <BookmarkConsumer />
  </BookmarkProvider>
</template>
