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

  const items = ['read', 'write', 'deploy', 'billing']
</script>

<template>
  <div class="emerald-docs-stack">
    <EmSelect v-model="scopes" label="Access scopes" multiple>
      <EmSelectActivator>
        <EmSelectValue v-slot="{ selectedValues }">
          {{ selectedValues.join(', ') }}
        </EmSelectValue>

        <EmSelectPlaceholder>No access</EmSelectPlaceholder>
      </EmSelectActivator>

      <EmSelectContent>
        <EmSelectItem v-for="item in items" :key="item" :value="item">
          {{ item }}
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
