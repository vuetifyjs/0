<script setup lang="ts">
  import { toRef, toValue } from 'vue'
  import { useColors } from './model'

  const model = useColors()

  const tickets = toRef(() => model.values())
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Color swatches -->
    <div class="flex justify-center gap-3">
      <button
        v-for="ticket in tickets"
        :key="ticket.id"
        class="size-12 rounded-full border-3 transition-all"
        :class="[
          toValue(ticket.disabled)
            ? 'opacity-30 cursor-not-allowed'
            : 'cursor-pointer hover:scale-110',
          ticket.isSelected.value
            ? 'border-on-surface shadow-lg scale-110'
            : 'border-transparent',
        ]"
        :disabled="toValue(ticket.disabled)"
        :style="{ backgroundColor: String(ticket.value) }"
        @click="model.toggle(ticket.id)"
      />
    </div>

    <!-- Selected state -->
    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3 space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">Selected</span>
        <span class="text-xs text-on-surface-variant/40">
          ({{ model.selectedIds.size }} / {{ model.size }})
        </span>
      </div>

      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="item of model.selectedValues.value"
          :key="String(item)"
          class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-tint text-xs font-medium text-on-surface"
        >
          <span
            class="size-3 rounded-full"
            :style="{ backgroundColor: String(item) }"
          />
          {{ item }}
        </span>
        <span
          v-if="model.selectedIds.size === 0"
          class="text-xs text-on-surface-variant italic"
        >
          None selected
        </span>
      </div>
    </div>
  </div>
</template>
