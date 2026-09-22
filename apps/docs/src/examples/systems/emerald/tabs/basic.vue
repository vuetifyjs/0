<script setup lang="ts">
  import { EmTabs, EmTabsItem, EmTabsList, EmTabsPanel } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const tab = shallowRef('overview')
</script>

<template>
  <EmTabs v-model="tab">
    <EmTabsList label="Project sections">
      <EmTabsItem value="overview">Overview</EmTabsItem>

      <EmTabsItem value="activity">Activity</EmTabsItem>

      <EmTabsItem value="settings">Settings</EmTabsItem>
    </EmTabsList>

    <EmTabsPanel value="overview">
      A summary of the project — status, owners, and the latest release.
    </EmTabsPanel>

    <EmTabsPanel value="activity">
      Recent commits, comments, and deploys in reverse-chronological order.
    </EmTabsPanel>

    <EmTabsPanel value="settings">
      Project name, visibility, and integrations live here.
    </EmTabsPanel>
  </EmTabs>
</template>
