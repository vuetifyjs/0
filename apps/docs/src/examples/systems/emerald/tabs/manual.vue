<script setup lang="ts">
  import { EmTabs, EmTabsItem, EmTabsList, EmTabsPanel } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const report = shallowRef('revenue')
</script>

<template>
  <EmTabs v-model="report" activation="manual">
    <EmTabsList label="Reports">
      <EmTabsItem value="revenue">Revenue</EmTabsItem>

      <EmTabsItem value="expenses">Expenses</EmTabsItem>

      <EmTabsItem value="forecast">Forecast</EmTabsItem>
    </EmTabsList>

    <EmTabsPanel value="revenue">
      Quarterly revenue by region. Imagine a chart that takes a moment to render.
    </EmTabsPanel>

    <EmTabsPanel value="expenses">
      Operating expenses broken down by cost center.
    </EmTabsPanel>

    <EmTabsPanel value="forecast">
      Projections for the next two quarters based on the trailing year.
    </EmTabsPanel>
  </EmTabs>
</template>
