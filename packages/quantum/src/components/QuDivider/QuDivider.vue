<script lang="ts">
  // Framework
  import { Atom } from '@vuetify/v0'

  export interface QuDividerProps {
    /**
     * Starts the rule at the content keyline (72 dp, 80 dp from 600 px) instead
     * of the edge: the divider for related content beside an avatar or icon.
     * Full bleed, the default, marks distinct sections.
     */
    inset?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuDivider' })

  const { inset = false } = defineProps<QuDividerProps>()
</script>

<template>
  <Atom
    as="hr"
    class="quantum-divider"
    :data-inset="inset || undefined"
  />
</template>

<!-- Unscoped, like every Quantum stylesheet (DESIGN_SYSTEMS.md ruling 3). -->
<style>
  /*
   * A 1 dp rule in the 12% divider ink and nothing else: the dividers page
   * puts it inside the bottom of the tile it closes, so it carries no margin
   * of its own. Drawn as a border rather than a fill so forced-colours mode,
   * which drops backgrounds, keeps the rule.
   */
  .quantum-divider {
    display: block;
    flex-shrink: 0;
    height: 0;
    margin: 0;
    padding: 0;
    border: 0;
    border-block-start: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  /* Inset: starts at the content keyline and runs to the end edge; the logical margin mirrors under dir="rtl". */
  .quantum-divider[data-inset] {
    margin-inline-start: var(--quantum-keyline-content, 72px);
  }

  /* From 600 px the content keyline is 80 dp (the keylines page's tablet column); restated so the rule holds without theme.css. */
  @media (min-width: 600px) {
    .quantum-divider[data-inset] {
      margin-inline-start: var(--quantum-keyline-content, 80px);
    }
  }
</style>
