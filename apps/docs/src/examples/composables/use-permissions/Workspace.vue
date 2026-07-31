<script setup lang="ts">
  import { usePermissions } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import { actions, NAMESPACE } from './context'
  import type { Role } from './context'

  const { role } = defineProps<{ role: Role }>()

  const permissions = usePermissions(NAMESPACE)

  const owner = shallowRef(true)

  const tones: Record<string, string> = {
    neutral: 'border-divider text-on-surface hover:bg-surface-variant',
    primary: 'border-primary bg-primary text-on-primary hover:opacity-90',
    danger: 'border-error text-error hover:bg-error/10',
  }

  function allowed (action: string) {
    return permissions.can(role, action, 'documents', { isOwner: owner.value })
  }
</script>

<template>
  <section class="rounded-xl border border-divider bg-surface p-4 space-y-4">
    <div class="flex items-center justify-between gap-3">
      <div>
        <h3 class="text-sm font-semibold text-on-surface">Quarterly report</h3>
        <p class="text-xs text-on-surface-variant">Draft document actions</p>
      </div>

      <button
        :aria-pressed="owner"
        class="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors"
        :class="owner ? 'border-primary text-primary' : 'border-divider text-on-surface-variant'"
        type="button"
        @click="owner = !owner"
      >
        <span
          class="flex h-4 w-7 items-center rounded-full px-0.5 transition-colors"
          :class="owner ? 'justify-end bg-primary' : 'justify-start bg-surface-variant'"
        >
          <span class="size-3 rounded-full bg-surface shadow-sm" />
        </span>
        I own this document
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="action in actions"
        :key="action.id"
        class="rounded-lg border px-3 py-1.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40"
        :class="tones[action.tone]"
        :disabled="!allowed(action.id)"
        type="button"
      >
        {{ action.label }}
      </button>
    </div>

    <p class="text-xs text-on-surface-variant">
      Publish is gated by ownership for editors. Toggle the owner switch to watch the
      context-aware condition re-evaluate without changing the role definition.
    </p>
  </section>
</template>
