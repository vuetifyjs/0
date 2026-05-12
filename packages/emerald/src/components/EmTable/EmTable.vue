<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface EmTableProps extends V0PaperProps {
    bordered?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTable' })

  const { bordered = true, ...paperProps } = defineProps<EmTableProps>()
</script>

<template>
  <div
    class="emerald-table-wrapper"
    :data-bordered="bordered || undefined"
  >
    <V0Paper
      v-bind="paperProps"
      as="table"
      class="emerald-table"
    >
      <slot />
    </V0Paper>
  </div>
</template>

<style>
.emerald-table-wrapper {
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  overflow-x: auto;
}

.emerald-table-wrapper[data-bordered] {
  padding: 12px;
  border: 1px solid rgb(var(--emerald-neutral-channels, 26 28 30) / 0.1);
  border-radius: 6px;
}

.emerald-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 12px;
  line-height: normal;
  letter-spacing: 0.24px;
  color: #000;
  text-align: left;
}
</style>
