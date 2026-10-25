<script setup lang="ts">
  import { Md1List, Md1TextField } from '@paper/md1'
  import { shallowRef, toRef } from 'vue'

  const people = ['Ali Connors', 'Alex Scott', 'Sandra Adams', 'Trevor Hansen', 'Britta Holt']

  const query = shallowRef('a')

  // One letter matches nearly everyone, so the search asks for a second before it filters.
  const error = toRef(() => query.value.trim().length === 1 ? 'Type at least 2 letters' : '')

  const results = toRef(() => error.value || !query.value.trim()
    ? people
    : people.filter(person => person.toLowerCase().includes(query.value.trim().toLowerCase())))
</script>

<template>
  <div class="md1-docs-screen md1-docs-errors-list">
    <div class="md1-docs-errors-list-bar">
      <Md1TextField
        v-model="query"
        aria-label="Search people"
        clearable
        :error-messages="error || undefined"
        full-width
        icon="search"
      />
    </div>

    <Md1List aria-label="People" class="md1-docs-errors-list-results" :data-dimmed="error ? true : undefined">
      <Md1List.Item v-for="person in results" :key="person">
        <Md1List.Content>
          <Md1List.Primary>{{ person }}</Md1List.Primary>
        </Md1List.Content>
      </Md1List.Item>
    </Md1List>
  </div>
</template>

<style>
  /* A search screen: the single-line field fills the top sheet, and its error text sits in the field's own row. */
  .md1-docs-screen.md1-docs-errors-list {
    display: flex;
    flex-direction: column;
    max-width: 360px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-errors-list-bar {
    position: relative;
    z-index: 1;
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2);
  }

  .md1-docs-errors-list-results {
    flex: 1 1 auto;
    overflow-y: auto;
    transition: opacity var(--md1-duration-standard, 300ms) var(--md1-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* While the query is in error, the list behind it is not the answer: it recedes. */
  .md1-docs-errors-list-results[data-dimmed] {
    opacity: 0.38;
  }
</style>
