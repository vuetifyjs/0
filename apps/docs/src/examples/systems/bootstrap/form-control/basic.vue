<script setup lang="ts">
  import { BFormControl, BFormLabel } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const email = shallowRef('')
</script>

<template>
  <div>
    <BFormLabel class="mb-2" for="exampleFormControlInput">Email address</BFormLabel>

    <BFormControl
      id="exampleFormControlInput"
      v-model="email"
      placeholder="name@example.com"
      type="email"
    />
  </div>
</template>
