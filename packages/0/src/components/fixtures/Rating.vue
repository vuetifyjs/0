<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Rating } from '../Rating/index'

  const rating = shallowRef(0)
</script>

<template>
  <Rating.Root v-model="rating">
    <Rating.Item
      v-for="i in 5"
      :key="i"
      v-slot="{ state }"
      :index="i"
    >
      {{ state === 'full' ? '&#9733;' : '&#9734;' }}
    </Rating.Item>
  </Rating.Root>
</template>
