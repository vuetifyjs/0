<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Selection } from '../Selection/index'

  const selected = ref([])
</script>

<template>
  <Selection.Root v-model="selected" multiple>
    <Selection.Item v-slot="{ attrs }" value="a">
      <button v-bind="attrs">Option A</button>
    </Selection.Item>

    <Selection.Item v-slot="{ attrs }" value="b">
      <button v-bind="attrs">Option B</button>
    </Selection.Item>
  </Selection.Root>
</template>
