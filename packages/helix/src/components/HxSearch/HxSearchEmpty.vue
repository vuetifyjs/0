<script lang="ts">
  export interface HxSearchEmptyProps {
    /** The query that produced no results */
    query?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'HxSearchEmpty' })

  const { query } = defineProps<HxSearchEmptyProps>()
</script>

<template>
  <div class="helix-search__empty">
    <slot>
      <template v-if="query">No results for '{{ query }}'</template>
      <template v-else>Start typing to search</template>
    </slot>
  </div>
</template>

<style scoped>
  .helix-search__empty {
    padding: 2rem 1rem;
    text-align: center;
    opacity: 0.6;
  }
</style>
