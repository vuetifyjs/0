<script setup lang="ts">
  import { BRange } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const volume = shallowRef(50)
</script>

<template>
  <div>
    <label
      class="form-label"
      for="range1"
    >Example range</label>

    <BRange
      id="range1"
      v-model="volume"
    />
  </div>
</template>
