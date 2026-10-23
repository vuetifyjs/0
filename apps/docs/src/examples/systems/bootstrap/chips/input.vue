<script setup lang="ts">
  import { BChips } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const skills = shallowRef(['JavaScript', 'TypeScript'])
</script>

<template>
  <BChips
    v-model="skills"
    input
    placeholder="Add more…"
    theme="primary"
  />
</template>
