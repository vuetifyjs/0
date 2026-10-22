<script setup lang="ts">
  import { BCheck } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const small = shallowRef(true)
  const medium = shallowRef(true)
  const large = shallowRef(true)
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <div class="form-field">
      <BCheck id="checkSizeSm" v-model="small" size="sm" />
      <label for="checkSizeSm">Small checkbox</label>
    </div>

    <div class="form-field">
      <BCheck id="checkSizeMd" v-model="medium" />
      <label for="checkSizeMd">Default checkbox</label>
    </div>

    <div class="form-field">
      <BCheck id="checkSizeLg" v-model="large" size="lg" />
      <label for="checkSizeLg">Large checkbox</label>
    </div>
  </div>
</template>
