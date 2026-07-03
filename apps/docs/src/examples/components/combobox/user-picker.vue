<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import UserPicker from './UserPicker.vue'
  import { useUserSearch } from './useUserSearch'

  const { results, assignees, loading, onSearch, reset } = useUserSearch()
</script>

<template>
  <div class="flex flex-col gap-4 max-w-sm mx-auto">
    <UserPicker
      v-model:assignees="assignees"
      :loading
      :results
      @search="onSearch"
    />

    <div class="flex items-center justify-between text-sm text-on-surface-variant">
      <span v-if="assignees.length > 0">
        Assigned to {{ assignees.length }} {{ assignees.length === 1 ? 'person' : 'people' }}
      </span>

      <span v-else>No one assigned yet</span>

      <Button.Root
        v-if="assignees.length > 0"
        class="px-3 py-1 rounded-lg border border-divider text-sm"
        @click="reset"
      >
        Clear
      </Button.Root>
    </div>
  </div>
</template>
