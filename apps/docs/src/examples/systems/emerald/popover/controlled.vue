<script setup lang="ts">
  import {
    EmButton,
    EmPopover,
    EmPopoverActivator,
    EmPopoverContent,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <div class="emerald-docs-stack">
    <div class="emerald-docs-row">
      <EmPopover v-model="open">
        <EmPopoverActivator v-slot="{ attrs }" renderless>
          <EmButton v-bind="attrs">Filters</EmButton>
        </EmPopoverActivator>

        <EmPopoverContent>
          <div class="emerald-docs-panel">
            <p class="emerald-docs-note">
              Close this panel from inside, from the trigger, from the button
              beside it, or by clicking anywhere else.
            </p>

            <EmButton size="sm" variant="tertiary" @click="open = false">
              Done
            </EmButton>
          </div>
        </EmPopoverContent>
      </EmPopover>

      <EmButton variant="secondary" @click="open = !open">
        Toggle from outside
      </EmButton>
    </div>

    <p class="emerald-docs-state">Open: {{ open }}</p>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--emerald-spacing-m, 16px);
    padding: var(--emerald-spacing-l, 24px) 0;
  }

  .emerald-docs-row {
    display: flex;
    gap: var(--emerald-spacing-s, 12px);
  }

  .emerald-docs-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--emerald-spacing-s, 12px);
    max-width: 260px;
  }

  .emerald-docs-note {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    line-height: var(--emerald-text-b2-height, 20px);
  }

  .emerald-docs-state {
    margin: 0;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-on-surface-variant, #5f6368);
  }
</style>
