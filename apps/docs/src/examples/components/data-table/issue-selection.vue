<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import IssueTable from './IssueTable.vue'
  import { useIssues } from './useIssues'

  const { issues, status, archive, reset } = useIssues()
</script>

<template>
  <div class="flex flex-col gap-3">
    <IssueTable
      :archive
      :issues
    />

    <div class="flex items-center gap-3 text-sm text-on-surface-variant">
      <span v-if="status" class="text-success">{{ status }}</span>
      <span v-else>{{ issues.length }} open in the list</span>

      <Button.Root
        class="ml-auto px-3 py-1 rounded-lg border border-divider text-on-surface"
        @click="reset"
      >
        Reset issues
      </Button.Root>
    </div>
  </div>
</template>
