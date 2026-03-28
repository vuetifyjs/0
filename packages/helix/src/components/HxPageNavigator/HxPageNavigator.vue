<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface HxPageNavigatorLink {
    label: string
    to: string
  }

  export interface HxPageNavigatorProps extends V0PaperProps {
    prev?: HxPageNavigatorLink
    next?: HxPageNavigatorLink
  }
</script>

<script setup lang="ts">
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
    <a
      v-if="prev"
      class="helix-page-navigator__link helix-page-navigator__link--prev"
      :href="prev.to"
    >
      <span class="helix-page-navigator__direction">Previous page</span>

      <span class="helix-page-navigator__label">{{ prev.label }}</span>
    </a>

    <span v-else class="helix-page-navigator__spacer" />

    <a
      v-if="next"
      class="helix-page-navigator__link helix-page-navigator__link--next"
      :href="next.to"
    >
      <span class="helix-page-navigator__direction">Next page</span>

      <span class="helix-page-navigator__label">{{ next.label }}</span>
    </a>

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
    text-decoration: none;
  }

  .helix-page-navigator__link--next {
    text-align: end;
  }

  .helix-page-navigator__spacer {
    flex: 1 1 0;
  }
</style>
