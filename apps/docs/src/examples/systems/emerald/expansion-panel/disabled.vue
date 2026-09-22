<script setup lang="ts">
  import {
    EmExpansionPanel,
    EmExpansionPanelActivator,
    EmExpansionPanelContent,
    EmExpansionPanelCue,
    EmExpansionPanelGroup,
    EmExpansionPanelHeader,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const open = shallowRef<string>()

  interface Item {
    value: string
    title: string
    body: string
    disabled?: boolean
  }

  const items: Item[] = [
    {
      value: 'profile',
      title: 'Profile',
      body: 'Name, avatar, and the short bio shown on your public page.',
    },
    {
      value: 'integrations',
      title: 'Integrations (requires a paid plan)',
      body: 'Connect external services to sync data automatically.',
      disabled: true,
    },
    {
      value: 'danger',
      title: 'Danger zone',
      body: 'Transfer ownership of the workspace or delete it permanently.',
    },
  ]
</script>

<template>
  <div class="emerald-docs-stack">
    <EmExpansionPanelGroup v-model="open">
      <EmExpansionPanel
        v-for="item in items"
        :key="item.value"
        :disabled="item.disabled"
        :value="item.value"
      >
        <EmExpansionPanelHeader>
          <EmExpansionPanelActivator>
            {{ item.title }}

            <EmExpansionPanelCue />
          </EmExpansionPanelActivator>
        </EmExpansionPanelHeader>

        <EmExpansionPanelContent>
          {{ item.body }}
        </EmExpansionPanelContent>
      </EmExpansionPanel>
    </EmExpansionPanelGroup>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    max-width: 520px;
  }
</style>
