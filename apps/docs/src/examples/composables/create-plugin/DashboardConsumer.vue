<script setup lang="ts">
  import { Switch } from '@vuetify/v0'
  import { toRef } from 'vue'
  import { useDashboard } from './plugin'

  const { app, locale, locales, group } = useDashboard()

  const tickets = toRef(() => group.values())
</script>

<template>
  <div v-if="group" class="space-y-5">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-semibold text-on-surface">{{ app }}</h3>
        <p class="text-xs text-on-surface-variant">{{ group.selectedIds.size }} / {{ group.size }} features enabled</p>
      </div>

      <div class="flex gap-1.5">
        <button
          class="px-2 py-1 text-xs rounded-md border border-divider text-on-surface-variant hover:text-on-surface hover:bg-surface-tint transition-colors"
          @click="group.selectAll()"
        >
          Enable all
        </button>

        <button
          class="px-2 py-1 text-xs rounded-md border border-divider text-on-surface-variant hover:text-on-surface hover:bg-surface-tint transition-colors"
          @click="group.unselectAll()"
        >
          Disable all
        </button>
      </div>
    </div>

    <!-- Locale selector -->
    <div>
      <label class="block text-xs font-medium text-on-surface-variant mb-1.5">Locale</label>

      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="loc in locales"
          :key="loc.code"
          class="px-2.5 py-1 text-xs rounded-md border transition-all"
          :class="locale === loc.code
            ? 'border-primary bg-primary/10 text-primary font-medium'
            : 'border-divider text-on-surface-variant hover:border-primary/50'"
          @click="locale = loc.code"
        >
          {{ loc.label }}
        </button>
      </div>
    </div>

    <!-- Feature toggles -->
    <div class="space-y-1">
      <button
        v-for="ticket in tickets"
        :key="ticket.id"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all"
        :class="ticket.isSelected.value
          ? 'border-primary/30 bg-primary/5'
          : 'border-divider hover:bg-surface-tint'"
        @click="group.toggle(ticket.id)"
      >
        <span
          class="flex-1 text-left text-sm"
          :class="ticket.isSelected.value ? 'text-on-surface font-medium' : 'text-on-surface-variant'"
        >
          {{ ticket.value }}
        </span>

        <Switch.Root as="span" class="inline-flex items-center" :model-value="ticket.isSelected.value">
          <Switch.Track
            class="relative inline-flex items-center w-8 h-4.5 rounded-full transition-colors bg-on-surface/20 data-[state=checked]:bg-primary"
          >
            <Switch.Thumb
              class="![visibility:visible] block size-3.5 rounded-full bg-white shadow-sm transition-transform translate-x-0.5 data-[state=checked]:translate-x-3.75"
            />
          </Switch.Track>
        </Switch.Root>
      </button>
    </div>

    <!-- Live preview -->
    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3">
      <p class="text-[10px] uppercase tracking-wider text-on-surface-variant/60 mb-2">Active features</p>

      <div class="flex flex-wrap gap-1.5">
        <template v-for="ticket in tickets" :key="ticket.id">
          <span
            v-if="ticket.isSelected.value"
            class="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium"
          >
            {{ ticket.value }}
          </span>
        </template>

        <span
          v-if="group.isNoneSelected.value"
          class="text-xs text-on-surface-variant italic h-6 flex items-center"
        >
          No features enabled
        </span>
      </div>
    </div>
  </div>
</template>
