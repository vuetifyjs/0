<script lang="ts">
  /**
   * Trailing-cell wrapper for per-row actions (typically an `EmMenu` with a
   * 3-dot trigger). The cell is sized to hug its content and right-aligned by
   * default to match the Figma "actions column" pattern.
   */
  export interface EmTableActionsProps {}
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableActions' })
</script>

<template>
  <td class="emerald-table__cell emerald-table__cell--actions">
    <slot />
  </td>
</template>

<style>
.emerald-table__cell--actions {
  width: 1px;
  padding-left: 4px;
  white-space: nowrap;
  text-align: right;
}

.emerald-table__cell--actions > * {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

.emerald-table__cell--actions > * + * {
  margin-left: 4px;
}
</style>
