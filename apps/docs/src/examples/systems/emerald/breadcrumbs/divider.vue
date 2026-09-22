<script setup lang="ts">
  import {
    EmBreadcrumbs,
    EmBreadcrumbsDivider,
    EmBreadcrumbsItem,
    EmBreadcrumbsLink,
    EmBreadcrumbsList,
    EmBreadcrumbsPage,
    EmIcon,
  } from '@paper/emerald'
</script>

<template>
  <div class="emerald-docs-stack">
    <EmBreadcrumbs divider="›">
      <EmBreadcrumbsList>
        <EmBreadcrumbsItem text="Library">
          <EmBreadcrumbsLink href="#">Library</EmBreadcrumbsLink>
        </EmBreadcrumbsItem>

        <EmBreadcrumbsDivider />

        <EmBreadcrumbsItem text="Guides">
          <EmBreadcrumbsLink href="#">Guides</EmBreadcrumbsLink>
        </EmBreadcrumbsItem>

        <EmBreadcrumbsDivider />

        <EmBreadcrumbsItem text="Publishing">
          <EmBreadcrumbsPage>Publishing</EmBreadcrumbsPage>
        </EmBreadcrumbsItem>
      </EmBreadcrumbsList>
    </EmBreadcrumbs>

    <EmBreadcrumbs>
      <EmBreadcrumbsList>
        <EmBreadcrumbsItem text="Settings">
          <EmBreadcrumbsLink href="#">Settings</EmBreadcrumbsLink>
        </EmBreadcrumbsItem>

        <EmBreadcrumbsDivider>
          <EmIcon name="chevron-right" size="s" />
        </EmBreadcrumbsDivider>

        <EmBreadcrumbsItem text="Members">
          <EmBreadcrumbsLink href="#">Members</EmBreadcrumbsLink>
        </EmBreadcrumbsItem>

        <EmBreadcrumbsDivider>
          <EmIcon name="chevron-right" size="s" />
        </EmBreadcrumbsDivider>

        <EmBreadcrumbsItem text="Invitations">
          <EmBreadcrumbsPage>Invitations</EmBreadcrumbsPage>
        </EmBreadcrumbsItem>
      </EmBreadcrumbsList>
    </EmBreadcrumbs>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    width: 100%;
  }
</style>
