<script setup lang="ts">
  import { AlertDialog } from '@vuetify/v0'
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
            This action cannot be undone.
          </AlertDialog.Description>
        </div>

        <div class="p-4 space-y-4">
          <p class="text-sm text-on-surface leading-relaxed">
            This will permanently delete the item and all associated data.
            You will not be able to recover it.
          </p>
        </div>

        <div class="flex gap-3 justify-end p-4 pt-0">
          <AlertDialog.Cancel class="px-4 py-2 text-sm font-medium rounded-md border border-divider hover:bg-surface-tint">
            Cancel
          </AlertDialog.Cancel>

          <AlertDialog.Action class="px-4 py-2 text-sm font-medium rounded-md bg-error text-on-error">
            Delete
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Root>
  </div>
</template>
