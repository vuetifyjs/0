<script setup lang="ts">
  import {
    CxBadge,
    CxCard,
    CxTabPanel,
    CxTabs,
    CxTooltip,
  } from '@paper/codex'

  // Composables
  import { useShowcase } from '../../composables/useShowcase'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getDS } = useShowcase()

  const ds = toRef(() => getDS(route.params.ds as string))
  const tokens = toRef(() => ds.value?.tokens ?? {})

  const tabs = toRef(() => {
    const all = [
      { value: 'colors', label: 'Colors', show: !!tokens.value.colors },
      { value: 'typography', label: 'Typography', show: !!(tokens.value.fontFamily || tokens.value.fontSize) },
      { value: 'spacing', label: 'Spacing', show: !!tokens.value.spacing },
      { value: 'shadows', label: 'Shadows', show: !!tokens.value.boxShadow },
      { value: 'border-radius', label: 'Border Radius', show: !!tokens.value.borderRadius },
      { value: 'z-index', label: 'Z-Index', show: !!(tokens.value as Record<string, unknown>).zIndex },
      { value: 'easing', label: 'Easing', show: !!(tokens.value as Record<string, unknown>).easing },
      { value: 'duration', label: 'Duration', show: !!(tokens.value as Record<string, unknown>).duration },
    ]
    return all.filter(t => t.show).map(({ value, label }) => ({ value, label }))
  })

  function flattenColors (colors: Record<string, string | Record<string, string>>): Array<{ key: string, value: string }> {
    const result: Array<{ key: string, value: string }> = []
    for (const [name, val] of Object.entries(colors)) {
      if (typeof val === 'string') {
        result.push({ key: name, value: val })
      } else {
        for (const [shade, hex] of Object.entries(val)) {
          result.push({ key: `${name}-${shade}`, value: hex })
        }
      }
    }
    return result
  }

  function formatFontSize (value: unknown): string {
    if (Array.isArray(value)) return String(value[0])
    return String(value)
  }

  function asRecord (value: unknown): Record<string, unknown> {
    return (value as Record<string, unknown>) ?? {}
  }
</script>

