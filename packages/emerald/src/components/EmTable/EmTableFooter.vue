<script lang="ts">
  export interface EmTableFooterProps {
    /** Number of columns the footer cell should span. @default 100 */
    colspan?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableFooter' })

  const { colspan = 100 } = defineProps<EmTableFooterProps>()
</script>

<template>
  <tfoot class="emerald-table__footer">
    <tr class="emerald-table__footer-row">
      <td
        class="emerald-table__footer-cell"
        :colspan
      >
        <div class="emerald-table__footer-inner">
          <slot />
        </div>
      </td>
    </tr>
  </tfoot>
</template>

<style>
.emerald-table__footer-cell {
  padding: 12px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: normal;
  letter-spacing: 0.24px;
  color: #000;
  border-top: 0.5px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
}

.emerald-table__footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
}
</style>
