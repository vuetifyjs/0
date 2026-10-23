<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
  import { shallowRef } from 'vue'

  const amount = shallowRef('')
  const weight = shallowRef('12')
  const user = shallowRef('')
</script>

<template>
  <div class="md1-docs-fields">
    <Md1TextField v-model="amount" inputmode="decimal" label="Amount" prefix="$" />

    <Md1TextField v-model="weight" inputmode="decimal" label="Weight" suffix="kg" />

    <Md1TextField v-model="user" label="Email" suffix="@example.com" />
  </div>
</template>

<style>
  .md1-docs-fields {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    max-width: 360px;
  }
</style>
