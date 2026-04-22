<script setup lang="ts">
  import { AlertDialog } from '@vuetify/v0'
  import type { AlertDialogActionEvent } from '@vuetify/v0'

  function onDelete (e: AlertDialogActionEvent) {
    e.wait()

    // Simulate async operation
    setTimeout(() => {
      e.close()
    }, 2000)
  }
</script>

<template>
  <div class="flex justify-center">
    <AlertDialog.Root>
      <AlertDialog.Activator class="px-4 py-2 bg-error text-on-error rounded-md text-sm font-medium">
        Delete Item
      </AlertDialog.Activator>

      <AlertDialog.Content class="m-auto rounded-xl bg-surface border border-divider max-w-md w-full">
        <div class="px-4 py-2 border-b border-divider">
          <AlertDialog.Title as="h3" class="text-lg font-semibold text-on-surface">
            Are you sure?
          </AlertDialog.Title>

          <AlertDialog.Description class="text-sm text-on-surface-variant">
            This will permanently delete the item.
          </AlertDialog.Description>
        </div>

        <div class="flex gap-3 justify-end p-4">
          <AlertDialog.Cancel class="px-4 py-2 text-sm font-medium rounded-md border border-divider hover:bg-surface-tint">
            Cancel
          </AlertDialog.Cancel>

          <AlertDialog.Action
            v-slot="{ isPending }"
            class="px-4 py-2 text-sm font-medium rounded-md bg-error text-on-error disabled:opacity-50"
            @action="onDelete"
          >
            {{ isPending ? 'Deleting...' : 'Delete' }}
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
</template>
