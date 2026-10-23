<script setup lang="ts">
  import { QuButton, QuMenu } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuMenu>
      <QuMenu.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs">Open</QuButton>
      </QuMenu.Activator>

      <QuMenu.Content>
        <QuMenu.Subheader>Recent</QuMenu.Subheader>

        <QuMenu.Item>Budget.xlsx</QuMenu.Item>

        <QuMenu.Item>Roadmap.doc</QuMenu.Item>

        <QuMenu.Divider />

        <QuMenu.Subheader>Shared with me</QuMenu.Subheader>

        <QuMenu.Item>Offsite plan</QuMenu.Item>

        <QuMenu.Item>Team photos</QuMenu.Item>
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
