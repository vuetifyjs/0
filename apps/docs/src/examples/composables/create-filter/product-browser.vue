<script setup lang="ts">
  import ProductBrowser from './ProductBrowser.vue'
  import { useProductFilter } from './useProductFilter'

  const { query, mode, categories, results, total, allCategories, clear } = useProductFilter()
</script>

<template>
  <ProductBrowser
    v-model:categories="categories"
    v-model:mode="mode"
    v-model:query="query"
    :all-categories
    :clear
    :results
    :total
  />
</template>
