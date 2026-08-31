<script setup lang="ts">
  import { EmTabs, EmTabsItem, EmTabsList, EmTabsPanel } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const section = shallowRef('profile')
</script>

<template>
  <EmTabs v-model="section" orientation="vertical">
    <div class="emerald-docs-tabs-row">
      <EmTabsList label="Account settings">
        <EmTabsItem value="profile">Profile</EmTabsItem>

        <EmTabsItem value="security">Security</EmTabsItem>

        <EmTabsItem value="notifications">Notifications</EmTabsItem>

        <EmTabsItem value="billing">Billing</EmTabsItem>
      </EmTabsList>

      <EmTabsPanel value="profile">
        Display name, avatar, and the information other members can see.
      </EmTabsPanel>

      <EmTabsPanel value="security">
        Password, two-factor authentication, and active sessions.
      </EmTabsPanel>

      <EmTabsPanel value="notifications">
        Choose which events reach you by email and which stay in-app.
      </EmTabsPanel>

      <EmTabsPanel value="billing">
        Plan, payment method, and invoices for this workspace.
      </EmTabsPanel>
    </div>
  </EmTabs>
</template>

<style>
  .emerald-docs-tabs-row {
    display: flex;
    align-items: flex-start;
  }

  .emerald-docs-tabs-row .emerald-tabs__list {
    flex-shrink: 0;
  }

  .emerald-docs-tabs-row .emerald-tabs__panel {
    min-width: 0;
  }

  @media (max-width: 599px) {
    .emerald-docs-tabs-row {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
