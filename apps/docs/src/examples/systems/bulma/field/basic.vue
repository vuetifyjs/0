<script setup lang="ts">
  import { BuControl, BuField, BuHelp, BuInput, BuLabel } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const name = shallowRef('')
</script>

<template>
  <BuField>
    <BuLabel>Label</BuLabel>

    <BuControl>
      <BuInput v-model="name" placeholder="Text input" />
    </BuControl>

    <BuHelp>This is a help text</BuHelp>
  </BuField>
</template>
