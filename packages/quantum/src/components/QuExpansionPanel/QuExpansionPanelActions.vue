<script lang="ts">
  // Framework
  import { isNull, useLogger } from '@vuetify/v0'

  // Context
  import { useQuExpansionPanel } from './QuExpansionPanel.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuExpansionPanelActions' })

  defineSlots<{
    /** The consumer's flat `QuButton`s, dismissive before affirmative: CANCEL, then SAVE. */
    default?: () => any
  }>()

  const group = useQuExpansionPanel()
  const logger = useLogger()

  if (__DEV__ && isNull(group)) {
    logger.warn('[QuExpansionPanelActions] rendered outside <QuExpansionPanel>; its divider and spacing assume the panel body around it')
  }
</script>

<template>
  <div class="quantum-expansion-panel__actions">
    <slot />
  </div>
</template>

<!-- Unscoped, like every Quantum stylesheet. -->
<style>
  /*
   * The CANCEL / SAVE row (figure spec2): a full-width 1 dp divider, 16 dp
   * above and below the 36 dp flat buttons, the buttons 8 dp apart and 8 dp
   * from the edge, at the end side. The negative margins pull the row out of
   * the body's 24 dp side padding and its 16 dp bottom padding, so the
   * divider spans the sheet and the body keeps its 16 dp above the divider.
   * It emits nothing: the buttons are the consumer's.
   */
  .quantum-expansion-panel__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--quantum-spacing-1, 8px);
    margin: var(--quantum-spacing-2, 16px) calc(-1 * var(--quantum-spacing-3, 24px)) calc(-1 * var(--quantum-spacing-2, 16px));
    padding: var(--quantum-spacing-2, 16px) var(--quantum-spacing-1, 8px);
    border-top: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }
</style>
