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
  import type { Component } from 'vue'

  export interface HxBreadcrumbItem {
    label: string
    to?: string
    href?: string
  }

  export interface HxBreadcrumbsProps extends V0PaperProps {
    items?: HxBreadcrumbItem[]
    /** Component to render links with `to` (e.g. RouterLink) */
    linkComponent?: Component
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxBreadcrumbs' })

  const {
    items = [] as HxBreadcrumbItem[],
    linkComponent,
    ...paperProps
  } = defineProps<HxBreadcrumbsProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    aria-label="Breadcrumb"
    as="nav"
    class="helix-breadcrumbs"
  >
    <BreadcrumbsRoot>
      <BreadcrumbsList class="helix-breadcrumbs__list">
        <template v-for="(item, index) in items" :key="item.label">
          <BreadcrumbsDivider
            v-if="index > 0"
            class="helix-breadcrumbs__divider"
          >
            <svg class="helix-breadcrumbs__chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </BreadcrumbsDivider>

          <BreadcrumbsItem :text="item.label">
            <BreadcrumbsLink
              v-if="item.to && linkComponent"
              :as="linkComponent"
              class="helix-breadcrumbs__link"
              :to="item.to"
            >
              {{ item.label }}
            </BreadcrumbsLink>

            <BreadcrumbsLink
              v-else-if="item.to || item.href"
              class="helix-breadcrumbs__link"
              :href="item.href || item.to"
            >
              {{ item.label }}
            </BreadcrumbsLink>

            <BreadcrumbsPage
              v-else
              class="helix-breadcrumbs__page"
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
  .helix-breadcrumbs__list {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .helix-breadcrumbs__divider {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .helix-breadcrumbs__chevron {
    width: 0.875rem;
    height: 0.875rem;
  }
</style>
