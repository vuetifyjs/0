<script setup lang="ts">
  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  // Utilities
  import { shallowRef } from 'vue'

  // Types
  import type { PaletteDefinition } from '@vuetify/v0/palettes'

  const { definition } = defineProps<{
    definition: PaletteDefinition
  }>()

  const { copied, copy } = useClipboard()
  const last = shallowRef('')

  async function onCopy (hex: string) {
    last.value = hex
    await copy(hex)
  }

  function isCopied (hex: string) {
    return copied.value && last.value === hex
  }

  const tabs = ['Overview', 'Analytics', 'Reports']

  const stats = [
    { label: 'Users', value: '2.4k', bg: 'primary-container', fg: 'on-primary-container' },
    { label: 'Revenue', value: '$12k', bg: 'secondary-container', fg: 'on-secondary-container' },
    { label: 'Growth', value: '+8%', bg: 'tertiary-container', fg: 'on-tertiary-container' },
  ] as const

  const tasks = [
    { label: 'Deploy v2.0 release', badge: 'Active', bg: 'primary', fg: 'on-primary' },
    { label: 'Fix auth timeout bug', badge: 'Error', bg: 'error', fg: 'on-error' },
    { label: 'Update dependencies', badge: 'Pending', bg: 'secondary-container', fg: 'on-secondary-container' },
  ] as const
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4">
    <div
      v-for="mode in (['light', 'dark'] as const)"
      :key="mode"
      class="flex-1 min-w-0"
    >
      <div class="text-xs uppercase tracking-wider font-semibold mb-1 op-60">
        {{ mode }}
      </div>

      <div
        class="rounded-lg p-3 border border-solid"
        :style="{
          backgroundColor: definition.themes[mode]?.colors?.['surface'] as string,
          borderColor: definition.themes[mode]?.colors?.['outline'] as string,
        }"
      >
        <!-- Tab nav -->
        <div class="flex gap-3 mb-3 border-b border-solid pb-1" :style="{ borderColor: definition.themes[mode]?.colors?.['outline'] as string }">
          <button
            v-for="(tab, index) in tabs"
            :key="tab"
            class="cursor-pointer text-xs font-medium pb-1 bg-transparent border-none border-b-2 border-solid"
            :style="{
              color: (index === 0
                ? definition.themes[mode]?.colors?.['primary']
                : definition.themes[mode]?.colors?.['on-surface-variant']) as string,
              borderColor: index === 0
                ? (definition.themes[mode]?.colors?.['primary'] as string)
                : 'transparent',
            }"
            :title="(index === 0
              ? definition.themes[mode]?.colors?.['primary']
              : definition.themes[mode]?.colors?.['on-surface-variant']) as string"
            @click="onCopy((index === 0
              ? definition.themes[mode]?.colors?.['primary']
              : definition.themes[mode]?.colors?.['on-surface-variant']) as string)"
          >
            {{ tab }}
            <span
              v-if="isCopied((index === 0
                ? definition.themes[mode]?.colors?.['primary']
                : definition.themes[mode]?.colors?.['on-surface-variant']) as string)"
              class="text-[10px] ml-1 op-70"
            >Copied!</span>
          </button>
        </div>

        <!-- Stat cards -->
        <div class="flex gap-2 mb-3">
          <button
            v-for="stat in stats"
            :key="stat.label"
            class="cursor-pointer flex-1 rounded-md px-2 py-1.5 border-none"
            :style="{
              backgroundColor: definition.themes[mode]?.colors?.[stat.bg] as string,
              color: definition.themes[mode]?.colors?.[stat.fg] as string,
            }"
            :title="`bg: ${definition.themes[mode]?.colors?.[stat.bg]} / text: ${definition.themes[mode]?.colors?.[stat.fg]}`"
            @click="onCopy(definition.themes[mode]?.colors?.[stat.bg] as string)"
          >
            <div class="text-[10px] op-80">{{ stat.label }}</div>
            <div class="text-sm font-bold">{{ stat.value }}</div>
            <span
              v-if="isCopied(definition.themes[mode]?.colors?.[stat.bg] as string)"
              class="text-[10px] op-70"
            >Copied!</span>
          </button>
        </div>

        <!-- Task list -->
        <div class="flex flex-col gap-1.5">
          <button
            v-for="task in tasks"
            :key="task.label"
            class="cursor-pointer flex items-center justify-between rounded-md px-2 py-1.5 border border-solid bg-transparent text-left"
            :style="{
              borderColor: definition.themes[mode]?.colors?.['outline'] as string,
              color: definition.themes[mode]?.colors?.['on-surface'] as string,
            }"
            @click="onCopy(definition.themes[mode]?.colors?.[task.bg] as string)"
          >
            <span class="text-xs truncate mr-2">{{ task.label }}</span>
            <span
              class="text-[10px] font-medium rounded-full px-2 py-0.5 shrink-0"
              :style="{
                backgroundColor: definition.themes[mode]?.colors?.[task.bg] as string,
                color: definition.themes[mode]?.colors?.[task.fg] as string,
              }"
            >
              {{ task.badge }}
              <span
                v-if="isCopied(definition.themes[mode]?.colors?.[task.bg] as string)"
                class="ml-0.5"
              >Copied!</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
