<script setup lang="ts">
  import { QuButton, QuCheckbox, QuIconToggle } from '@paper/quantum'
  import { shallowRef } from 'vue'

  const starred = shallowRef(false)
  const remember = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-row">
    <QuButton variant="raised">Save</QuButton>

    <QuButton>Cancel</QuButton>

    <QuIconToggle v-model="starred" aria-label="Star" icon="star-border" icon-on="star" />

    <QuCheckbox v-model="remember" label="Remember me" />
  </div>
</template>

<style>
  .quantum-docs-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
  }
</style>
