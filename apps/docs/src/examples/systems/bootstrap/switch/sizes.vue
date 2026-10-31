<script setup lang="ts">
  import { BSwitch } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const small = shallowRef(false)
  const medium = shallowRef(false)
  const large = shallowRef(false)
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <div class="form-field">
      <BSwitch id="switchSizeSm" v-model="small" size="sm" />
      <label for="switchSizeSm">Small switch</label>
    </div>

    <div class="form-field">
      <BSwitch id="switchSizeMd" v-model="medium" />
      <label for="switchSizeMd">Default switch</label>
    </div>

    <div class="form-field">
      <BSwitch id="switchSizeLg" v-model="large" size="lg" />
      <label for="switchSizeLg">Large switch</label>
    </div>
  </div>
</template>
