<script setup lang="ts">
  import { BStrength } from '@paper/bootstrap'

  import { shallowRef, toRef } from 'vue'

  const password = shallowRef('')
  const level = toRef(() => Math.min(4, password.value.length))
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const text = toRef(() => labels[level.value] ?? '')
</script>

<template>
  <div>
    <label class="form-label" for="password1">Password</label>

    <input
      id="password1"
      v-model="password"
      class="form-control"
      placeholder="Enter password"
      type="password"
    >

    <BStrength :text :value="level" />
  </div>
</template>
