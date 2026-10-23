<script setup lang="ts">
  import { QuButton, QuMenu } from '@paper/quantum'

  import { shallowRef } from 'vue'

  const ruler = shallowRef(true)
  const grid = shallowRef(false)
  const guides = shallowRef(true)
</script>

<template>
  <div class="quantum-docs-row">
    <QuMenu>
      <QuMenu.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs">View</QuButton>
      </QuMenu.Activator>

      <QuMenu.Content>
        <QuMenu.CheckItem v-model:checked="ruler">Show ruler</QuMenu.CheckItem>

        <QuMenu.CheckItem v-model:checked="grid">Show grid</QuMenu.CheckItem>

        <QuMenu.CheckItem v-model:checked="guides">Show guides</QuMenu.CheckItem>
      </QuMenu.Content>
    </QuMenu>
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
