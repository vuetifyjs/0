<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import InboxList from './InboxList.vue'
  import { useInboxSelection } from './useInboxSelection'

  const { emails, selected, status, count, archive, remove, reset } = useInboxSelection()
</script>

<template>
  <div class="max-w-xl mx-auto flex flex-col gap-3">
    <InboxList
      v-model:selected="selected"
      :archive
      :count
      :emails
      :remove
    />

    <div class="flex items-center gap-3 text-sm text-on-surface-variant">
      <span v-if="status" class="text-success">{{ status }}</span>
      <span v-else>{{ count }} of {{ emails.length }} selected</span>

      <Button.Root
        class="ml-auto px-3 py-1 rounded-lg border border-divider text-on-surface"
        @click="reset"
      >
        Reset inbox
      </Button.Root>
    </div>
  </div>
</template>
