<script setup lang="ts">
  import { BCheck } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const on = shallowRef(true)
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <div class="form-field">
      <BCheck id="checkPrimary" v-model="on" theme="primary" />
      <label for="checkPrimary">Primary checkbox</label>
    </div>
  </div>
</template>
