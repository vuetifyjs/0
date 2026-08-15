<script setup lang="ts">
  import {
    EmIcon,
    EmList,
    EmListItem,
    EmListItemContent,
    EmListItemMedia,
    EmListItemTitle,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const active = shallowRef<string>()

  const items = [
    { id: 'profile', icon: 'user', label: 'Profile' },
    { id: 'notifications', icon: 'bell', label: 'Notifications' },
    { id: 'appearance', icon: 'palette', label: 'Appearance' },
    { id: 'billing', icon: 'card', label: 'Billing' },
  ] as const
</script>

<template>
  <div class="emerald-docs-list">
    <EmList v-model="active">
      <EmListItem v-for="item in items" :key="item.id" :value="item.id">
        <EmListItemMedia>
          <EmIcon :name="item.icon" size="s" />
        </EmListItemMedia>

        <EmListItemContent>
          <EmListItemTitle>{{ item.label }}</EmListItemTitle>
        </EmListItemContent>
      </EmListItem>
    </EmList>

    <p class="emerald-docs-caption">{{ active ? `Selected: ${active}` : 'Nothing selected' }}</p>
  </div>
</template>

<style>
  .emerald-docs-list {
    max-width: 320px;
  }

  .emerald-docs-caption {
    margin: var(--emerald-spacing-s, 12px) 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    line-height: var(--emerald-text-b3-height, 18px);
  }
</style>
