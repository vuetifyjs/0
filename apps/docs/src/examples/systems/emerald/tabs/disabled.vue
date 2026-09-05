<script setup lang="ts">
  import { EmTabs, EmTabsItem, EmTabsList, EmTabsPanel } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const stage = shallowRef('draft')
</script>

<template>
  <EmTabs v-model="stage">
    <EmTabsList label="Release stages">
      <EmTabsItem value="draft">Draft</EmTabsItem>

      <EmTabsItem value="review">Review</EmTabsItem>

      <EmTabsItem disabled value="approval">Approval</EmTabsItem>

      <EmTabsItem value="published">Published</EmTabsItem>
    </EmTabsList>

    <EmTabsPanel value="draft">
      Work in progress. Edit freely — nothing here is visible to readers yet.
    </EmTabsPanel>

    <EmTabsPanel value="review">
      Waiting on a reviewer. Comments land here as they come in.
    </EmTabsPanel>

    <EmTabsPanel value="approval">
      Approval opens once review is complete.
    </EmTabsPanel>

    <EmTabsPanel value="published">
      Live versions and their release notes.
    </EmTabsPanel>
  </EmTabs>
</template>
