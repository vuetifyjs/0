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

  const open = shallowRef('account')

  const items = [
    {
      value: 'account',
      title: 'Account',
      body: 'Your display name, email address, and password. Changes here take effect immediately.',
    },
    {
      value: 'notifications',
      title: 'Notifications',
      body: 'Choose which events reach your inbox and which stay in the in-app activity feed.',
    },
    {
      value: 'billing',
      title: 'Billing',
      body: 'Payment method, invoices, and the plan the workspace is on.',
    },
  ]
</script>

<template>
  <div class="emerald-docs-stack">
    <EmExpansionPanelGroup v-model="open" mandatory>
      <EmExpansionPanel v-for="item in items" :key="item.value" :value="item.value">
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
