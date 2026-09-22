<script setup lang="ts">
  import {
    BuField,
    BuHelp,
    BuLabel,
    BuNumberField,
  } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const allocated = shallowRef<number | null>(3)
</script>

<template>
  <BuField>
    <BuLabel for="allocated">Allocated seats</BuLabel>

    <BuNumberField id="allocated" v-model="allocated" readonly>
      <BuNumberField.Decrement />
      <BuNumberField.Input expanded />
      <BuNumberField.Increment />
    </BuNumberField>

    <BuHelp>The value is selectable and the field still takes focus; the steppers do not.</BuHelp>
  </BuField>
</template>
