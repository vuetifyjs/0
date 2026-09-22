<script setup lang="ts">
  import {
    EmBreadcrumbs,
    EmBreadcrumbsDivider,
    EmBreadcrumbsEllipsis,
    EmBreadcrumbsItem,
    EmBreadcrumbsLink,
    EmBreadcrumbsList,
    EmBreadcrumbsPage,
    EmButton,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const width = shallowRef(560)
  const presets = [560, 380, 240]
  const crumbs = ['Dashboard', 'Workspaces', 'Emerald', 'Components', 'Breadcrumbs']
</script>

<template>
  <div class="emerald-docs-stack">
    <div class="emerald-docs-frame" :style="{ maxWidth: `${width}px` }">
      <EmBreadcrumbs v-slot="{ isOverflowing }">
        <EmBreadcrumbsList>
          <template v-for="(crumb, index) in crumbs" :key="crumb">
            <EmBreadcrumbsDivider v-if="index > 0" />

            <EmBreadcrumbsEllipsis v-if="index === 1" />

            <EmBreadcrumbsItem :text="crumb">
              <EmBreadcrumbsPage v-if="index === crumbs.length - 1">{{ crumb }}</EmBreadcrumbsPage>

              <EmBreadcrumbsLink v-else href="#">{{ crumb }}</EmBreadcrumbsLink>
            </EmBreadcrumbsItem>
          </template>
        </EmBreadcrumbsList>

        <p class="emerald-docs-caption">
          {{ isOverflowing ? 'Trail collapsed to fit the container' : 'Full trail visible' }}
        </p>
      </EmBreadcrumbs>
    </div>

    <div class="emerald-docs-row">
      <EmButton
        v-for="preset in presets"
        :key="preset"
        size="sm"
        :variant="preset === width ? 'primary' : 'secondary'"
        @click="width = preset"
      >
        {{ preset }}px
      </EmButton>
    </div>
  </div>
</template>

<style>
  .emerald-docs-stack {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    width: 100%;
  }

  .emerald-docs-frame {
    padding: var(--emerald-spacing-s, 12px);
    border: 1px dashed var(--emerald-neutral-400, #aeb6be);
    border-radius: var(--emerald-radius-s, 8px);
    transition: max-width 300ms ease;
  }

  .emerald-docs-caption {
    margin: var(--emerald-spacing-s, 12px) 0 0;
    font-size: var(--emerald-text-b3-size, 12px);
    color: var(--emerald-neutral-700, #6f7377);
  }

  .emerald-docs-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-s, 12px);
  }
</style>
