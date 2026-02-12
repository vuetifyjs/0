<script setup lang="ts">
  import { computed } from 'vue'
  import { createBreadcrumbs } from '@vuetify/v0'

  const breadcrumbs = createBreadcrumbs()

  const path = [
    { text: 'Home' },
    { text: 'Documents' },
    { text: 'Projects' },
    { text: 'Vuetify' },
    { text: 'Components' },
    { text: 'Breadcrumbs' },
  ]

  breadcrumbs.onboard(path)

  const items = computed(() => breadcrumbs.values())

  function reset () {
    breadcrumbs.clear()
    breadcrumbs.onboard(path)
  }
</script>

<template>
  <div class="space-y-4">
    <nav class="flex items-center gap-1.5 text-sm">
      <template
        v-for="(ticket, i) in items"
        :key="ticket.id"
      >
        <span v-if="i > 0" class="text-on-surface-variant">/</span>

        <button
          class="text-primary hover:underline cursor-pointer"
          @click="breadcrumbs.select(ticket.id)"
        >
          {{ ticket.text }}
        </button>
      </template>
    </nav>

    <div class="flex items-center gap-3 text-xs text-on-surface-variant">
      <span>
        Depth: {{ breadcrumbs.depth.value }} &middot;
        At root: {{ breadcrumbs.isRoot.value }}
      </span>

      <button
        class="text-primary hover:underline cursor-pointer"
        @click="reset"
      >
        Reset
      </button>
    </div>
  </div>
</template>
