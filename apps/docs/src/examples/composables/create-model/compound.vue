<script setup lang="ts">
  import { mdiCancel, mdiCheckCircle } from '@mdi/js'
  import { isRef, toValue } from 'vue'
  import { Checkbox } from '@vuetify/v0'
  import { allToppings, createCompound, sizes } from './createCompound'

  const { store, tickets, compound, name, size, toppings, quantity } = createCompound()

  function onToggle (id: string | number) {
    if (store.selected(id)) store.selectedIds.delete(id)
    else store.selectedIds.add(id)
  }

  function onDisable (ticket: (typeof tickets.value)[number]) {
    if (isRef(ticket.disabled)) {
      ticket.disabled.value = !ticket.disabled.value
    }
  }

  function onTopping (topping: string) {
    const has = toppings.value.includes(topping)
    toppings.value = has
      ? toppings.value.filter(t => t !== topping)
      : [...toppings.value, topping]
  }
</script>

<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-baseline justify-between">
      <span class="text-xs text-on-surface-variant/50 tabular-nums">
        {{ store.selectedIds.size }} / {{ store.size }} in compound
      </span>
    </div>

    <!-- Tickets -->
    <div class="flex flex-col gap-2">
      <div
        v-for="ticket in tickets"
        :key="ticket.id"
        class="flex items-start gap-3 rounded-lg border p-3"
        :class="[
          ticket.isSelected.value ? 'border-primary bg-primary/5' : 'border-divider bg-surface',
          toValue(ticket.disabled) ? 'opacity-40' : '',
        ]"
      >
        <Checkbox.Root
          class="size-5 shrink-0 rounded border-2 flex items-center justify-center mt-0.5"
          :class="[
            ticket.isSelected.value ? 'bg-primary border-primary' : 'bg-transparent border-on-surface-variant/30',
            toValue(ticket.disabled) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          ]"
          :disabled="toValue(ticket.disabled)"
          :model-value="ticket.isSelected.value"
          @update:model-value="onToggle(ticket.id)"
        >
          <Checkbox.Indicator class="text-on-primary text-xs font-bold leading-none">✓</Checkbox.Indicator>
        </Checkbox.Root>

        <div class="flex-1 flex flex-col gap-1.5 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium text-on-surface-variant/50 uppercase tracking-wider">{{ ticket.id }}</span>
            <button
              class="cursor-pointer p-0.5 rounded"
              :class="toValue(ticket.disabled) ? 'text-success/60 hover:text-success' : 'text-on-surface-variant/30 hover:text-warning'"
              :title="toValue(ticket.disabled) ? 'Enable' : 'Disable'"
              @click="onDisable(ticket)"
            >
              <svg class="size-3.5" viewBox="0 0 24 24"><path :d="toValue(ticket.disabled) ? mdiCheckCircle : mdiCancel" fill="currentColor" /></svg>
            </button>
          </div>

          <!-- Text -->
          <input
            v-if="ticket.id === 'name'"
            v-model="name"
            class="text-sm font-mono text-on-surface bg-transparent outline-none border border-divider rounded px-2 py-1 focus:border-primary/40 disabled:cursor-not-allowed"
            :disabled="toValue(ticket.disabled)"
          >

          <!-- Radios -->
          <div v-else-if="ticket.id === 'size'" class="flex gap-1.5 flex-wrap">
            <label
              v-for="s in sizes"
              :key="s"
              class="px-2 py-0.5 rounded border text-xs font-mono"
              :class="[
                size === s ? 'border-primary bg-primary/10 text-primary' : 'border-divider text-on-surface-variant/60',
                toValue(ticket.disabled) ? 'cursor-not-allowed' : 'cursor-pointer',
              ]"
            >
              <input
                :checked="size === s"
                class="sr-only"
                :disabled="toValue(ticket.disabled)"
                type="radio"
                :value="s"
                @change="size = s"
              >
              {{ s }}
            </label>
          </div>

          <!-- Checkboxes -->
          <div v-else-if="ticket.id === 'toppings'" class="flex gap-1.5 flex-wrap">
            <label
              v-for="t in allToppings"
              :key="t"
              class="px-2 py-0.5 rounded border text-xs font-mono"
              :class="[
                toppings.includes(t) ? 'border-primary bg-primary/10 text-primary' : 'border-divider text-on-surface-variant/60',
                toValue(ticket.disabled) ? 'cursor-not-allowed' : 'cursor-pointer',
              ]"
            >
              <input
                :checked="toppings.includes(t)"
                class="sr-only"
                :disabled="toValue(ticket.disabled)"
                type="checkbox"
                @change="onTopping(t)"
              >
              {{ t }}
            </label>
          </div>

          <!-- Slider -->
          <div v-else-if="ticket.id === 'quantity'" class="flex items-center gap-3">
            <input
              class="flex-1 accent-primary"
              :disabled="toValue(ticket.disabled)"
              max="10"
              min="1"
              type="range"
              :value="quantity"
              @input="quantity = Number(($event.target as HTMLInputElement).value)"
            >
            <span class="text-sm font-mono text-on-surface tabular-nums w-5 text-right">{{ quantity }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Compound -->
    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3 space-y-1">
      <div class="text-xs font-medium text-on-surface-variant/50 uppercase tracking-wider">Compound Value</div>
      <pre class="text-xs font-mono text-on-surface-variant whitespace-pre-wrap">{{ JSON.stringify(compound, null, 2) }}</pre>
    </div>
  </div>
</template>
