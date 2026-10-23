<script setup lang="ts">
  import { QuButton, QuCard, QuSearchBar } from '@paper/quantum'
  import { shallowRef } from 'vue'

  interface Recipe {
    title: string
    time: string
    text: string
  }

  const recipes: Recipe[] = [
    { title: 'Lemon pasta', time: '20 minutes', text: 'Spaghetti, lemon zest, parmesan and black pepper.' },
    { title: 'Lemon tart', time: '1 hour 30 minutes', text: 'A short crust filled with a set lemon curd.' },
    { title: 'Lentil soup', time: '45 minutes', text: 'Red lentils, cumin and a squeeze of lemon to finish.' },
  ]

  const query = shallowRef('')
  const results = shallowRef<Recipe[]>([])

  function onSubmit (value: string) {
    const term = value.toLowerCase()

    results.value = recipes.filter(recipe => `${recipe.title} ${recipe.text}`.toLowerCase().includes(term))
  }
</script>

<template>
  <div class="quantum-docs-search">
    <QuSearchBar v-model="query" placeholder="Search recipes" @submit="onSubmit">
      <QuSearchBar.Item history value="Lemon" />

      <QuSearchBar.Item v-for="recipe in recipes" :key="recipe.title" :value="recipe.title" />
    </QuSearchBar>

    <div class="quantum-docs-search-results">
      <QuCard v-for="recipe in results" :key="recipe.title">
        <QuCard.Title>{{ recipe.title }}</QuCard.Title>

        <QuCard.Subtitle>{{ recipe.time }}</QuCard.Subtitle>

        <QuCard.Supporting>{{ recipe.text }}</QuCard.Supporting>

        <QuCard.Actions>
          <QuButton>Open</QuButton>
        </QuCard.Actions>
      </QuCard>
    </div>
  </div>
</template>

<style>
  /* The page behind the bar: the theme background, so the 2 dp sheet reads as raised. */
  .quantum-docs-search {
    display: flex;
    flex-direction: column;
    gap: var(--quantum-spacing-2, 16px);
    padding: var(--quantum-spacing-2, 16px);
    background: var(--quantum-background, #FAFAFA);
  }

  /* Results are cards, to match the inset look of the search box (search page). */
  .quantum-docs-search-results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
    gap: var(--quantum-spacing-1, 8px);
  }
</style>
