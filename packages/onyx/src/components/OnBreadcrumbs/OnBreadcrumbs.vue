<script lang="ts">
  // Framework
  import { Breadcrumbs } from '@vuetify/v0'

  export interface OnCrumb {
    disabled?: boolean
    href?: string
    title: string
  }

  export interface OnBreadcrumbsProps {
    items: OnCrumb[]
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OnBreadcrumbs' })

  const { items } = defineProps<OnBreadcrumbsProps>()
</script>

<template>
  <Breadcrumbs.Root>
    <Breadcrumbs.List class="onyx-breadcrumbs__list">
      <template v-for="(crumb, index) in items" :key="crumb.title">
        <Breadcrumbs.Item :text="crumb.title">
          <Breadcrumbs.Page v-if="index === items.length - 1" class="onyx-breadcrumbs__page">
            {{ crumb.title }}
          </Breadcrumbs.Page>

          <Breadcrumbs.Link
            v-else
            :aria-disabled="crumb.disabled || undefined"
            class="onyx-breadcrumbs__link"
            :href="crumb.disabled ? undefined : crumb.href"
          >
            {{ crumb.title }}
          </Breadcrumbs.Link>
        </Breadcrumbs.Item>

        <!-- First item's divider is always visible (createOverflow's poolStart
             keeps content-ticket indices 0–1, i.e. the first item + this
             divider); the ellipsis sits right after it, matching the v0
             barrel's own canonical collapse layout. -->
        <template v-if="index === 0 && items.length > 1">
          <Breadcrumbs.Divider class="onyx-breadcrumbs__divider">
            <svg
              aria-hidden="true"
              fill="none"
              height="14"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              viewBox="0 0 24 24"
              width="14"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </Breadcrumbs.Divider>

          <Breadcrumbs.Ellipsis class="onyx-breadcrumbs__ellipsis">
            <!-- Nesting Activator inside Ellipsis replaces Ellipsis's own "…"
                 fallback slot content, so the Activator supplies its own. -->
            <Breadcrumbs.Activator class="onyx-breadcrumbs__activator">
              …
            </Breadcrumbs.Activator>
          </Breadcrumbs.Ellipsis>
        </template>

        <Breadcrumbs.Divider v-else-if="index < items.length - 1" class="onyx-breadcrumbs__divider">
          <svg
            aria-hidden="true"
            fill="none"
            height="14"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="14"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Breadcrumbs.Divider>
      </template>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</template>

<!-- Unscoped: Breadcrumbs.List/Divider/Ellipsis/Activator are compound children
     from v0's own file scope; scoped data-v never reaches their roots (mirrors
     the OnButton/Button.Root case). -->
<style>
  .onyx-breadcrumbs__list {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: var(--onyx-spacing-xs, 8px);
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .onyx-breadcrumbs__link {
    color: var(--onyx-muted-foreground, #bab3ab);
    font-size: var(--onyx-text-sm-size, 13.5px);
    line-height: var(--onyx-text-sm-height, 22px);
    text-decoration: none;
    transition: color var(--onyx-motion-fast, 120ms) var(--onyx-motion-lamp, cubic-bezier(0.4, 0, 0.2, 1));
  }

  .onyx-breadcrumbs__link:hover {
    color: var(--onyx-foreground, #f0ece5);
  }

  .onyx-breadcrumbs__link:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }

  /* Explicit disabled color, never opacity (graft — see OnButton's [data-disabled] comment). */
  .onyx-breadcrumbs__link[aria-disabled] {
    color: color-mix(in oklab, var(--onyx-muted-foreground, #bab3ab) 55%, var(--onyx-background, #0d0a08));
    cursor: not-allowed;
    pointer-events: none;
  }

  .onyx-breadcrumbs__page {
    color: var(--onyx-foreground, #f0ece5);
    font-size: var(--onyx-text-sm-size, 13.5px);
    font-weight: 550;
    line-height: var(--onyx-text-sm-height, 22px);
  }

  .onyx-breadcrumbs__divider {
    align-items: center;
    color: var(--onyx-muted-foreground, #bab3ab);
    display: inline-flex;
  }

  .onyx-breadcrumbs__ellipsis {
    align-items: center;
    color: var(--onyx-muted-foreground, #bab3ab);
    display: inline-flex;
  }

  .onyx-breadcrumbs__activator {
    align-items: center;
    background: transparent;
    border: none;
    border-radius: var(--onyx-radius-sm, 0.25rem);
    color: inherit;
    cursor: pointer;
    display: inline-flex;
    height: 20px;
    justify-content: center;
    width: 20px;
  }

  .onyx-breadcrumbs__activator:hover {
    background: color-mix(in oklab, var(--onyx-accent, #2f2925) 70%, transparent);
    color: var(--onyx-foreground, #f0ece5);
  }

  .onyx-breadcrumbs__activator:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--onyx-ring, #dac593) 85%, transparent);
    outline-offset: 2px;
  }
</style>
