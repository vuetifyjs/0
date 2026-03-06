<script setup lang="ts">
  import { isRef, toRef, toValue } from 'vue'
  import { hsl, useColors } from './model'

  const model = useColors()

  const tickets = toRef(() => [...model.values()])

  function onHue (ticket: (typeof tickets.value)[number], event: Event) {
    if (isRef(ticket.value)) {
      ticket.value.value = Number((event.target as HTMLInputElement).value)
    }
  }
</script>

<template>
  <div class="flex flex-col gap-5">
    <!-- Color rows with sliders -->
    <div class="flex flex-col gap-3">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        class="flex items-center gap-3"
        :class="toValue(ticket.disabled) ? 'opacity-30' : ''"
      >
        <button
          class="size-8 shrink-0 rounded-full border-2 transition-all"
          :class="[
            toValue(ticket.disabled)
              ? 'cursor-not-allowed'
              : 'cursor-pointer hover:scale-110',
            ticket.isSelected.value
              ? 'border-on-surface shadow-md'
              : 'border-transparent',
          ]"
          :disabled="toValue(ticket.disabled)"
          :style="{ backgroundColor: hsl(toValue(ticket.value) as number) }"
          @click="model.toggle(ticket.id)"
        />

        <span class="w-14 shrink-0 text-xs font-medium text-on-surface-variant">{{ ticket.id }}</span>

        <input
          class="flex-1 accent-current"
          :disabled="toValue(ticket.disabled)"
          max="360"
          min="0"
          :style="{ color: hsl(toValue(ticket.value) as number) }"
          type="range"
          :value="toValue(ticket.value)"
          @input="onHue(ticket, $event)"
        >

        <span class="w-8 shrink-0 text-right text-xs font-mono text-on-surface-variant/60">
          {{ toValue(ticket.value) }}°
        </span>
      </div>
    </div>

    <!-- Composite -->
    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3 space-y-2">
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">Composite</span>
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
            :style="{ backgroundColor: hsl(item as number) }"
          />
          {{ item }}°
        </span>
        <span
          v-if="model.selectedIds.size === 0"
          class="text-xs text-on-surface-variant italic"
        >
          None selected
        </span>
      </div>

      <!-- Raw output -->
      <pre class="rounded-lg border border-divider bg-surface-variant/30 px-3 py-2 text-xs font-mono text-on-surface-variant">{{ JSON.stringify([...model.selectedValues.value], null, 2) }}</pre>
    </div>
  </div>
</template>
