<script setup lang="ts">
  import { Md1ToggleButtons } from '@paper/md1'

  import { ref } from 'vue'

  const styles = ref<string[]>([])
</script>

<template>
  <div class="md1-docs-stack">
    <Md1ToggleButtons v-model="styles" label="Text style" multiple>
      <Md1ToggleButtons.Item value="bold">Bold</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="italic">Italic</Md1ToggleButtons.Item>

      <Md1ToggleButtons.Item value="underline">Underline</Md1ToggleButtons.Item>
    </Md1ToggleButtons>

    <span class="md1-docs-note" role="status">{{ styles.length > 0 ? styles.join(', ') : 'Plain text' }}</span>
  </div>
</template>

<style>
  .md1-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--md1-spacing-2, 16px);
  }

  .md1-docs-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
