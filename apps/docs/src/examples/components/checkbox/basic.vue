<script setup lang="ts">
  import { Checkbox } from '@vuetify/v0'
</script>

<template>
  <label class="inline-flex items-center gap-2">
    <Checkbox.Root class="size-5 border rounded inline-flex items-center justify-center border-divider">
      <Checkbox.Indicator class="text-primary text-sm">✓</Checkbox.Indicator>
    </Checkbox.Root>
    <span>I agree to the terms and conditions</span>
  </label>
</template>
