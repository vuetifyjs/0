<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Input } from '../Input/index'

  const email = ref('')
</script>

<template>
  <Input.Root v-model="email" label="Email">
    <Input.Control />
    <Input.Description>We'll never share your email.</Input.Description>

    <Input.Error v-slot="{ errors }">
      <span v-for="error in errors" :key="error">{{ error }}</span>
    </Input.Error>
  </Input.Root>
</template>
