<script setup lang="ts">
  import { BCheck } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const mixed = shallowRef(false)
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <div class="form-field">
      <BCheck id="checkIndeterminate" v-model="mixed" indeterminate />
      <label for="checkIndeterminate">Mixed selection</label>
    </div>
  </div>
</template>
