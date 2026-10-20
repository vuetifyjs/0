<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Otp } from '../Otp/index'

  const code = shallowRef('')
</script>

<template>
  <Otp.Root v-slot="{ items }" v-model="code" :length="6">
    <Otp.Item
      v-for="item in items"
      :key="item.index"
      :index="item.index"
    />
  </Otp.Root>
</template>
