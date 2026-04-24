<script setup lang="ts">
  import { createSelection } from '@vuetify/v0'
  import { computed } from 'vue'

  const files = [
    { id: 'readme', name: 'README.md', icon: '📄', size: '2.4 KB' },
    { id: 'package', name: 'package.json', icon: '📦', size: '1.1 KB' },
    { id: 'src', name: 'src/', icon: '📁', size: '—' },
    { id: 'index', name: 'index.ts', icon: '📜', size: '340 B' },
    { id: 'license', name: 'LICENSE', icon: '📄', size: '1.0 KB', disabled: true },
    { id: 'tests', name: 'tests/', icon: '📁', size: '—' },
    { id: 'config', name: 'tsconfig.json', icon: '⚙️', size: '520 B' },
    { id: 'ci', name: '.github/', icon: '📂', size: '—' },
  ]

  const selection = createSelection({ multiple: true })
  const tickets = selection.onboard(files.map(f => ({
    id: f.id,
    value: f,
    disabled: f.disabled,
  })))

  const totalSize = computed(() => {
    const sizes = Array.from(selection.selectedValues.value)
      .map((v: any) => v.size)
      .filter((s: string) => s !== '—')
    return sizes.length > 0 ? sizes.join(' + ') : 'nothing'
  })
</script>

<template>
  <div class="space-y-4">
    <!-- Toolbar -->
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-on-surface">
        {{ selection.selectedIds.size }} selected
      </span>

      <button
        class="text-xs px-2 py-1 rounded border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors disabled:opacity-40"
        :disabled="selection.selectedIds.size === 0"
        @click="selection.reset()"
      >
        Clear
      </button>
    </div>

    <!-- File list -->
    <div class="border border-divider rounded-lg overflow-hidden divide-y divide-divider">
      <button
        v-for="ticket in tickets"
        :key="ticket.id"
        class="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors"
        :class="[
          ticket.isSelected.value
            ? 'bg-primary/10'
            : 'hover:bg-surface-variant',
          ticket.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
        ]"
        :disabled="!!ticket.disabled"
        @click="!ticket.disabled && ticket.toggle()"
      >
        <!-- Checkbox -->
        <div
          class="size-4 rounded border flex items-center justify-center transition-colors shrink-0"
          :class="ticket.isSelected.value
            ? 'bg-primary border-primary'
            : 'border-divider'"
        >
          <span
            v-if="ticket.isSelected.value"
            class="text-on-primary text-xs leading-none"
          >✓</span>
        </div>

        <!-- Icon -->
        <span class="shrink-0 text-base leading-none">{{ ticket.value.icon }}</span>

        <!-- Name -->
        <span
          class="flex-1 text-sm"
          :class="ticket.isSelected.value ? 'text-primary font-medium' : 'text-on-surface'"
        >
          {{ ticket.value.name }}
        </span>

        <!-- Size -->
        <span class="text-xs text-on-surface-variant">{{ ticket.value.size }}</span>
      </button>
    </div>

    <!-- Status -->
    <p class="text-xs text-on-surface-variant text-center">
      Selected: {{ totalSize }}
      <span v-if="selection.selectedIds.size > 0">
        &middot;
        <button class="text-primary hover:underline" @click="selection.reset()">
          Deselect all
        </button>
      </span>
    </p>
  </div>
</template>
