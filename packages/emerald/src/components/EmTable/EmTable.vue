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
  background: var(--emerald-surface);
  overflow-x: auto;
}

.emerald-table-wrapper[data-bordered] {
  padding: var(--emerald-spacing-l);
  border: var(--emerald-stroke-s) solid var(--emerald-neutral-alpha-10);
  border-radius: var(--emerald-radius-s);
}

.emerald-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: var(--emerald-font-sans);
  font-size: var(--emerald-text-b2-size);
  font-weight: var(--emerald-text-b2-weight);
  line-height: var(--emerald-text-b2-height);
  letter-spacing: 0;
  color: var(--emerald-on-surface);
  text-align: start;
}
</style>
