<script setup lang="ts">
  import { ref } from 'vue'
  import SearchInput from './SearchInput.vue'
  import { useSearch } from './useSearch'

  const query = ref('')
  const { results, loading } = useSearch(query)
</script>

<template>
  <div class="flex flex-col gap-2 max-w-sm mx-auto">
    <SearchInput v-model:query="query" :count="results.length" :loading />

    <ul v-if="results.length > 0" class="flex flex-col rounded-lg border border-divider divide-y divide-divider">
      <li
        v-for="result in results"
        :key="result"
        class="px-3 py-2 text-sm text-on-surface"
      >
        {{ result }}
      </li>
    </ul>
  </div>
</template>
