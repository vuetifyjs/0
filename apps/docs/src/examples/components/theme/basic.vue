<script setup lang="ts">
  import { Theme, useTheme } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const theme = useTheme()
  const selected = shallowRef<string>()
  const names = toRef(() => theme.keys())
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-1.5">
      <button
        class="px-2.5 py-1 text-xs font-medium rounded border transition-colors"
        :class="!selected ? 'bg-primary text-on-primary border-transparent' : 'border-divider hover:bg-surface-tint'"
        @click="selected = undefined"
      >
        Default
      </button>

      <button
        v-for="name in names"
        :key="name"
        class="px-2.5 py-1 text-xs font-medium rounded border transition-colors capitalize"
        :class="selected === name ? 'bg-primary text-on-primary border-transparent' : 'border-divider hover:bg-surface-tint'"
        @click="selected = name"
      >
        {{ name }}
      </button>
    </div>

    <Theme class="rounded-lg bg-background text-on-background border border-divider overflow-hidden" :theme="selected">
      <div class="px-4 py-3 border-b border-divider bg-surface">
        <div class="text-sm font-semibold">Notifications</div>
        <div class="text-xs text-on-surface-variant">Manage how you receive alerts</div>
      </div>

      <div class="p-4 flex flex-col gap-3">
        <label class="flex items-center justify-between">
          <span class="text-sm">Push notifications</span>
          <span class="w-8 h-5 rounded-full bg-primary relative">
            <span class="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-on-primary transition-all" />
          </span>
        </label>

        <label class="flex items-center justify-between">
          <span class="text-sm">Email digest</span>
          <span class="w-8 h-5 rounded-full bg-surface-tint border border-divider relative">
            <span class="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-on-surface-variant transition-all" />
          </span>
        </label>

        <label class="flex items-center justify-between">
          <span class="text-sm">SMS alerts</span>
          <span class="w-8 h-5 rounded-full bg-surface-tint border border-divider relative">
            <span class="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-on-surface-variant transition-all" />
          </span>
        </label>
      </div>

      <div class="px-4 py-3 border-t border-divider bg-surface flex justify-end gap-2">
        <button class="px-3 py-1.5 text-xs font-medium rounded border border-divider hover:bg-surface-tint">
          Cancel
        </button>

        <button class="px-3 py-1.5 text-xs font-medium rounded bg-primary text-on-primary">
          Save
        </button>
      </div>
    </Theme>
  </div>
</template>