<template>
  <div v-if="ds" class="p-8 max-w-5xl">
    <h1 class="text-3xl font-bold mb-2">{{ ds.name }} — Tokens</h1>
    <p class="text-on-surface-variant mb-8">Design tokens powering the {{ ds.name }} system.</p>

    <CxTabs :items="tabs">
      <!-- Colors -->
      <CxTabPanel value="colors">
        <div class="pt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <CxTooltip
            v-for="color in flattenColors(tokens.colors!)"
            :key="color.key"
            placement="top"
            :text="color.value"
          >
            <CxCard class="overflow-hidden">
              <div
                class="h-16"
                :style="{ backgroundColor: color.value }"
              />
              <div class="px-2 py-1.5">
                <div class="text-xs font-semibold truncate">{{ color.key }}</div>
                <div class="text-xs text-on-surface-variant font-mono">{{ color.value }}</div>
              </div>
            </CxCard>
          </CxTooltip>
        </div>
      </CxTabPanel>

      <!-- Typography -->
      <CxTabPanel value="typography">
        <div class="pt-6 flex flex-col gap-6">
          <template v-if="tokens.fontFamily">
            <div>
              <h3 class="text-sm font-semibold text-on-surface-variant mb-3 uppercase tracking-wide">Font Families</h3>
              <div class="flex flex-col gap-3">
                <CxCard
                  v-for="(value, name) in tokens.fontFamily"
                  :key="name"
                  class="p-4"
                >
                  <div class="text-xs font-semibold text-on-surface-variant mb-1">{{ name }}</div>
                  <div class="text-lg" :style="{ fontFamily: String(value) }">
                    The quick brown fox jumps over the lazy dog
                  </div>
                  <div class="text-xs text-on-surface-variant font-mono mt-1 truncate">{{ value }}</div>
                </CxCard>
              </div>
            </div>
          </template>

          <template v-if="tokens.fontSize">
            <div>
              <h3 class="text-sm font-semibold text-on-surface-variant mb-3 uppercase tracking-wide">Font Sizes</h3>
              <div class="flex flex-col gap-2">
                <div
                  v-for="(value, name) in tokens.fontSize"
                  :key="name"
                  class="flex items-baseline gap-4 py-1 border-b border-divider last:border-none"
                >
                  <div class="w-12 text-xs text-on-surface-variant font-mono shrink-0">{{ name }}</div>
                  <div :style="{ fontSize: formatFontSize(value) }">Aa</div>
                  <div class="text-xs text-on-surface-variant font-mono">{{ formatFontSize(value) }}</div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </CxTabPanel>

      <!-- Spacing -->
      <CxTabPanel value="spacing">
        <div class="pt-6 flex flex-col gap-2">
          <div
            v-for="(value, name) in tokens.spacing"
            :key="name"
            class="flex items-center gap-4 py-1"
          >
            <div class="w-10 text-xs text-on-surface-variant font-mono shrink-0">{{ name }}</div>
            <div
              class="h-4 bg-primary rounded-sm shrink-0"
              :style="{ width: String(value) }"
            />
            <div class="text-xs text-on-surface-variant font-mono">{{ String(value) }}</div>
          </div>
        </div>
      </CxTabPanel>

      <!-- Shadows -->
      <CxTabPanel value="shadows">
        <div class="pt-6 flex flex-wrap gap-6">
          <div
            v-for="(value, name) in tokens.boxShadow"
            :key="name"
            class="flex flex-col items-center gap-3"
          >
            <CxCard
              class="w-28 h-28 flex items-center justify-center"
              :style="{ boxShadow: String(value) }"
            >
              <span class="text-xs font-semibold">{{ name }}</span>
            </CxCard>
          </div>
        </div>
      </CxTabPanel>

      <!-- Border Radius -->
      <CxTabPanel value="border-radius">
        <div class="pt-6 flex flex-wrap gap-6">
          <div
            v-for="(value, name) in tokens.borderRadius"
            :key="name"
            class="flex flex-col items-center gap-2"
          >
            <div
              class="w-16 h-16 bg-primary"
              :style="{ borderRadius: String(value) }"
            />
            <div class="text-xs text-center">
              <div class="font-semibold">{{ name }}</div>
              <div class="text-on-surface-variant font-mono">{{ value }}</div>
            </div>
          </div>
        </div>
      </CxTabPanel>

      <!-- Z-Index -->
      <CxTabPanel value="z-index">
        <div class="pt-6 flex flex-col gap-3">
          <div
            v-for="(value, name) in asRecord(tokens.zIndex)"
            :key="name"
            class="flex items-center gap-3 py-2 border-b border-divider last:border-none"
          >
            <div class="flex-1 text-sm font-medium">{{ name }}</div>
            <CxBadge color="primary" variant="subtle">{{ value }}</CxBadge>
          </div>
        </div>
      </CxTabPanel>

      <!-- Easing -->
      <CxTabPanel value="easing">
        <div class="pt-6 flex flex-col gap-3">
          <div
            v-for="(value, name) in asRecord(tokens.easing)"
            :key="name"
            class="py-2 border-b border-divider last:border-none"
          >
            <div class="text-sm font-medium mb-1">{{ name }}</div>
            <div class="text-xs text-on-surface-variant font-mono">{{ value }}</div>
          </div>
        </div>
      </CxTabPanel>

      <!-- Duration -->
      <CxTabPanel value="duration">
        <div class="pt-6 flex flex-col gap-3">
          <div
            v-for="(value, name) in asRecord(tokens.duration)"
            :key="name"
            class="flex items-center gap-3 py-2 border-b border-divider last:border-none"
          >
            <div class="flex-1 text-sm font-medium">{{ name }}</div>
            <CxBadge color="primary" variant="subtle">{{ value }}</CxBadge>
          </div>
        </div>
      </CxTabPanel>
    </CxTabs>
  </div>

  <div v-else class="p-8">
    <p class="text-on-surface-variant">Design system not found.</p>
  </div>
</template>
