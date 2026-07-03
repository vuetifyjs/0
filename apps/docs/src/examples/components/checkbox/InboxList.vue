<script setup lang="ts">
  import { Button, Checkbox } from '@vuetify/v0'
  import type { Email } from './useInboxSelection'

  const {
    emails,
    count,
    archive,
    remove,
  } = defineProps<{
    emails: Email[]
    count: number
    archive: () => void
    remove: () => void
  }>()

  const selected = defineModel<string[]>('selected', { default: () => [] })

  const box = 'size-5 border rounded inline-flex items-center justify-center border-divider data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary'
</script>

<template>
  <Checkbox.Group
    v-model="selected"
    class="rounded-lg border border-divider bg-surface text-on-surface overflow-hidden"
  >
    <div class="flex items-center gap-3 px-4 py-2 border-b border-divider">
      <label class="inline-flex items-center gap-2 text-sm font-medium">
        <Checkbox.SelectAll :class="box">
          <Checkbox.Indicator v-slot="{ isMixed }" class="text-on-primary text-sm leading-none">
            <span v-if="isMixed">−</span>
            <span v-else>✓</span>
          </Checkbox.Indicator>
        </Checkbox.SelectAll>

        <span v-if="count">{{ count }} selected</span>
        <span v-else class="text-on-surface-variant">Select all</span>
      </label>

      <div v-if="count" class="ml-auto flex gap-2">
        <Button.Root
          class="px-2.5 py-1 rounded-md border border-divider text-xs font-medium text-on-surface hover:bg-surface-variant"
          @click="archive"
        >
          Archive
        </Button.Root>

        <Button.Root
          class="px-2.5 py-1 rounded-md border border-divider text-xs font-medium text-error hover:bg-surface-variant"
          @click="remove"
        >
          Delete
        </Button.Root>
      </div>
    </div>

    <ul class="divide-y divide-divider">
      <li v-for="email in emails" :key="email.id">
        <label class="flex items-center gap-3 px-4 py-3 cursor-pointer has-[[data-state=checked]]:bg-surface-variant/60">
          <Checkbox.Root :class="box" :value="email.id">
            <Checkbox.Indicator class="text-on-primary text-sm leading-none">✓</Checkbox.Indicator>
          </Checkbox.Root>

          <span class="w-20 shrink-0 text-sm font-medium" :class="email.unread ? 'text-on-surface' : 'text-on-surface-variant'">
            {{ email.sender }}
          </span>

          <span class="flex-1 truncate text-sm" :class="email.unread ? 'font-medium text-on-surface' : 'text-on-surface-variant'">
            {{ email.subject }}
          </span>

          <span v-if="email.unread" aria-label="Unread" class="size-2 shrink-0 rounded-full bg-primary" />
        </label>
      </li>

      <li v-if="emails.length === 0" class="px-4 py-8 text-center text-sm text-on-surface-variant">
        Inbox zero. Nothing left to triage.
      </li>
    </ul>
  </Checkbox.Group>
</template>
