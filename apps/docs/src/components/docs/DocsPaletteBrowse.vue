<script setup lang="ts">
  // Framework
  import { ant } from '@vuetify/v0/palettes/ant'
  import { material } from '@vuetify/v0/palettes/material'
  import { md1 } from '@vuetify/v0/palettes/md1'
  import { md2 } from '@vuetify/v0/palettes/md2'
  import { radix } from '@vuetify/v0/palettes/radix'
  import { tailwind } from '@vuetify/v0/palettes/tailwind'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  // Utilities
  import { computed, ref, shallowRef, watch } from 'vue'

  interface PaletteEntry {
    label: string
    data: Record<string, Record<string, string>>
    namespace: string
  }

  const PALETTES: Record<string, PaletteEntry> = {
    tailwind: { label: 'Tailwind', data: tailwind as Record<string, Record<string, string>>, namespace: 'tw' },
    md1: { label: 'MD1', data: md1 as Record<string, Record<string, string>>, namespace: 'md1' },
    md2: { label: 'MD2', data: md2 as Record<string, Record<string, string>>, namespace: 'md2' },
    material: { label: 'Material', data: material as Record<string, Record<string, string>>, namespace: 'md' },
    radix: { label: 'Radix', data: radix as Record<string, Record<string, string>>, namespace: 'radix' },
    ant: { label: 'Ant Design', data: ant as Record<string, Record<string, string>>, namespace: 'ant' },
  }

  const selected = shallowRef('tailwind')
  const clicks = ref(new Map<string, string>())
  const { copied, copy } = useClipboard()

  const palette = computed(() => PALETTES[selected.value]!)

  // Normalize: extract all unique shade keys across all hues in the selected palette
  // This ensures every row has the same number of columns
  const columns = computed(() => {
    const keys = new Set<string>()
    for (const collection of Object.values(palette.value.data)) {
      for (const key of Object.keys(collection)) {
        keys.add(key)
      }
    }
    // Sort: numeric first (by number), then accent (A-prefixed)
    const numeric: string[] = []
    const accent: string[] = []
    for (const key of keys) {
      if (key.startsWith('A')) {
        accent.push(key)
      } else {
        numeric.push(key)
      }
    }
    numeric.sort((a, b) => Number(a) - Number(b))
    accent.sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)))
    return [...numeric, ...accent]
  })

  const rows = computed(() => Object.entries(palette.value.data))

  // Transpose when there are more shades than hues (e.g., Material: 6 groups × 26 tones)
  // This swaps axes so groups become columns and tones become rows
  const transposed = computed(() => columns.value.length > rows.value.length * 2)

  watch(selected, () => {
    clicks.value.clear()
  })

  function onSwatch (hue: string, shade: string, hex: string) {
    const path = `${hue}.${shade}`
    copy(path)
    clicks.value.set(path, hex)
  }

  function onExport () {
    const p = palette.value
    const ns = p.namespace
    const name = selected.value
    let code = `import { ${name} } from '@vuetify/v0/palettes/${name}'\n\n`
    code += `app.use(\n  createThemePlugin({\n    palette: { ${ns}: ${name} },\n`
    code += `    themes: {\n      light: {\n        colors: {\n`

    if (clicks.value.size > 0) {
      for (const [path] of clicks.value) {
        code += `          // '{palette.${ns}.${path}}',\n`
      }
    } else {
      code += `          // primary: '{palette.${ns}.blue.500}',\n`
      code += `          // secondary: '{palette.${ns}.slate.600}',\n`
    }

    code += `        }\n      }\n    }\n  })\n)`
    copy(code)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="text-xs uppercase tracking-wider font-semibold op-60">
        Browse Palettes
      </div>

      <select
        v-model="selected"
        class="h-[30px] px-2 text-xs font-medium bg-surface-tint border border-divider rounded"
      >
        <option
          v-for="(entry, key) in PALETTES"
          :key
          :value="key"
        >
          {{ entry.label }}
        </option>
      </select>
    </div>

    <!-- Swatch grid — fixed height container, uniform cell sizes -->
    <div class="h-[420px] overflow-auto border border-divider rounded-lg">
      <!-- Transposed: groups as columns, tones as rows (for Material) -->
      <div
        v-if="transposed"
        class="grid gap-px"
        :style="{
          gridTemplateColumns: `80px repeat(${rows.length}, minmax(40px, 1fr))`,
        }"
      >
        <!-- Column headers (group names) -->
        <div class="sticky top-0 z-1 bg-surface px-2 py-1" />
        <div
          v-for="([hue]) in rows"
          :key="hue"
          class="sticky top-0 z-1 bg-surface text-center text-[9px] op-40 py-1 uppercase tracking-wider"
        >
          {{ hue }}
        </div>

        <!-- Rows (tone values) -->
        <template v-for="tone in columns" :key="tone">
          <div class="sticky left-0 z-1 bg-surface flex items-center px-2 text-[10px] font-medium op-50 font-mono">
            {{ tone }}
          </div>

          <button
            v-for="([hue, collection]) in rows"
            :key="hue"
            class="h-7 cursor-pointer border-0 transition-opacity"
            :class="collection[tone] ? 'hover:opacity-80' : 'opacity-0 pointer-events-none'"
            :style="collection[tone] ? { backgroundColor: collection[tone] } : {}"
            :title="collection[tone] ? `${hue}.${tone} · ${collection[tone]}` : ''"
            @click="collection[tone] && onSwatch(hue, tone, collection[tone]!)"
          />
        </template>
      </div>

      <!-- Normal: hues as rows, shades as columns -->
      <div
        v-else
        class="grid gap-px min-w-fit"
        :style="{
          gridTemplateColumns: `80px repeat(${columns.length}, minmax(28px, 1fr))`,
        }"
      >
        <!-- Column headers -->
        <div class="sticky top-0 z-1 bg-surface px-2 py-1" />
        <div
          v-for="col in columns"
          :key="col"
          class="sticky top-0 z-1 bg-surface text-center text-[9px] op-40 py-1 font-mono"
        >
          {{ col }}
        </div>

        <!-- Rows -->
        <template v-for="([hue, collection]) in rows" :key="hue">
          <!-- Hue label -->
          <div class="sticky left-0 z-1 bg-surface flex items-center px-2 text-[10px] uppercase tracking-wider font-medium op-50 truncate">
            {{ hue }}
          </div>

          <!-- Swatch cells -->
          <button
            v-for="col in columns"
            :key="col"
            class="h-7 cursor-pointer border-0 transition-opacity"
            :class="collection[col] ? 'hover:opacity-80' : 'opacity-0 pointer-events-none'"
            :style="collection[col] ? { backgroundColor: collection[col] } : {}"
            :title="collection[col] ? `${hue}.${col} · ${collection[col]}` : ''"
            @click="collection[col] && onSwatch(hue, col, collection[col]!)"
          />
        </template>
      </div>
    </div>

    <!-- Export button with inline copied indicator -->
    <div class="flex items-center gap-3">
      <button
        class="px-3 py-1.5 text-xs font-medium border border-divider rounded bg-transparent text-on-surface cursor-pointer hover:bg-surface-tint"
        @click="onExport"
      >
        Copy Config
      </button>

      <Transition name="fade">
        <span v-if="copied" class="text-xs op-60">
          Copied to clipboard
        </span>
      </Transition>
    </div>
  </div>
</template>
