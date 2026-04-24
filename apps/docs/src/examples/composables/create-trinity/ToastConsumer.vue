<script setup lang="ts">
  import { Select } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'
  import { useToasts } from './toasts'
  import type { Toast } from './toasts'

  const { toasts, push, dismiss, clear } = useToasts()

  const presets = [
    { label: 'Deployed', type: 'success' as const, message: 'Build deployed to production' },
    { label: 'Rate limit', type: 'warning' as const, message: 'API rate limit at 80% capacity' },
    { label: 'DB error', type: 'error' as const, message: 'Connection to replica-2 lost' },
    { label: 'Sync done', type: 'info' as const, message: 'Config sync completed across 3 regions' },
  ]

  const message = shallowRef('')
  const type = shallowRef<Toast['type']>('info')

  const types = [
    { id: 'info', label: 'Info' },
    { id: 'success', label: 'Success' },
    { id: 'warning', label: 'Warning' },
    { id: 'error', label: 'Error' },
  ] as const

  const typeStyles: Record<Toast['type'], { bg: string, symbol: string, symbolClass: string, border: string }> = {
    info: { bg: 'bg-primary/10', symbol: 'ℹ', symbolClass: 'text-primary', border: 'border-l-primary' },
    success: { bg: 'bg-success/10', symbol: '✓', symbolClass: 'text-success', border: 'border-l-success' },
    warning: { bg: 'bg-warning/10', symbol: '⚠', symbolClass: 'text-warning', border: 'border-l-warning' },
    error: { bg: 'bg-error/10', symbol: '✕', symbolClass: 'text-error', border: 'border-l-error' },
  }

  const count = toRef(() => toasts.length)

  function send () {
    if (!message.value.trim()) return
    push(message.value, type.value)
    message.value = ''
  }
</script>

<template>
  <div class="space-y-6">
    <!-- Quick-fire presets -->
    <div>
      <p class="text-xs font-medium text-on-surface-variant mb-2">Quick notifications</p>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in presets"
          :key="preset.label"
          class="px-3 py-1.5 text-sm rounded-lg border border-divider hover:bg-surface-tint transition-colors"
          @click="push(preset.message, preset.type)"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <!-- Custom message -->
    <div class="flex gap-2">
      <Select.Root
        mandatory
        :model-value="type"
        @update:model-value="type = $event as Toast['type']"
      >
        <Select.Activator class="inline-flex items-center gap-1 px-2 py-1.5 text-sm rounded-lg border border-divider bg-surface text-on-surface cursor-pointer">
          <Select.Value v-slot="{ selectedValue }">{{ types.find(t => t.id === selectedValue)?.label }}</Select.Value>
          <Select.Cue v-slot="{ isOpen }" class="text-xs opacity-50">{{ isOpen ? '&#x25B4;' : '&#x25BE;' }}</Select.Cue>
        </Select.Activator>

        <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
          <Select.Item
            v-for="t in types"
            :id="t.id"
            :key="t.id"
            v-slot="{ isSelected, isHighlighted }"
            :value="t.id"
          >
            <div
              class="px-3 py-1.5 rounded-md cursor-default select-none text-sm"
              :class="[
                isHighlighted ? 'bg-primary text-on-primary'
                : isSelected ? 'text-primary font-medium'
                  : 'text-on-surface hover:bg-surface-variant',
              ]"
            >
              {{ t.label }}
            </div>
          </Select.Item>
        </Select.Content>
      </Select.Root>

      <input
        v-model="message"
        class="flex-1 px-3 py-1.5 text-sm rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary"
        placeholder="Type a custom notification..."
        @keydown.enter="send"
      >

      <button
        class="px-3 py-1.5 text-sm rounded-lg bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-40 transition-colors"
        :disabled="!message.trim()"
        @click="send"
      >
        Send
      </button>
    </div>

    <!-- Toast stack -->
    <div class="relative min-h-24 rounded-xl border border-divider bg-surface-variant/30 p-4 overflow-hidden">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs text-on-surface-variant">
          {{ count }} active notification{{ count === 1 ? '' : 's' }}
        </span>

        <button
          v-if="count > 0"
          class="text-xs text-on-surface-variant hover:text-on-surface transition-colors"
          @click="clear()"
        >
          Clear all
        </button>
      </div>

      <div class="space-y-2">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg border-l-3 min-h-[52px]"
          :class="[typeStyles[toast.type].bg, typeStyles[toast.type].border]"
        >
          <span class="w-5 text-center text-base leading-none shrink-0" :class="typeStyles[toast.type].symbolClass">{{ typeStyles[toast.type].symbol }}</span>
          <span class="flex-1 text-sm text-on-surface">{{ toast.message }}</span>

          <button
            class="flex items-center text-on-surface-variant hover:text-on-surface transition-colors"
            @click="dismiss(toast.id)"
          >
            ✕
          </button>
        </div>
      </div>

      <div
        v-if="count === 0"
        class="text-center text-sm text-on-surface-variant py-4"
      >
        No notifications. Click a button above to fire one.
      </div>
    </div>

    <!-- Trinity tuple breakdown -->
    <div class="grid grid-cols-3 gap-2 text-center">
      <div class="p-3 rounded-lg bg-surface-variant/50">
        <p class="text-xs font-mono text-on-surface-variant">useToasts</p>
        <p class="text-[10px] text-on-surface-variant/60 mt-1">Consumer</p>
      </div>

      <div class="p-3 rounded-lg bg-surface-variant/50">
        <p class="text-xs font-mono text-on-surface-variant">provideToasts</p>
        <p class="text-[10px] text-on-surface-variant/60 mt-1">Provider</p>
      </div>

      <div class="p-3 rounded-lg bg-surface-variant/50">
        <p class="text-xs font-mono text-on-surface-variant">toastsContext</p>
        <p class="text-[10px] text-on-surface-variant/60 mt-1">Default context</p>
      </div>
    </div>
  </div>
</template>
