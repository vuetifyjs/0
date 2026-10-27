<script setup lang="ts">
  import { BCheck } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const agreed = shallowRef(true)
</script>

<template>
  <div class="d-flex align-items-center">
    <BCheck
      id="check"
      v-model="agreed"
    />
  </div>
</template>
