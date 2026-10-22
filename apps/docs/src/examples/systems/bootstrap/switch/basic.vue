<script setup lang="ts">
  import { BSwitch } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const on = shallowRef(true)
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <div class="form-field">
      <BSwitch id="switchMdLabel" v-model="on" />
      <label for="switchMdLabel">Default switch</label>
    </div>
  </div>
</template>
