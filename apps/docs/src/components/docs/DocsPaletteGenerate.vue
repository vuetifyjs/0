<script setup lang="ts">
  // Framework
  import { IN_BROWSER, useTimer } from '@vuetify/v0'
  import { ant as generateAnt } from '@vuetify/v0/palettes/ant/generate'
  import { leonardo as generateLeonardo } from '@vuetify/v0/palettes/leonardo/generate'
  import { material as generateMaterial } from '@vuetify/v0/palettes/material/generate'

  // Context
  import DocsPalettePreview from './DocsPalettePreview.vue'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  // Utilities
  import { onMounted, shallowRef, watch } from 'vue'

  // Types
  import type { PaletteDefinition } from '@vuetify/v0/palettes'
  import type { MaterialGenerateOptions } from '@vuetify/v0/palettes/material/generate'

  const seed = shallowRef('#6750A4')
  const adapter = shallowRef<'material' | 'ant' | 'leonardo'>('material')
  const variant = shallowRef<MaterialGenerateOptions['variant']>('tonalSpot')
  const result = shallowRef<PaletteDefinition | null>(null)
  const { copied, copy } = useClipboard()

  const ADAPTERS = [
    { key: 'material' as const, label: 'Material' },
    { key: 'ant' as const, label: 'Ant Design' },
    { key: 'leonardo' as const, label: 'Leonardo' },
  ]

  const VARIANTS: MaterialGenerateOptions['variant'][] = [
    'tonalSpot',
    'vibrant',
    'expressive',
    'fidelity',
    'monochrome',
    'neutral',
  ]

  function run () {
    if (!IN_BROWSER) return

    try {
      if (adapter.value === 'material') {
        result.value = generateMaterial(seed.value, { variant: variant.value })
      } else if (adapter.value === 'ant') {
        result.value = generateAnt(seed.value)
      } else {
        result.value = generateLeonardo(seed.value)
      }
    } catch {
      // Keep last valid result on error
    }
  }

  const { start: generate } = useTimer(run, { duration: 300 })

  watch([seed, adapter, variant], () => generate())
  onMounted(() => run())

  function onExport () {
    const name = adapter.value
    const importPath = `@vuetify/v0/palettes/${name}/generate`
    let code = `import { ${name} } from '${importPath}'\n\n`
    code += `const { palette, themes } = ${name}('${seed.value}'`

    if (name === 'material') {
      code += `, { variant: '${variant.value}' }`
    }

    code += `)\n\napp.use(createThemePlugin({ palette, themes }))`
    copy(code)
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Header -->
    <div class="text-xs uppercase tracking-wider font-semibold op-60">
      Generate from Seed
    </div>

    <!-- Controls -->
    <div class="flex flex-col gap-3">
      <!-- Seed color -->
      <div class="flex items-center gap-2">
        <input
          v-model="seed"
          class="w-[30px] h-[30px] rounded cursor-pointer border border-divider p-0"
          type="color"
        >

        <input
          v-model="seed"
          class="font-mono w-24 h-[30px] px-2 text-xs bg-surface-tint border border-divider rounded"
          type="text"
        >
      </div>

      <!-- Adapter pills -->
      <div class="flex flex-wrap gap-1.5">
        <button
          v-for="a in ADAPTERS"
          :key="a.key"
          class="px-3 py-1 text-xs font-medium rounded-full cursor-pointer border border-solid"
          :class="adapter === a.key
            ? 'bg-primary text-on-primary border-primary'
            : 'bg-surface-tint border-divider text-on-surface-variant'"
          @click="adapter = a.key"
        >
          {{ a.label }}
        </button>
      </div>

      <!-- Variant pills (material only) -->
      <div v-if="adapter === 'material'" class="flex flex-wrap gap-1.5">
        <button
          v-for="v in VARIANTS"
          :key="v"
          class="px-2.5 py-1 text-xs font-medium rounded-full cursor-pointer border border-solid"
          :class="variant === v
            ? 'bg-primary text-on-primary border-primary'
            : 'bg-surface-tint border-divider text-on-surface-variant'"
          @click="variant = v"
        >
          {{ v }}
        </button>
      </div>
    </div>

    <!-- Preview -->
    <DocsPalettePreview v-if="result" :definition="result" />

    <!-- Export button -->
    <div>
      <button
        class="px-3 py-1.5 text-xs font-medium border border-divider rounded bg-transparent text-on-surface cursor-pointer hover:bg-surface-tint"
        @click="onExport"
      >
        {{ copied ? 'Copied!' : 'Copy Config' }}
      </button>
    </div>
  </div>
</template>
