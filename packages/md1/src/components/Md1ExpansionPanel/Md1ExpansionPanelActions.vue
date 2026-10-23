<script lang="ts">
  // Framework
  import { isNull, useLogger } from '@vuetify/v0'

  // Context
  import { useMd1ExpansionPanel } from './Md1ExpansionPanel.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1ExpansionPanelActions' })

  defineSlots<{
    /** The consumer's flat `Md1Button`s, dismissive before affirmative: CANCEL, then SAVE. */
    default?: () => any
  }>()

  const group = useMd1ExpansionPanel()
  const logger = useLogger()

  if (__DEV__ && isNull(group)) {
    logger.warn('[Md1ExpansionPanelActions] rendered outside <Md1ExpansionPanel>; its divider and spacing assume the panel body around it')
  }
</script>

<template>
  <div class="md1-expansion-panel__actions">
    <slot />
  </div>
</template>

<!-- Unscoped, like every Material Design 1 stylesheet. -->
<style>
  /*
   * The CANCEL / SAVE row (figure spec2): a full-width 1 dp divider, 16 dp
   * above and below the 36 dp flat buttons, the buttons 8 dp apart and 8 dp
   * from the edge, at the end side. The negative margins pull the row out of
   * the body's 24 dp side padding and its 16 dp bottom padding, so the
   * divider spans the sheet and the body keeps its 16 dp above the divider.
   * It emits nothing: the buttons are the consumer's.
   */
  .md1-expansion-panel__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--md1-spacing-1, 8px);
    margin: var(--md1-spacing-2, 16px) calc(-1 * var(--md1-spacing-3, 24px)) calc(-1 * var(--md1-spacing-2, 16px));
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-1, 8px);
    border-top: 1px solid var(--md1-divider, rgba(0, 0, 0, 0.12));
  }
</style>
