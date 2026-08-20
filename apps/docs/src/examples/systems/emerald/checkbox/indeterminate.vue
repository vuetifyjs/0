<script setup lang="ts">
  import { EmCheckbox } from '@paper/emerald'
  import { ref, toRef } from 'vue'

  const items = ref([
    { label: 'Themes', checked: true },
    { label: 'Component packs', checked: false },
    { label: 'Icon sets', checked: false },
  ])

  const every = toRef(() => items.value.every(item => item.checked))
  const some = toRef(() => items.value.some(item => item.checked))
  const mixed = toRef(() => some.value && !every.value)

  function onAll (checked?: boolean) {
    for (const item of items.value) item.checked = checked ?? false
  }
</script>

<template>
  <div class="emerald-docs-stack">
    <EmCheckbox
      :indeterminate="mixed"
      :model-value="every"
      @update:model-value="onAll"
    >
      All listing types
    </EmCheckbox>

    <div class="emerald-docs-stack emerald-docs-nest">
      <EmCheckbox
        v-for="item in items"
        :key="item.label"
        v-model="item.checked"
      >
        {{ item.label }}
      </EmCheckbox>
    </div>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .emerald-docs-nest {
    padding-inline-start: var(--emerald-spacing-l, 24px);
  }
</style>
