<script setup lang="ts">
  import { BRadio } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const small = shallowRef('sm')
  const medium = shallowRef('md')
  const large = shallowRef('lg')
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <div class="form-field">
      <BRadio
        id="radioSizeSm"
        v-model="small"
        name="radio-sm"
        size="sm"
        value="sm"
      />

      <label for="radioSizeSm">Small radio</label>
    </div>

    <div class="form-field">
      <BRadio id="radioSizeMd" v-model="medium" name="radio-md" value="md" />
      <label for="radioSizeMd">Default radio</label>
    </div>

    <div class="form-field">
      <BRadio
        id="radioSizeLg"
        v-model="large"
        name="radio-lg"
        size="lg"
        value="lg"
      />

      <label for="radioSizeLg">Large radio</label>
    </div>
  </div>
</template>
