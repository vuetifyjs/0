<script lang="ts">
  // Components
  import EmCheckboxSelectAll from '../EmCheckbox/EmCheckboxSelectAll.vue'

  export interface EmTableCheckboxAllProps {
    label?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTableCheckboxAll' })

  const { label = 'Select all' } = defineProps<EmTableCheckboxAllProps>()
</script>

<template>
  <th
    class="emerald-table__header emerald-table__header--checkbox"
    scope="col"
  >
    <div class="emerald-table__header-inner">
      <EmCheckboxSelectAll :label>
        <template #default="slotProps">
          <slot v-bind="slotProps" />
        </template>
      </EmCheckboxSelectAll>
    </div>
  </th>
</template>

<style>
.emerald-table__header--checkbox {
  width: 1px;
  padding-right: 4px;
  white-space: nowrap;
}
</style>
