<script setup lang="ts">
  import { EmDivider } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-stack">
    <p>
      Emerald is a thin, Figma-tokened skin over Vuetify0 — the headless
      primitives carry the behavior, the tokens carry the look.
    </p>

    <EmDivider />

    <p>
      Every component composes a v0 counterpart, so accessibility and state
      come from the same layer the rest of the ecosystem uses.
    </p>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-s, 12px);
    max-width: 420px;
  }

  .emerald-docs-stack p {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 21px);
    color: var(--emerald-on-surface);
  }
</style>
