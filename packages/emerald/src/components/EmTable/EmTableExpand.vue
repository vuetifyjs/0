<script lang="ts">
  export interface EmTableExpandProps {
    colspan?: number
    expanded?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableExpand' })

  const { colspan = 1, expanded = false } = defineProps<EmTableExpandProps>()
</script>

<template>
  <tr
    v-if="expanded"
    class="emerald-table__expand"
  >
    <td
      class="emerald-table__expand-cell"
      :colspan
    >
      <slot />
    </td>
  </tr>
</template>

<style>
.emerald-table__expand-cell {
  /* TODO(token): spec block padding is 14px — between spacing-s (12px) and spacing-m (16px) */
  padding: 14px var(--emerald-spacing-m);
  background: var(--emerald-neutral-200);
  vertical-align: middle;
}
</style>
