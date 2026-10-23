<script setup lang="ts">
  import { QuSubheader } from '@paper/quantum'

  const groups = [
    { letter: 'A', names: ['Ali Connors', 'Alex Nelson', 'Angela Fisher'] },
    { letter: 'B', names: ['Britta Holt', 'Brian Powell'] },
    { letter: 'S', names: ['Sandra Adams', 'Scott Stirling', 'Shirley Harvey'] },
    { letter: 'T', names: ['Trevor Hansen', 'Tanya Brewer'] },
  ]
</script>

<template>
  <div class="quantum-docs-subheader-scroll quantum-elevation-2">
    <section v-for="group in groups" :key="group.letter" class="quantum-docs-subheader-section">
      <QuSubheader>{{ group.letter }}</QuSubheader>

      <div v-for="name in group.names" :key="name" class="quantum-docs-subheader-tile quantum-type-subheading">
        {{ name }}
      </div>
    </section>
  </div>
</template>

<style>
  /* A list sheet that scrolls: a fixed height, the surface colour, and no scroll chaining into the page. */
  .quantum-docs-subheader-scroll {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    height: 240px;
    overflow-y: auto;
    overscroll-behavior: contain;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
  }

  /* One element per section, so the next subheader pushes the pinned one off; the section carries the surface the pinned subheader inherits. */
  .quantum-docs-subheader-section {
    background-color: inherit;
  }

  .quantum-docs-subheader-tile {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--quantum-keyline-margin, 16px);
  }
</style>
