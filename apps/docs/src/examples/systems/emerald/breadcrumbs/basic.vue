<script setup lang="ts">
  import {
    EmBreadcrumbs,
    EmBreadcrumbsDivider,
    EmBreadcrumbsItem,
    EmBreadcrumbsLink,
    EmBreadcrumbsList,
    EmBreadcrumbsPage,
  } from '@paper/emerald'
</script>

<template>
  <EmBreadcrumbs>
    <EmBreadcrumbsList>
      <EmBreadcrumbsItem text="Dashboard">
        <EmBreadcrumbsLink href="#">Dashboard</EmBreadcrumbsLink>
      </EmBreadcrumbsItem>

      <EmBreadcrumbsDivider />

      <EmBreadcrumbsItem text="Projects">
        <EmBreadcrumbsLink href="#">Projects</EmBreadcrumbsLink>
      </EmBreadcrumbsItem>

      <EmBreadcrumbsDivider />

      <EmBreadcrumbsItem text="Emerald">
        <EmBreadcrumbsPage>Emerald</EmBreadcrumbsPage>
      </EmBreadcrumbsItem>
    </EmBreadcrumbsList>
  </EmBreadcrumbs>
</template>
