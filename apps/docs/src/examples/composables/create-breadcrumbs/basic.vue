<script setup lang="ts">
  import { createBreadcrumbs } from '@vuetify/v0'

  const breadcrumbs = createBreadcrumbs({ visible: 4 })

  breadcrumbs.onboard([
    { text: 'Home' },
    { text: 'Documents' },
    { text: 'Projects' },
    { text: 'Vuetify' },
    { text: 'Components' },
    { text: 'Breadcrumbs' },
  ])
</script>

<template>
  <div class="space-y-4">
    <nav class="flex items-center gap-1.5 text-sm">
      <template
        v-for="ticket in breadcrumbs.tickets.value"
        :key="ticket.type === 'crumb' ? ticket.value.id : 'ellipsis'"
      >
        <span
          v-if="ticket.type === 'ellipsis'"
          class="text-on-surface-variant px-1"
        >
          {{ ticket.value }}
        </span>

        <template v-else>
          <span v-if="ticket.index > 0" class="text-on-surface-variant">/</span>

          <button
            class="text-primary hover:underline cursor-pointer"
            @click="breadcrumbs.select(ticket.value.id)"
          >
            {{ ticket.value.text }}
          </button>
        </template>
      </template>
    </nav>

    <div class="text-xs text-on-surface-variant">
      Depth: {{ breadcrumbs.depth.value }} &middot;
      At root: {{ breadcrumbs.isRoot.value }}
    </div>
  </div>
</template>
