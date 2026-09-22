<script setup lang="ts">
  import { BuControl, BuField, BuLabel, BuTextarea } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const message = shallowRef('')
</script>

<template>
  <BuField>
    <BuLabel>Message</BuLabel>

    <BuControl>
      <BuTextarea v-model="message" placeholder="e.g. Hello world" />
    </BuControl>
  </BuField>
</template>
