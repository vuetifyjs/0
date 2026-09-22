<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { Form } from '../Form/index'

  const valid = shallowRef<boolean | null>(null)
</script>

<template>
  <Form v-model="valid">
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </Form>
</template>
