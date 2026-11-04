<script setup lang="ts">
  import { BRadio } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const choice = shallowRef('first')
</script>

<template>
  <div class="d-flex flex-column gap-2">
    <div class="form-field">
      <BRadio
        id="radio1"
        v-model="choice"
        name="radios"
        value="first"
      />

      <label for="radio1">First example radio</label>
    </div>

    <div class="form-field">
      <BRadio
        id="radio2"
        v-model="choice"
        name="radios"
        value="second"
      />

      <label for="radio2">Second example radio</label>
    </div>

    <div class="form-field">
      <BRadio
        id="radio3"
        v-model="choice"
        name="radios"
        value="third"
      />

      <label for="radio3">Third example radio</label>
    </div>
  </div>
</template>
