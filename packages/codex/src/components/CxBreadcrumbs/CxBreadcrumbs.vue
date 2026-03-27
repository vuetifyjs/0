<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Framework
  import {
    BreadcrumbsDivider,
    BreadcrumbsItem,
    BreadcrumbsLink,
    BreadcrumbsList,
    BreadcrumbsPage,
    BreadcrumbsRoot,
  } from '@vuetify/v0'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxBreadcrumbItem {
    label: string
    to?: string
    href?: string
  }

  export interface CxBreadcrumbsProps extends V0PaperProps {
    items?: CxBreadcrumbItem[]
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxBreadcrumbs' })

  const {
    items = [] as CxBreadcrumbItem[],
    ...paperProps
  } = defineProps<CxBreadcrumbsProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    aria-label="Breadcrumb"
    as="nav"
    class="codex-breadcrumbs"
  >
    <BreadcrumbsRoot>
      <BreadcrumbsList class="codex-breadcrumbs__list">
        <template v-for="(item, index) in items" :key="item.label">
          <BreadcrumbsDivider
            v-if="index > 0"
            class="codex-breadcrumbs__divider"
          >
            <svg class="codex-breadcrumbs__chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </BreadcrumbsDivider>

          <BreadcrumbsItem :text="item.label">
            <BreadcrumbsLink
              v-if="item.to || item.href"
              class="codex-breadcrumbs__link"
              :href="item.href"
              :to="item.to"
            >
              {{ item.label }}
            </BreadcrumbsLink>

            <BreadcrumbsPage
              v-else
              class="codex-breadcrumbs__page"
            >
              {{ item.label }}
            </BreadcrumbsPage>
          </BreadcrumbsItem>
        </template>
      </BreadcrumbsList>
    </BreadcrumbsRoot>
  </V0Paper>
</template>

<style scoped>
  .codex-breadcrumbs__list {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .codex-breadcrumbs__divider {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .codex-breadcrumbs__chevron {
    width: 0.875rem;
    height: 0.875rem;
  }
</style>
