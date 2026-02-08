<script setup lang="ts">
  import { createBreadcrumbs } from '@vuetify/v0'

  const breadcrumbs = createBreadcrumbs({ visible: 4 })

  const pages = [
    { text: 'Home' },
    { text: 'Products' },
    { text: 'Electronics' },
    { text: 'Phones' },
    { text: 'Smartphones' },
  ]

  // Register initial path
  for (const page of pages) {
    breadcrumbs.register({ text: page.text })
  }

  function addCrumb () {
    const n = breadcrumbs.depth.value + 1
    breadcrumbs.register({ text: `Page ${n}` })
  }
</script>

<template>
  <div class="space-y-4">
    <!-- Render breadcrumb trail from tickets -->
    <nav class="flex items-center gap-2 text-sm">
      <template
        v-for="ticket in breadcrumbs.tickets.value"
        :key="ticket.type === 'crumb' ? ticket.value.id : 'ellipsis'"
      >
        <span
          v-if="ticket.type === 'ellipsis'"
          class="text-on-surface-variant"
        >
          {{ ticket.value }}
        </span>

        <template v-else>
          <span v-if="ticket.index > 0" class="text-on-surface-variant">/</span>
          <button
            class="text-primary hover:underline"
            @click="breadcrumbs.select(ticket.value.id)"
          >
            {{ ticket.value.text }}
          </button>
        </template>
      </template>
    </nav>

    <!-- Controls -->
    <div class="flex items-center gap-2">
      <button
        class="px-3 py-1.5 text-sm rounded border border-divider hover:bg-surface-tint disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="breadcrumbs.isRoot.value"
        @click="breadcrumbs.first()"
      >
        First
      </button>
      <button
        class="px-3 py-1.5 text-sm rounded bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        :disabled="breadcrumbs.isRoot.value"
        @click="breadcrumbs.prev()"
      >
        Prev
      </button>
      <button
        class="px-3 py-1.5 text-sm rounded bg-primary text-on-primary hover:bg-primary/90 transition-colors"
        @click="addCrumb()"
      >
        Add Crumb
      </button>
    </div>

    <!-- Status -->
    <p class="text-xs text-on-surface-variant">
      Depth: {{ breadcrumbs.depth.value }} &middot;
      Root: {{ breadcrumbs.isRoot.value }} &middot;
      Visible limit: 4
    </p>
  </div>
</template>
