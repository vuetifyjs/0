<script setup lang="ts">
  import {
    BuField,
    BuHelp,
    BuLabel,
    BuNumberField,
    BuNumberFieldDecrement,
    BuNumberFieldIncrement,
    BuNumberFieldInput,
  } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const allocated = shallowRef<number | null>(3)
</script>

<template>
  <BuField>
    <BuLabel for="allocated">Allocated seats</BuLabel>

    <BuNumberField id="allocated" v-model="allocated" readonly>
      <BuNumberFieldDecrement />
      <BuNumberFieldInput expanded />
      <BuNumberFieldIncrement />
    </BuNumberField>

    <BuHelp>The value is selectable and the field still takes focus; the steppers do not.</BuHelp>
  </BuField>
</template>
