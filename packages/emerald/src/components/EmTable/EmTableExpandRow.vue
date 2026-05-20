<script lang="ts">
  export interface EmTableExpandRowProps {
    /** Whether the detail panel is visible. */
    expanded?: boolean
    /** Number of columns the panel cell should span. @default 100 */
    colspan?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableExpandRow' })

  const { expanded = false, colspan = 100 } = defineProps<EmTableExpandRowProps>()
</script>

<template>
  <tr
    v-if="expanded"
    class="emerald-table__expand-row"
    :data-expanded="expanded || undefined"
  >
    <td
      class="emerald-table__expand-cell"
      :colspan
    >
      <div class="emerald-table__expand-inner">
        <slot />
      </div>
    </td>
  </tr>
</template>

<style>
.emerald-table__expand-row {
  background: var(--emerald-background, #faf9ff);
}

.emerald-table__expand-cell {
  padding: 12px;
  border-bottom: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
}

.emerald-table__expand-inner {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 12px;
}
</style>
