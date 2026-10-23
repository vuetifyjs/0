<script setup lang="ts">
  import { QuToggleButtons } from '@paper/quantum'

  import { ref } from 'vue'

  const styles = ref<string[]>([])
</script>

<template>
  <div class="quantum-docs-stack">
    <QuToggleButtons v-model="styles" label="Text style" multiple>
      <QuToggleButtons.Item value="bold">Bold</QuToggleButtons.Item>

      <QuToggleButtons.Item value="italic">Italic</QuToggleButtons.Item>

      <QuToggleButtons.Item value="underline">Underline</QuToggleButtons.Item>
    </QuToggleButtons>

    <span class="quantum-docs-note" role="status">{{ styles.length > 0 ? styles.join(', ') : 'Plain text' }}</span>
  </div>
</template>

<style>
  .quantum-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--quantum-spacing-2, 16px);
  }

  .quantum-docs-note {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
