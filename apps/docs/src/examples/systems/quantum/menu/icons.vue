<script setup lang="ts">
  import { QuButton, QuMenu } from '@paper/quantum'
</script>

<template>
  <div class="quantum-docs-row">
    <QuMenu>
      <QuMenu.Activator v-slot="{ attrs }">
        <QuButton v-bind="attrs">Document</QuButton>
      </QuMenu.Activator>

      <QuMenu.Content>
        <QuMenu.Item icon="visibility">Preview</QuMenu.Item>

        <QuMenu.Item icon="share" info="Ctrl+S">Share</QuMenu.Item>

        <QuMenu.Item icon="link" info="Ctrl+L">Get link</QuMenu.Item>

        <QuMenu.Item icon="edit">Rename</QuMenu.Item>

        <QuMenu.Item icon="delete" info="Delete">Remove</QuMenu.Item>
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
