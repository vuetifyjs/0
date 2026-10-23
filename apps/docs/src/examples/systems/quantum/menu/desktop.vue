<script setup lang="ts">
  import { QuButton, QuMenu } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuMenu desktop>
      <QuMenu.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" dense>Format</QuButton>
      </QuMenu.Activator>

      <QuMenu.Content>
        <QuMenu.Item info="Ctrl+B">Bold</QuMenu.Item>

        <QuMenu.Item info="Ctrl+I">Italic</QuMenu.Item>

        <QuMenu.Item info="Ctrl+U">Underline</QuMenu.Item>

        <QuMenu.Divider />

        <QuMenu.Item info="Ctrl+\">Clear formatting</QuMenu.Item>
      </QuMenu.Content>
    </QuMenu>

    <QuMenu dense desktop>
      <QuMenu.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs" dense>Format (dense)</QuButton>
      </QuMenu.Activator>

      <QuMenu.Content>
        <QuMenu.Item info="Ctrl+B">Bold</QuMenu.Item>

        <QuMenu.Item info="Ctrl+I">Italic</QuMenu.Item>

        <QuMenu.Item info="Ctrl+U">Underline</QuMenu.Item>

        <QuMenu.Divider />

        <QuMenu.Item info="Ctrl+\">Clear formatting</QuMenu.Item>
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
