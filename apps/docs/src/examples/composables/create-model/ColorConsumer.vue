<script setup lang="ts">
  import { isRef, toRef, toValue } from 'vue'
  import { Slider } from '@vuetify/v0'
  import { hueGradient, oklch, useColors } from './model'

  const model = useColors()
  const tickets = toRef(() => [...model.values()])
  const selected = toRef(() => [...model.selectedItems.value])
  const gradient = hueGradient()

  function onHue (ticket: (typeof tickets.value)[number], value: number | number[]) {
    if (isRef(ticket.value)) {
      ticket.value.value = Number(value)
    }
  }
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-baseline justify-between">
      <span class="text-on-surface text-lg font-serif italic">Palette</span>
      <span class="text-on-surface-variant/45 text-xs font-medium tracking-widest uppercase">
        {{ model.selectedIds.size }} / {{ model.size }}
      </span>
    </div>

    <!-- Color rows -->
    <div class="flex flex-col gap-2.5">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        class="grid grid-cols-[32px_52px_1fr_38px] h-9 items-center gap-2.5"
        :class="toValue(ticket.disabled) ? 'opacity-25 pointer-events-none' : ''"
      >
        <!-- Swatch toggle -->
        <button
          class="swatch size-8 shrink-0 rounded-full border-2 cursor-pointer relative"
          :class="ticket.isSelected.value ? 'border-current' : 'border-transparent'"
          :disabled="toValue(ticket.disabled)"
          :style="{ color: oklch(toValue(ticket.value) as number) }"
          @click="model.toggle(ticket.id)"
        >
          <span
            class="absolute rounded-full inset-[3px]"
            :style="{ backgroundColor: oklch(toValue(ticket.value) as number) }"
          />
        </button>

        <!-- Label -->
        <span class="text-on-surface-variant/45 text-xs font-medium tracking-wide capitalize">
          {{ ticket.id }}
        </span>

        <!-- Hue slider -->
        <Slider.Root
          class="relative flex items-center w-full h-6"
          :disabled="toValue(ticket.disabled)"
          :max="360"
          :min="0"
          :model-value="toValue(ticket.value) as number"
          @update:model-value="onHue(ticket, $event)"
        >
          <Slider.Track
            class="relative h-1.5 w-full rounded-full overflow-hidden"
            :style="{ background: gradient }"
          />

          <Slider.Thumb
            class="absolute top-1/2 size-4 rounded-full border-2 border-on-surface shadow-md -translate-x-1/2 -translate-y-1/2 cursor-grab transition-transform data-[state=dragging]:scale-125 data-[state=dragging]:cursor-grabbing"
            :style="{ backgroundColor: oklch(toValue(ticket.value) as number) }"
          />
        </Slider.Root>

        <!-- Degree value -->
        <span class="text-on-surface-variant/45 text-right text-xs font-mono tabular-nums">
          {{ toValue(ticket.value) }}°
        </span>
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px bg-divider" />

    <!-- Composite strip -->
    <div class="flex flex-col gap-2.5">
      <span class="text-on-surface-variant/25 text-xs font-medium tracking-widest uppercase">
        Composite
      </span>

      <div class="strip-wrapper h-14 rounded-xl overflow-hidden relative">
        <div v-if="selected.length > 0" class="flex w-full h-full">
          <div
            v-for="(item, index) in selected"
            :key="item.id"
            class="strip-segment flex-1 min-w-0 relative"
            :class="index > 0 ? 'strip-segment-divider' : ''"
            :style="{ backgroundColor: oklch(toValue(item.value) as number) }"
          />
        </div>
        <div
          v-else
          class="w-full h-full grid place-items-center bg-surface-variant/30 text-on-surface-variant/25 text-xs italic"
        >
          No colors selected
        </div>
      </div>

      <!-- Values beneath strip -->
      <div class="flex min-h-4">
        <span
          v-for="item in selected"
          :key="item.id"
          class="flex-1 text-center text-on-surface-variant/45 text-[10px] font-light tabular-nums"
        >
          {{ toValue(item.value) }}°
        </span>
      </div>

      <!-- Raw output -->
      <pre class="rounded-lg border border-divider bg-surface-variant/30 px-3 py-2 text-xs font-mono text-on-surface-variant">{{ JSON.stringify(selected.map(item => toValue(item.value)), null, 2) }}</pre>
    </div>
  </div>
</template>

<style scoped>
/* Composite strip — complex shadow + pseudo-elements require CSS */
.strip-wrapper {
  box-shadow:
    inset 0 2px 6px rgba(0, 0, 0, 0.25),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.15);
}

/* Glass highlight */
.strip-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.08), transparent 40%);
  pointer-events: none;
}

/* Facet line between segments */
.strip-segment-divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.12),
    rgba(255, 255, 255, 0.03) 50%,
    rgba(0, 0, 0, 0.15)
  );
}
</style>
