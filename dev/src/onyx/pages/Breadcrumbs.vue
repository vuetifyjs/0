<script setup lang="ts">
  // Types
  import type { OnCrumb } from '@paper/onyx'

  defineOptions({ name: 'OnyxBreadcrumbs' })

  const standard: OnCrumb[] = [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: 'Laptops' },
  ]

  const collapsed: OnCrumb[] = [
    { title: 'Home', href: '/' },
    { title: 'Products', href: '/products' },
    { title: 'Electronics', href: '/products/electronics' },
    { title: 'Computers', href: '/products/electronics/computers' },
    { title: 'Laptops', href: '/products/electronics/computers/laptops' },
    { title: 'Gaming Laptop' },
  ]

  const withDisabled: OnCrumb[] = [
    { title: 'Home', href: '/' },
    { title: 'Archived project', disabled: true, href: '/archived' },
    { title: 'Settings' },
  ]
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Collapse is width-driven, not count-driven — the trail measures its own available space
    and folds the middle into an ellipsis once it runs out of room.
  </p>

  <h2 class="onyx-breadcrumbs-page__heading mt-8">Standard</h2>

  <div class="onyx-exhibit mt-3">
    <p class="onyx-hallmark onyx-exhibit__caption">3 crumbs, no collapse needed</p>
    <OnBreadcrumbs :items="standard" />
  </div>

  <h2 class="onyx-breadcrumbs-page__heading mt-8">Collapsed middle</h2>

  <p style="color: var(--onyx-muted-foreground, #71717a); font-size: 13px; margin: 4px 0 12px;">
    Same 6-item trail, constrained to a 440px container so it has no choice but to collapse.
  </p>

  <div class="onyx-exhibit mt-3">
    <p class="onyx-hallmark onyx-exhibit__caption">Width-driven, not count-driven</p>

    <div style="max-width: 440px;">
      <OnBreadcrumbs :items="collapsed" />
    </div>
  </div>

  <h2 class="onyx-breadcrumbs-page__heading mt-8">Disabled crumb</h2>

  <div class="onyx-exhibit mt-3">
    <p class="onyx-hallmark onyx-exhibit__caption">Middle crumb disabled</p>
    <OnBreadcrumbs :items="withDisabled" />
  </div>
</template>

<!-- Unscoped: page-local heading, layout scaffolding only. -->
<style>
  .onyx-breadcrumbs-page__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin-bottom: 0;
  }
</style>
