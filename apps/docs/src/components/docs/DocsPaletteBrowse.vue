<script setup lang="ts">
  // Framework
  import { Select } from '@vuetify/v0'
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
    material: { label: 'Material 3', data: material as Record<string, Record<string, string>>, namespace: 'md' },
    radix: { label: 'Radix', data: radix as Record<string, Record<string, string>>, namespace: 'radix' },
    ant: { label: 'Ant Design', data: ant as Record<string, Record<string, string>>, namespace: 'ant' },
  }

  const ROLES = ['primary', 'secondary', 'accent', 'error', 'info', 'success', 'warning']

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

  // Clicked swatches mapped to theme roles, in click order — drives the summary chips and the export
  const selection = computed(() =>
    [...clicks.value].map(([path, hex], index) => ({
      path,
      hex,
      role: ROLES[index] ?? `color${index + 1}`,
    })),
  )

  // Fast path -> role lookup so each swatch can show whether it is picked
  const picked = computed(() => new Map(selection.value.map(entry => [entry.path, entry.role])))

  watch(selected, () => {
    clicks.value.clear()
  })

  function onSwatch (hue: string, shade: string, hex: string) {
    const path = `${hue}.${shade}`
    copy(path)
    clicks.value.set(path, hex)
  }

  function onRemove (path: string) {
    clicks.value.delete(path)
  }

  function onClear () {
    clicks.value.clear()
  }

  function onExport () {
    const ns = palette.value.namespace
    const name = selected.value

    const lines: string[] = []

    if (selection.value.length > 0) {
      // Each clicked swatch is already mapped to a role
      for (const { path, role } of selection.value) {
        lines.push(`          ${role}: '{palette.${ns}.${path}}',`)
      }
    } else {
      // No clicks: seed primary/secondary from real hues in this palette so the config resolves
      const shade = columns.value[Math.floor(columns.value.length / 2)]
      for (const [index, [hue, collection]] of rows.value.slice(0, 2).entries()) {
        const key = shade && collection[shade] ? shade : Object.keys(collection)[0]!
        lines.push(`          ${ROLES[index]}: '{palette.${ns}.${hue}.${key}}',`)
      }
    }

    let code = `import { ${name} } from '@vuetify/v0/palettes/${name}'\n\n`
    code += `app.use(\n  createThemePlugin({\n    palette: { ${ns}: ${name} },\n`
    code += `    themes: {\n      light: {\n        colors: {\n`
    code += `${lines.join('\n')}\n`
    code += `        },\n      },\n    },\n  })\n)`
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

      <Select.Root
        mandatory
        :model-value="selected"
        @update:model-value="selected = String($event)"
      >
        <Select.Activator class="h-[30px] px-2 text-xs font-medium bg-surface-tint border border-divider rounded inline-flex items-center gap-1 cursor-pointer">
          <Select.Value v-slot="{ selectedValue }">{{ PALETTES[String(selectedValue)]?.label }}</Select.Value>

          <Select.Cue v-slot="{ isOpen }" class="opacity-50">
            <AppChevron :open="isOpen" :size="12" vertical />
          </Select.Cue>
        </Select.Activator>

        <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
          <Select.Item
            v-for="(entry, key) in PALETTES"
            :id="key"
            :key
            v-slot="{ isSelected, isHighlighted }"
            :value="key"
          >
            <div
              class="px-3 py-1.5 rounded-md cursor-default select-none text-xs"
              :class="[
                isHighlighted ? 'bg-primary text-on-primary'
                : isSelected ? 'text-primary font-medium'
                  : 'text-on-surface hover:bg-surface-variant',
              ]"
            >
              {{ entry.label }}
            </div>
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>

    <!-- Hint -->
    <div class="text-xs op-60">
      Click a swatch to copy its token path and add it to the config. Then use <span class="font-medium">Copy Config</span> for a ready-to-paste theme.
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
            :class="[
              collection[tone] ? 'hover:opacity-80' : 'opacity-0 pointer-events-none',
              picked.has(`${hue}.${tone}`) && 'outline outline-2 -outline-offset-2 outline-on-surface',
            ]"
            :style="collection[tone] ? { backgroundColor: collection[tone] } : {}"
            :title="collection[tone] ? `${hue}.${tone} · ${collection[tone]}${picked.has(`${hue}.${tone}`) ? ` · ${picked.get(`${hue}.${tone}`)}` : ''}` : ''"
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
            :class="[
              collection[col] ? 'hover:opacity-80' : 'opacity-0 pointer-events-none',
              picked.has(`${hue}.${col}`) && 'outline outline-2 -outline-offset-2 outline-on-surface',
            ]"
            :style="collection[col] ? { backgroundColor: collection[col] } : {}"
            :title="collection[col] ? `${hue}.${col} · ${collection[col]}${picked.has(`${hue}.${col}`) ? ` · ${picked.get(`${hue}.${col}`)}` : ''}` : ''"
            @click="collection[col] && onSwatch(hue, col, collection[col]!)"
          />
        </template>
      </div>
    </div>

    <!-- Selection summary — which swatches are picked and the role each maps to -->
    <div v-if="selection.length > 0" class="flex flex-wrap items-center gap-2">
      <div
        v-for="item in selection"
        :key="item.path"
        class="inline-flex items-center gap-1.5 h-7 pl-1.5 pr-0.5 text-xs border border-divider rounded-full"
      >
        <span class="w-3 h-3 rounded-full border border-divider" :style="{ backgroundColor: item.hex }" />
        <span class="font-medium">{{ item.role }}</span>
        <span class="op-50 font-mono">{{ item.path }}</span>
        <AppCloseButton :label="`Remove ${item.role}`" size="sm" @click="onRemove(item.path)" />
      </div>

      <button
        class="text-xs op-60 hover:op-100 underline underline-offset-2 cursor-pointer bg-transparent border-0"
        @click="onClear"
      >
        Clear
      </button>
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
