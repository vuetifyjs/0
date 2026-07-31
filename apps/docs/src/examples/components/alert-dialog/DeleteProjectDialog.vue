<script setup lang="ts">
  import { AlertDialog } from '@vuetify/v0'
  import type { AlertDialogActionEvent } from '@vuetify/v0'
  import type { Project } from './useDeleteProject'

  const { project, remove } = defineProps<{
    project: Project
    remove: (id: number) => Promise<void>
  }>()

  async function onAction (e: AlertDialogActionEvent) {
    e.wait()
    await remove(project.id)
    e.close()
  }
</script>

<template>
  <AlertDialog.Root v-slot="{ isPending }">
    <AlertDialog.Activator class="px-3 py-1.5 text-sm font-medium rounded-md border border-divider text-error hover:bg-error/10">
      Delete
    </AlertDialog.Activator>

    <AlertDialog.Content class="m-auto rounded-xl bg-surface border border-divider max-w-md w-full">
      <div class="px-4 py-3 border-b border-divider">
        <AlertDialog.Title as="h3" class="text-lg font-semibold text-on-surface">
          Delete {{ project.name }}?
        </AlertDialog.Title>

        <AlertDialog.Description class="text-sm text-on-surface-variant">
          This permanently removes the {{ project.environment }} project and every deployment attached to it. This action cannot be undone.
        </AlertDialog.Description>
      </div>

      <div class="flex gap-3 justify-end p-4">
        <AlertDialog.Cancel
          class="px-4 py-2 text-sm font-medium rounded-md border border-divider hover:bg-surface-tint data-[disabled]:opacity-60"
          :disabled="isPending"
        >
          Cancel
        </AlertDialog.Cancel>

        <AlertDialog.Action
          class="px-4 py-2 text-sm font-medium rounded-md bg-error text-on-error data-[disabled]:opacity-60 data-[disabled]:cursor-progress"
          :disabled="isPending"
          @action="onAction"
        >
          {{ isPending ? 'Deleting...' : 'Delete project' }}
        </AlertDialog.Action>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Root>
</template>
