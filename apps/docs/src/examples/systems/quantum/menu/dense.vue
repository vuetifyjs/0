<script setup lang="ts">
  import { QuButton, QuMenu } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuMenu dense>
      <QuMenu.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs">Sort by</QuButton>
      </QuMenu.Activator>

      <QuMenu.Content>
        <QuMenu.Item>Name</QuMenu.Item>

        <QuMenu.Item>Date modified</QuMenu.Item>

        <QuMenu.Item>Size</QuMenu.Item>

        <QuMenu.Item>Type</QuMenu.Item>
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
