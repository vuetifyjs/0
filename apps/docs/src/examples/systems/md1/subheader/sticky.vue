<script setup lang="ts">
  import { Md1Subheader } from '@paper/md1'

  const groups = [
    { letter: 'A', names: ['Ali Connors', 'Alex Nelson', 'Angela Fisher'] },
    { letter: 'B', names: ['Britta Holt', 'Brian Powell'] },
    { letter: 'S', names: ['Sandra Adams', 'Scott Stirling', 'Shirley Harvey'] },
    { letter: 'T', names: ['Trevor Hansen', 'Tanya Brewer'] },
  ]
</script>

<template>
  <div class="md1-docs-subheader-scroll md1-elevation-2">
    <section v-for="group in groups" :key="group.letter" class="md1-docs-subheader-section">
      <Md1Subheader>{{ group.letter }}</Md1Subheader>

      <div v-for="name in group.names" :key="name" class="md1-docs-subheader-tile md1-type-subheading">
        {{ name }}
      </div>
    </section>
  </div>
</template>

<style>
  /* A list sheet that scrolls: a fixed height, the surface colour, and no scroll chaining into the page. */
  .md1-docs-subheader-scroll {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    height: 240px;
    overflow-y: auto;
    overscroll-behavior: contain;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* One element per section, so the next subheader pushes the pinned one off; the section carries the surface the pinned subheader inherits. */
  .md1-docs-subheader-section {
    background-color: inherit;
  }

  .md1-docs-subheader-tile {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 48px;
    padding-inline: var(--md1-keyline-margin, 16px);
  }
</style>
