<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxPageNavigatorLink {
    label: string
    to: string
  }

  export interface HxPageNavigatorProps extends V0PaperProps {
    prev?: HxPageNavigatorLink | false
    next?: HxPageNavigatorLink | false
  }
</script>

<script setup lang="ts">
  // Utilities
  import { RouterLink } from 'vue-router'

  defineOptions({ name: 'HxPageNavigator' })

  const {
    prev,
    next,
    ...paperProps
  } = defineProps<HxPageNavigatorProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    aria-label="Page navigation"
    as="nav"
    class="helix-page-navigator"
  >
    <RouterLink
      v-if="prev"
      class="helix-page-navigator__link helix-page-navigator__link--prev"
      :to="prev.to"
    >
      <span class="helix-page-navigator__direction">
        <slot name="prev-icon">&#8592;</slot>
        Previous page
      </span>

      <span class="helix-page-navigator__label">{{ prev.label }}</span>
    </RouterLink>

    <span v-else class="helix-page-navigator__spacer" />

    <RouterLink
      v-if="next"
      class="helix-page-navigator__link helix-page-navigator__link--next"
      :to="next.to"
    >
      <span class="helix-page-navigator__direction">
        Next page
        <slot name="next-icon">&#8594;</slot>
      </span>

      <span class="helix-page-navigator__label">{{ next.label }}</span>
    </RouterLink>

    <span v-else class="helix-page-navigator__spacer" />
  </V0Paper>
</template>

<style scoped>
  .helix-page-navigator {
    display: flex;
    gap: 0.5rem;
  }

  .helix-page-navigator__link {
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    padding: 0.5rem;
    text-decoration: none;
    border: 1px solid var(--v0-divider);
    border-radius: 0.5rem;
    transition: border-color 0.15s, background-color 0.15s;
  }

  .helix-page-navigator__link:hover {
    border-color: var(--v0-primary);
    background-color: var(--v0-surface-tint);
  }

  .helix-page-navigator__link--next {
    text-align: end;
  }

  .helix-page-navigator__direction {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.75rem;
    opacity: 0.6;
  }

  .helix-page-navigator__label {
    font-weight: 500;
    text-transform: capitalize;
  }

  .helix-page-navigator__spacer {
    flex: 1 1 0;
  }
</style>
