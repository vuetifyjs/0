<script lang="ts">
  export interface CxSearchEmptyProps {
    /** The query that produced no results */
    query?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CxSearchEmpty' })

  const { query } = defineProps<CxSearchEmptyProps>()
</script>

<template>
  <div class="codex-search__empty">
    <slot>
      <template v-if="query">No results for '{{ query }}'</template>
      <template v-else>Start typing to search</template>
    </slot>
  </div>
</template>

<style scoped>
  .codex-search__empty {
    padding: 2rem 1rem;
    text-align: center;
    opacity: 0.6;
  }
</style>
