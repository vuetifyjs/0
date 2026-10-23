<script setup lang="ts">
  import { Md1Button, Md1Card, Md1SearchBar } from '@paper/md1'
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
  <div class="md1-docs-search">
    <Md1SearchBar v-model="query" placeholder="Search recipes" @submit="onSubmit">
      <Md1SearchBar.Item history value="Lemon" />

      <Md1SearchBar.Item v-for="recipe in recipes" :key="recipe.title" :value="recipe.title" />
    </Md1SearchBar>

    <div class="md1-docs-search-results">
      <Md1Card v-for="recipe in results" :key="recipe.title">
        <Md1Card.Title>{{ recipe.title }}</Md1Card.Title>

        <Md1Card.Subtitle>{{ recipe.time }}</Md1Card.Subtitle>

        <Md1Card.Supporting>{{ recipe.text }}</Md1Card.Supporting>

        <Md1Card.Actions>
          <Md1Button>Open</Md1Button>
        </Md1Card.Actions>
      </Md1Card>
    </div>
  </div>
</template>

<style>
  /* The page behind the bar: the theme background, so the 2 dp sheet reads as raised. */
  .md1-docs-search {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px);
    background: var(--md1-background, #FAFAFA);
  }

  /* Results are cards, to match the inset look of the search box (search page). */
  .md1-docs-search-results {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));
    gap: var(--md1-spacing-1, 8px);
  }
</style>
