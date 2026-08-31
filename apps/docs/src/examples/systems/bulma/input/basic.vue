<script setup lang="ts">
  import { BuControl, BuField, BuInput, BuLabel } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const name = shallowRef('')
</script>

<template>
  <BuField>
    <BuLabel>Name</BuLabel>

    <BuControl>
      <BuInput v-model="name" placeholder="Text input" />
    </BuControl>
  </BuField>
</template>
