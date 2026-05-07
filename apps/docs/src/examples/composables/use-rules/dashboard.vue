<script setup lang="ts">
  import { provideRules } from './context'
  import Form from './Form.vue'

  provideRules()
</script>

<template>
  <Form />
</template>
