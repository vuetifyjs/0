<script setup lang="ts">
  // Utilities
  import { shallowRef } from 'vue'

  import { TimePicker } from '../TimePicker/index'

  const value = shallowRef<string | null>('09:30:00')
</script>

<template>
  <TimePicker.Root v-model="value" hour-cycle="h12" seconds>
    <TimePicker.Hour v-slot="{ text }">{{ text }}</TimePicker.Hour>
    <TimePicker.Minute v-slot="{ text }">{{ text }}</TimePicker.Minute>
    <TimePicker.Second v-slot="{ text }">{{ text }}</TimePicker.Second>
    <TimePicker.Period v-slot="{ text }">{{ text }}</TimePicker.Period>
  </TimePicker.Root>
</template>
