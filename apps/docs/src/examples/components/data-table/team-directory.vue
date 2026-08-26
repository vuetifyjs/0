<script setup lang="ts">
  import TeamTable from './TeamTable.vue'
  import { useTeam } from './useTeam'

  const { query, members } = useTeam()
</script>

<template>
  <div class="flex flex-col gap-2">
    <p class="text-sm text-on-surface-variant">
      {{ members.length }} people. Search filters the registry; sort reorders what you see.
    </p>

    <TeamTable
      v-model:search="query"
      :members
    />
  </div>
</template>
