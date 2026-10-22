<script setup lang="ts">
  import { BRange } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const volume = shallowRef(60)
</script>

<template>
  <div>
    <label class="form-label" for="volume">Volume {{ volume }}</label>
    <BRange id="volume" v-model="volume" />
  </div>
</template>
