<script setup lang="ts">
  import { CxHeaderAnchor } from '@paper/codex'

  // Composables
  import { useShowcase } from '../../composables/useShowcase'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getDS } = useShowcase()

  const ds = toRef(() => getDS(route.params.ds as string))
  const tokens = toRef(() => ds.value?.tokens ?? {})

  // Flatten nested color objects into [label, value] pairs
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
</script>

<template>
  <div v-if="ds" class="p-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-2">{{ ds.name }} — Tokens</h1>
    <p class="text-on-surface-variant mb-8">Design tokens powering the {{ ds.name }} system.</p>

    <!-- Colors -->
    <template v-if="tokens.colors">
      <CxHeaderAnchor id="colors" tag="h2">
        Colors
      </CxHeaderAnchor>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
        <div
          v-for="color in flattenColors(tokens.colors)"
          :key="color.key"
          class="flex flex-col"
        >
          <div
            class="h-16 rounded-t-md border border-divider"
            :style="{ backgroundColor: color.value }"
          />
          <div class="px-2 py-1 rounded-b-md bg-surface-variant text-xs">
            <div class="font-semibold truncate">{{ color.key }}</div>
            <div class="text-on-surface-variant font-mono">{{ color.value }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- Border Radius -->
    <template v-if="tokens.borderRadius">
      <CxHeaderAnchor id="border-radius" tag="h2">
        Border Radius
      </CxHeaderAnchor>
      <div class="flex flex-wrap gap-4 mb-8">
        <div
          v-for="(value, name) in tokens.borderRadius"
          :key="name"
          class="flex flex-col items-center gap-2"
        >
          <div
            class="w-16 h-16 bg-primary"
            :style="{ borderRadius: value }"
          />
          <div class="text-xs text-center">
            <div class="font-semibold">{{ name }}</div>
            <div class="text-on-surface-variant font-mono">{{ value }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- Shadows -->
    <template v-if="tokens.boxShadow">
      <CxHeaderAnchor id="shadows" tag="h2">
        Shadows
      </CxHeaderAnchor>
      <div class="flex flex-wrap gap-6 mb-8">
        <div
          v-for="(value, name) in tokens.boxShadow"
          :key="name"
          class="flex flex-col items-center gap-2"
        >
          <div
            class="w-24 h-24 bg-surface rounded-md"
            :style="{ boxShadow: value }"
          />
          <div class="text-xs text-center">
            <div class="font-semibold">{{ name }}</div>
          </div>
        </div>
      </div>
    </template>

    <!-- Typography -->
    <template v-if="tokens.fontFamily">
      <CxHeaderAnchor id="typography" tag="h2">
        Typography
      </CxHeaderAnchor>
      <div class="flex flex-col gap-4 mb-8">
        <div
          v-for="(value, name) in tokens.fontFamily"
          :key="name"
          class="p-4 rounded-md bg-surface-variant"
        >
          <div class="text-xs font-semibold text-on-surface-variant mb-1">{{ name }}</div>
          <div class="text-lg" :style="{ fontFamily: value }">
            The quick brown fox jumps over the lazy dog
          </div>
          <div class="text-xs text-on-surface-variant font-mono mt-1 truncate">{{ value }}</div>
        </div>
      </div>
    </template>

    <!-- Font Sizes -->
    <template v-if="tokens.fontSize">
      <CxHeaderAnchor id="font-sizes" tag="h2">
        Font Sizes
      </CxHeaderAnchor>
      <div class="flex flex-col gap-3 mb-8">
        <div
          v-for="(value, name) in tokens.fontSize"
          :key="name"
          class="flex items-baseline gap-4"
        >
          <div class="w-12 text-xs text-on-surface-variant font-mono shrink-0">{{ name }}</div>
          <div :style="{ fontSize: formatFontSize(value) }">
            Aa
          </div>
          <div class="text-xs text-on-surface-variant font-mono">{{ formatFontSize(value) }}</div>
        </div>
      </div>
    </template>

    <!-- Spacing -->
    <template v-if="tokens.spacing">
      <CxHeaderAnchor id="spacing" tag="h2">
        Spacing
      </CxHeaderAnchor>
      <div class="flex flex-col gap-2 mb-8">
        <div
          v-for="(value, name) in tokens.spacing"
          :key="name"
          class="flex items-center gap-4"
        >
          <div class="w-12 text-xs text-on-surface-variant font-mono shrink-0">{{ name }}</div>
          <div
            class="h-4 bg-primary rounded-sm"
            :style="{ width: String(value) }"
          />
          <div class="text-xs text-on-surface-variant font-mono">{{ String(value) }}</div>
        </div>
      </div>
    </template>
  </div>

  <div v-else class="p-8">
    <p class="text-on-surface-variant">Design system not found.</p>
  </div>
</template>
