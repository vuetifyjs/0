<script setup lang="ts">
  import { BCheck } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const agreed = shallowRef(true)
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <div class="form-field">
      <BCheck id="checkLabel" v-model="agreed" />
      <label for="checkLabel">Example new checkbox</label>
    </div>
  </div>
</template>
