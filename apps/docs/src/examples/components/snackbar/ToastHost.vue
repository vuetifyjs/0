<script setup lang="ts">
  import { Button, Snackbar } from '@vuetify/v0'
  import type { NotificationTicket } from '@vuetify/v0'

  const styles: Record<string, string> = {
    info: 'bg-surface text-on-surface border border-divider',
    success: 'bg-success text-on-success',
    warning: 'bg-warning text-on-warning',
    error: 'bg-error text-on-error',
  }

  function undoOf (item: NotificationTicket) {
    return item.data?.undo as (() => void) | undefined
  }

  function onUndo (item: NotificationTicket) {
    undoOf(item)?.()
    item.dismiss()
  }
</script>

<template>
  <Snackbar.Portal class="absolute bottom-4 right-4 w-72" :teleport="false">
    <Snackbar.Queue v-slot="{ items }" class="flex flex-col gap-2">
      <Snackbar.Root
        v-for="item in items"
        :id="item.id"
        :key="item.id"
        class="flex items-center gap-3 px-4 py-2.5 rounded-lg shadow-lg text-sm"
        :class="styles[item.severity ?? 'info']"
      >
        <Snackbar.Content class="flex-1">
          {{ item.subject }}
        </Snackbar.Content>

        <Button.Root
          v-if="undoOf(item)"
          class="shrink-0 px-2 py-1 rounded-md text-xs font-semibold underline-offset-2 hover:underline"
          @click="onUndo(item)"
        >
          Undo
        </Button.Root>

        <Snackbar.Close class="shrink-0 p-1 -mr-1 opacity-70 hover:opacity-100">
          <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24">
            <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor" />
          </svg>
        </Snackbar.Close>
      </Snackbar.Root>
    </Snackbar.Queue>
  </Snackbar.Portal>
</template>
