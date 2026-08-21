<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Otp } from '../Otp/index'

  const code = shallowRef('')
</script>

<template>
  <Otp.Root v-model="code" :length="6">
    <Otp.Item
      v-for="i in 6"
      :key="i"
      :index="i - 1"
    />
  </Otp.Root>
</template>
