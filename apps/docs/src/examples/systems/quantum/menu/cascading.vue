<script setup lang="ts">
  import { QuButton, QuMenu } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuMenu desktop>
      <QuMenu.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" dense>Insert</QuButton>
      </QuMenu.Activator>

      <QuMenu.Content>
        <QuMenu.Item icon="photo">Image</QuMenu.Item>

        <QuMenu.Item icon="link">Link</QuMenu.Item>

        <QuMenu.Sub icon="event" label="Date and time">
          <QuMenu.Item>Today</QuMenu.Item>

          <QuMenu.Item>Tomorrow</QuMenu.Item>

          <QuMenu.Item>Current time</QuMenu.Item>
        </QuMenu.Sub>
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
