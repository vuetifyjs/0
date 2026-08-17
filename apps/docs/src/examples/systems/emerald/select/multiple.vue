<script setup lang="ts">
  import {
    EmSelect,
    EmSelectActivator,
    EmSelectContent,
    EmSelectItem,
    EmSelectPlaceholder,
    EmSelectValue,
  } from '@paper/emerald'

  import { ref } from 'vue'

  const scopes = ref<string[]>(['read'])

  const items = [
    { value: 'read', label: 'Read' },
    { value: 'write', label: 'Write' },
    { value: 'deploy', label: 'Deploy' },
    { value: 'billing', label: 'Billing' },
  ]

  function find (value: unknown) {
    return items.find(item => item.value === value)
  }
</script>

<template>
  <div class="emerald-docs-stack">
    <EmSelect v-model="scopes" label="Access scopes" multiple>
      <EmSelectActivator>
        <EmSelectValue v-slot="{ selectedValues }">
          {{ selectedValues.map(value => find(value)?.label ?? value).join(', ') }}
        </EmSelectValue>

        <EmSelectPlaceholder>No access</EmSelectPlaceholder>
      </EmSelectActivator>

      <EmSelectContent>
        <EmSelectItem v-for="item in items" :key="item.value" :value="item.value">
          {{ item.label }}
        </EmSelectItem>
      </EmSelectContent>
    </EmSelect>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    max-width: 320px;
  }
</style>
