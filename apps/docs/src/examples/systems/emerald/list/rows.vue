<script setup lang="ts">
  import {
    EmButton,
    EmIcon,
    EmList,
    EmListItem,
    EmListItemContent,
    EmListItemMeta,
    EmListItemSubtitle,
    EmListItemTitle,
  } from '@paper/emerald'

  import { ref } from 'vue'

  const starred = ref<string[]>(['v0'])

  const repos = [
    { id: 'v0', name: 'vuetifyjs/0', role: 'Headless composables' },
    { id: 'emerald', name: 'vuetifyjs/emerald', role: 'Design system' },
    { id: 'mcp', name: 'vuetifyjs/mcp', role: 'AI integration' },
  ] as const

  function onStar (id: string) {
    starred.value = starred.value.includes(id)
      ? starred.value.filter(entry => entry !== id)
      : [...starred.value, id]
  }
</script>

<template>
  <div class="emerald-docs-repos">
    <EmList>
      <EmListItem v-for="repo in repos" :key="repo.id" as="div" :value="repo.id">
        <EmListItemContent>
          <EmListItemTitle>{{ repo.name }}</EmListItemTitle>

          <EmListItemSubtitle>{{ repo.role }}</EmListItemSubtitle>
        </EmListItemContent>

        <EmListItemMeta>{{ starred.includes(repo.id) ? 'Starred' : '' }}</EmListItemMeta>

        <EmButton
          :aria-label="`${starred.includes(repo.id) ? 'Unstar' : 'Star'} ${repo.name}`"
          :aria-pressed="starred.includes(repo.id)"
          size="sm"
          variant="tertiary"
          @click="onStar(repo.id)"
        >
          <EmIcon name="star" size="s" />
        </EmButton>
      </EmListItem>
    </EmList>
  </div>
</template>

<style>
  .emerald-docs-repos {
    max-width: 420px;
  }
</style>
