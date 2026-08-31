<script setup lang="ts">
  import {
    EmCard,
    EmCardBody,
    EmCardHeader,
    EmCardSubtitle,
    EmCardTitle,
  } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-grid">
    <EmCard variant="complete">
      <EmCardHeader>
        <EmCardTitle>Complete</EmCardTitle>

        <EmCardSubtitle>Padded and elevated</EmCardSubtitle>
      </EmCardHeader>

      <EmCardBody>
        The default. Generous padding and a resting shadow make it a
        standalone surface that reads against the page.
      </EmCardBody>
    </EmCard>

    <EmCard variant="simple">
      <EmCardBody class="emerald-docs-pad">
        Simple is a flat, near-flush shell — a rounded, clipped boundary
        with almost no padding of its own, for content that brings its own
        spacing or wants to sit edge to edge.
      </EmCardBody>
    </EmCard>
  </div>
</template>

<style>
  .emerald-docs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--emerald-spacing-l, 20px);
    align-items: start;
  }

  .emerald-docs-pad {
    padding: var(--emerald-spacing-m, 16px);
  }
</style>
