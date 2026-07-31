<script setup lang="ts">
  import { Button } from '@vuetify/v0'
  import ToastHost from './ToastHost.vue'
  import { useToasts } from './useToasts'

  const { files, notify, remove } = useToasts()
</script>

<template>
  <div class="relative flex flex-col gap-4 min-h-72 p-6 bg-background rounded-lg border border-divider overflow-hidden">
    <div class="flex flex-wrap gap-2">
      <Button.Root
        class="px-4 py-2 rounded-md text-sm font-medium bg-primary text-on-primary"
        @click="notify('success')"
      >
        Save changes
      </Button.Root>

      <Button.Root
        class="px-4 py-2 rounded-md text-sm font-medium border border-divider text-on-surface"
        @click="notify('error')"
      >
        Trigger error
      </Button.Root>
    </div>

    <ul class="flex flex-col gap-1">
      <li
        v-for="file in files"
        :key="file.id"
        class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-surface text-on-surface text-sm"
      >
        <span>{{ file.name }}</span>

        <Button.Root
          class="px-2 py-1 rounded-md text-xs text-error hover:underline underline-offset-2"
          @click="remove(file)"
        >
          Delete
        </Button.Root>
      </li>
    </ul>

    <p v-if="files.length === 0" class="text-sm text-on-surface-variant">
      All files deleted — use Undo on a toast to bring one back.
    </p>

    <ToastHost />
  </div>
</template>
