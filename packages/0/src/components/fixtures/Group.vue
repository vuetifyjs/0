<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Group } from '../Group/index'

  const selected = ref([])
</script>

<template>
  <Group.Root v-model="selected">
    <Group.Item value="a">Option A</Group.Item>
    <Group.Item value="b">Option B</Group.Item>
  </Group.Root>
</template>
