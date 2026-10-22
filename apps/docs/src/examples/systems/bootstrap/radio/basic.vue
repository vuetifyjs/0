<script setup lang="ts">
  import { BRadio } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const choice = shallowRef('a')
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <div class="form-field">
      <BRadio id="radioLabel" v-model="choice" name="radios" value="a" />
      <label for="radioLabel">First example radio</label>
    </div>

    <div class="form-field">
      <BRadio id="radioLabel2" v-model="choice" name="radios" value="b" />
      <label for="radioLabel2">Second example radio</label>
    </div>
  </div>
</template>
