<script setup lang="ts">
  import {
    EmButton,
    EmCard,
    EmCardBody,
    EmCardFooter,
    EmCardHeader,
    EmCardSubtitle,
    EmCardTitle,
  } from '@paper/emerald'
</script>

<template>
  <EmCard class="emerald-docs-card">
    <EmCardHeader>
      <EmCardTitle>Workspace settings</EmCardTitle>

      <EmCardSubtitle>Visible to every member of the workspace</EmCardSubtitle>
    </EmCardHeader>

    <EmCardBody>
      Changes apply to all eight projects in this workspace. Members are
      notified the next time they open a board.
    </EmCardBody>

    <EmCardFooter>
      <EmButton variant="tertiary">Cancel</EmButton>

      <EmButton variant="primary">Save changes</EmButton>
    </EmCardFooter>
  </EmCard>
</template>

<style>
  .emerald-docs-card {
    max-width: 420px;
  }
</style>
