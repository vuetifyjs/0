<script setup lang="ts">
  import { ref } from 'vue'
  import { EmTag } from '@paper/emerald'

  const topics = ['Vue', 'TypeScript', 'Accessibility', 'Tokens']
  const selected = ref<string[]>(['Vue'])

  function onToggle (topic: string) {
    const index = selected.value.indexOf(topic)

    if (index === -1) selected.value.push(topic)
    else selected.value.splice(index, 1)
  }
</script>

<template>
  <div class="emerald-docs-filter">
    <div class="emerald-docs-tags">
      <EmTag
        v-for="topic in topics"
        :key="topic"
        interactive
        :selected="selected.includes(topic)"
        variant="success"
        @click="onToggle(topic)"
      >
        {{ topic }}
      </EmTag>
    </div>

    <span class="emerald-docs-caption">{{ selected.length }} selected</span>
  </div>
</template>

<style>
  .emerald-docs-filter {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-2xs, 4px);
  }

  .emerald-docs-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--emerald-spacing-2xs, 4px);
  }

  .emerald-docs-caption {
    font-family: var(--emerald-font-sans, Manrope, system-ui, sans-serif);
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-neutral-700);
  }
</style>
