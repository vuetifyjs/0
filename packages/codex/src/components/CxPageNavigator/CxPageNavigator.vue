<script lang="ts">
  import { V0Paper } from '@vuetify/paper'

  // Types
  import type { V0PaperProps } from '@vuetify/paper'

  export interface CxPageNavigatorLink {
    label: string
    to: string
  }

  export interface CxPageNavigatorProps extends V0PaperProps {
    prev?: CxPageNavigatorLink
    next?: CxPageNavigatorLink
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxPageNavigator' })

  const {
    prev,
    next,
    ...paperProps
  } = defineProps<CxPageNavigatorProps>()
</script>

<template>
  <V0Paper
    v-bind="paperProps"
    aria-label="Page navigation"
    as="nav"
    class="codex-page-navigator"
  >
    <a
      v-if="prev"
      class="codex-page-navigator__link codex-page-navigator__link--prev"
      :href="prev.to"
    >
      <span class="codex-page-navigator__direction">Previous page</span>

      <span class="codex-page-navigator__label">{{ prev.label }}</span>
    </a>

    <span v-else class="codex-page-navigator__spacer" />

    <a
      v-if="next"
      class="codex-page-navigator__link codex-page-navigator__link--next"
      :href="next.to"
    >
      <span class="codex-page-navigator__direction">Next page</span>

      <span class="codex-page-navigator__label">{{ next.label }}</span>
    </a>

    <span v-else class="codex-page-navigator__spacer" />
  </V0Paper>
</template>

<style scoped>
  .codex-page-navigator {
    display: flex;
    gap: 0.5rem;
  }

  .codex-page-navigator__link {
    display: flex;
    flex-direction: column;
    flex: 1 1 0;
    text-decoration: none;
  }

  .codex-page-navigator__link--next {
    text-align: end;
  }

  .codex-page-navigator__spacer {
    flex: 1 1 0;
  }
</style>
