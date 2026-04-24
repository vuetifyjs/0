// Types
import type { FrameworkManifest } from '@/data/types'

interface PlaygroundHashData {
  files: Record<string, string>
  active?: string
  imports?: Record<string, string>
  settings?: {
    preset?: string
    addons?: string
  }
}

// Feature → category mapping for demo file generation
const CATEGORY_MAP: Record<string, string> = {
  // Selection
  createSelection: 'selection',
  createSingle: 'selection',
  createGroup: 'selection',
  createStep: 'selection',
  // Forms
  createForm: 'forms',
  createCombobox: 'forms',
  createSlider: 'forms',
  createRating: 'forms',
  // Data
  createDataTable: 'data',
  createFilter: 'data',
  createPagination: 'data',
  createVirtual: 'data',
  // Disclosure / overlay
  useStack: 'disclosure',
  useClickOutside: 'disclosure',
  usePopover: 'disclosure',
  // Observers
  useResizeObserver: 'observers',
  useIntersectionObserver: 'observers',
}

// Features that imply pinia addon
const PINIA_FEATURES = new Set(['useStorage'])

// Features that imply router addon
const ROUTER_FEATURES = new Set(['createStep'])

export function generateImports (): Record<string, string> {
  return {
    '@vuetify/v0': 'https://cdn.jsdelivr.net/npm/@vuetify/v0@latest/dist/index.mjs',
    '@vue/devtools-api': 'https://esm.sh/@vue/devtools-api@6',
  }
}

// ---- Demo file generators per category ----

function generateSelectionDemo (features: string[]): string {
  function has (f: string) {
    return features.includes(f)
  }

  if (has('createStep')) {
    return `<script setup lang="ts">
import { shallowRef } from 'vue'
import { createStep } from '@vuetify/v0'

const steps = ['Account', 'Profile', 'Review']
const step = createStep({ items: steps })
const content = shallowRef('Fill in your account details...')

function onNext () {
  step.next()
  updateContent()
}

function onPrev () {
  step.prev()
  updateContent()
}

function updateContent () {
  const labels: Record<string, string> = {
    Account: 'Fill in your account details...',
    Profile: 'Tell us about yourself...',
    Review: 'Everything looks good!',
  }
  content.value = labels[step.selected.value as string] ?? ''
}
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Stepper</h2>

    <div class="flex gap-2 mb-4">
      <button
        v-for="s in steps"
        :key="s"
        class="px-3 py-1.5 rounded text-sm transition-colors"
        :class="step.selected.value === s ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'"
        @click="step.select(s)"
      >
        {{ s }}
      </button>
    </div>

    <p class="text-on-surface-variant mb-4">{{ content }}</p>

    <div class="flex gap-2">
      <button
        class="px-4 py-2 rounded bg-surface-variant text-on-surface-variant disabled:opacity-40"
        :disabled="step.isFirst.value"
        @click="onPrev"
      >
        Previous
      </button>
      <button
        class="px-4 py-2 rounded bg-primary text-on-primary disabled:opacity-40"
        :disabled="step.isLast.value"
        @click="onNext"
      >
        Next
      </button>
    </div>
  </section>
</template>`
  }

  if (has('createGroup')) {
    return `<script setup lang="ts">
import { createGroup } from '@vuetify/v0'

const tags = ['Vue', 'React', 'Svelte', 'Angular', 'Solid']
const group = createGroup()
group.onboard(tags)
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Multi-Select Tags</h2>

    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="tag in tags"
        :key="tag"
        class="px-3 py-1.5 rounded-full text-sm transition-colors"
        :class="group.isSelected(tag) ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'"
        @click="group.toggle(tag)"
      >
        {{ tag }}
      </button>
    </div>

    <p class="text-sm text-on-surface-variant">
      Selected: {{ group.selected.value.length ? group.selected.value.join(', ') : 'None' }}
    </p>
  </section>
</template>`
  }

  if (has('createSingle') || has('createSelection')) {
    const factory = has('createSingle') ? 'createSingle' : 'createSelection'
    return `<script setup lang="ts">
import { ${factory} } from '@vuetify/v0'

const tabs = ['Overview', 'Features', 'Settings']
const single = ${factory}(${factory === 'createSingle' ? `{ mandatory: 'force' }` : ''})
single.onboard(tabs)
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Tab Selection</h2>

    <div class="flex border-b border-outline-variant mb-4">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="px-4 py-2 text-sm transition-colors border-b-2 -mb-px"
        :class="single.isSelected(tab) ? 'border-primary text-primary' : 'border-transparent text-on-surface-variant'"
        @click="single.select(tab)"
      >
        {{ tab }}
      </button>
    </div>

    <div class="p-4 bg-surface-variant rounded">
      <p class="text-on-surface-variant">
        Active tab: <strong>{{ single.selected.value }}</strong>
      </p>
    </div>
  </section>
</template>`
  }

  return ''
}

function generateFormDemo (features: string[]): string {
  function has (f: string) {
    return features.includes(f)
  }

  if (has('createForm')) {
    return `<script setup lang="ts">
import { shallowRef } from 'vue'
import { createForm } from '@vuetify/v0'

const name = shallowRef('')
const email = shallowRef('')
const submitted = shallowRef(false)

const form = createForm()

function onSubmit () {
  const { valid } = form.validate()
  if (valid) submitted.value = true
}

function onReset () {
  name.value = ''
  email.value = ''
  submitted.value = false
  form.reset()
}
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Form Validation</h2>

    <div v-if="submitted" class="p-4 rounded bg-primary/10 text-primary mb-4">
      Submitted! Name: {{ name }}, Email: {{ email }}
    </div>

    <form class="space-y-4" @submit.prevent="onSubmit">
      <div>
        <label class="block text-sm font-medium mb-1">Name</label>
        <input
          v-model="name"
          class="w-full px-3 py-2 rounded border border-outline bg-surface text-on-surface"
          placeholder="Your name"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          class="w-full px-3 py-2 rounded border border-outline bg-surface text-on-surface"
          placeholder="you@example.com"
        />
      </div>

      <div class="flex gap-2">
        <button type="submit" class="px-4 py-2 rounded bg-primary text-on-primary">
          Submit
        </button>
        <button type="button" class="px-4 py-2 rounded bg-surface-variant text-on-surface-variant" @click="onReset">
          Reset
        </button>
      </div>
    </form>
  </section>
</template>`
  }

  if (has('createSlider')) {
    return `<script setup lang="ts">
import { createSlider } from '@vuetify/v0'

const slider = createSlider({ min: 0, max: 100, step: 1 })
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Slider</h2>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2">
          Value: {{ slider.model.value }}
        </label>
        <input
          type="range"
          :min="slider.min.value"
          :max="slider.max.value"
          :step="slider.step.value"
          :value="slider.model.value"
          class="w-full"
          @input="slider.model.value = Number(($event.target as HTMLInputElement).value)"
        />
      </div>

      <p class="text-sm text-on-surface-variant">
        Progress: {{ slider.percentage.value }}%
      </p>
    </div>
  </section>
</template>`
  }

  if (has('createRating')) {
    return `<script setup lang="ts">
import { shallowRef } from 'vue'
import { createRating } from '@vuetify/v0'

const rating = createRating({ length: 5 })
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Rating</h2>

    <div class="flex gap-1 mb-2">
      <button
        v-for="i in 5"
        :key="i"
        class="text-2xl transition-colors"
        :class="i <= (rating.model.value ?? 0) ? 'text-amber-400' : 'text-surface-variant'"
        @click="rating.model.value = i"
      >
        ★
      </button>
    </div>

    <p class="text-sm text-on-surface-variant">
      Rating: {{ rating.model.value ?? 'None' }} / 5
    </p>
  </section>
</template>`
  }

  if (has('createCombobox')) {
    return `<script setup lang="ts">
import { shallowRef } from 'vue'
import { createCombobox } from '@vuetify/v0'

const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape']
const combobox = createCombobox({ items: fruits })
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Combobox</h2>

    <div class="relative">
      <input
        v-model="combobox.search.value"
        class="w-full px-3 py-2 rounded border border-outline bg-surface text-on-surface"
        placeholder="Search fruits..."
      />

      <ul v-if="combobox.filtered.value.length" class="mt-1 border border-outline rounded bg-surface max-h-48 overflow-auto">
        <li
          v-for="item in combobox.filtered.value"
          :key="item"
          class="px-3 py-2 cursor-pointer hover:bg-surface-variant text-on-surface"
          @click="combobox.select(item)"
        >
          {{ item }}
        </li>
      </ul>
    </div>

    <p class="text-sm text-on-surface-variant mt-2">
      Selected: {{ combobox.selected.value ?? 'None' }}
    </p>
  </section>
</template>`
  }

  return ''
}

function generateDataDemo (features: string[]): string {
  function has (f: string) {
    return features.includes(f)
  }

  if (has('createDataTable')) {
    return `<script setup lang="ts">
import { ref } from 'vue'
import { createDataTable } from '@vuetify/v0'

const items = ref([
  { id: 1, name: 'Alice', role: 'Engineer', status: 'Active' },
  { id: 2, name: 'Bob', role: 'Designer', status: 'Away' },
  { id: 3, name: 'Carol', role: 'PM', status: 'Active' },
  { id: 4, name: 'Dave', role: 'Engineer', status: 'Offline' },
  { id: 5, name: 'Eve', role: 'Designer', status: 'Active' },
])

const table = createDataTable({
  items,
  columns: ['name', 'role', 'status'],
})
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Data Table</h2>

    <div class="border border-outline rounded overflow-hidden">
      <table class="w-full">
        <thead class="bg-surface-variant">
          <tr>
            <th
              v-for="col in table.columns.value"
              :key="col"
              class="px-4 py-2 text-left text-sm font-medium text-on-surface-variant"
            >
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in table.rows.value"
            :key="row.id"
            class="border-t border-outline-variant"
          >
            <td class="px-4 py-2 text-sm text-on-surface">{{ row.name }}</td>
            <td class="px-4 py-2 text-sm text-on-surface">{{ row.role }}</td>
            <td class="px-4 py-2 text-sm text-on-surface">
              <span
                class="inline-block px-2 py-0.5 rounded-full text-xs"
                :class="row.status === 'Active' ? 'bg-primary/10 text-primary' : 'bg-surface-variant text-on-surface-variant'"
              >
                {{ row.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>`
  }

  if (has('createPagination') || has('createFilter') || has('createVirtual')) {
    const feature = has('createPagination') ? 'createPagination' : (has('createFilter') ? 'createFilter' : 'createVirtual')

    if (feature === 'createPagination') {
      return `<script setup lang="ts">
import { ref } from 'vue'
import { createPagination } from '@vuetify/v0'

const allItems = ref(Array.from({ length: 50 }, (_, i) => ({ id: i + 1, label: \`Item \${i + 1}\` })))
const pagination = createPagination({ items: allItems, itemsPerPage: 5 })
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Pagination</h2>

    <ul class="space-y-1 mb-4">
      <li
        v-for="item in pagination.pageItems.value"
        :key="item.id"
        class="px-3 py-2 rounded bg-surface-variant text-on-surface-variant text-sm"
      >
        {{ item.label }}
      </li>
    </ul>

    <div class="flex items-center gap-2">
      <button
        class="px-3 py-1 rounded bg-surface-variant text-on-surface-variant text-sm disabled:opacity-40"
        :disabled="pagination.page.value <= 1"
        @click="pagination.prev()"
      >
        Prev
      </button>
      <span class="text-sm text-on-surface-variant">
        Page {{ pagination.page.value }} of {{ pagination.pageCount.value }}
      </span>
      <button
        class="px-3 py-1 rounded bg-surface-variant text-on-surface-variant text-sm disabled:opacity-40"
        :disabled="pagination.page.value >= pagination.pageCount.value"
        @click="pagination.next()"
      >
        Next
      </button>
    </div>
  </section>
</template>`
    }

    if (feature === 'createFilter') {
      return `<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { createFilter } from '@vuetify/v0'

const items = ref([
  'Dashboard', 'Settings', 'Profile', 'Notifications',
  'Analytics', 'Reports', 'Users', 'Billing',
])

const filter = createFilter({ items })
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Filter</h2>

    <input
      v-model="filter.search.value"
      class="w-full px-3 py-2 rounded border border-outline bg-surface text-on-surface mb-4"
      placeholder="Search items..."
    />

    <ul class="space-y-1">
      <li
        v-for="item in filter.filtered.value"
        :key="item"
        class="px-3 py-2 rounded bg-surface-variant text-on-surface-variant text-sm"
      >
        {{ item }}
      </li>
    </ul>

    <p v-if="!filter.filtered.value.length" class="text-sm text-on-surface-variant italic">
      No matches found.
    </p>
  </section>
</template>`
    }

    return `<script setup lang="ts">
import { ref } from 'vue'
import { createVirtual } from '@vuetify/v0'

const items = ref(Array.from({ length: 10000 }, (_, i) => ({ id: i, label: \`Row \${i + 1}\` })))
const virtual = createVirtual({ items, itemHeight: 36 })
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Virtual Scroll (10,000 items)</h2>

    <div
      ref="virtual.containerRef"
      class="h-64 overflow-auto border border-outline rounded"
    >
      <div :style="{ height: virtual.totalHeight.value + 'px', position: 'relative' }">
        <div
          v-for="item in virtual.visibleItems.value"
          :key="item.id"
          class="px-3 py-2 text-sm text-on-surface absolute w-full"
          :style="{ top: item.offset + 'px', height: '36px' }"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
  </section>
</template>`
  }

  return ''
}

function generateDisclosureDemo (features: string[]): string {
  function has (f: string) {
    return features.includes(f)
  }

  if (has('usePopover')) {
    return `<script setup lang="ts">
import { shallowRef } from 'vue'
import { usePopover } from '@vuetify/v0'

const open = shallowRef(false)
const popover = usePopover()

function onToggle () {
  open.value = !open.value
}
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Popover</h2>

    <div class="relative inline-block">
      <button
        v-bind="popover.activatorAttrs.value"
        class="px-4 py-2 rounded bg-primary text-on-primary"
        @click="onToggle"
      >
        Toggle Popover
      </button>

      <div
        v-if="open"
        v-bind="popover.contentAttrs.value"
        class="absolute top-full mt-2 p-4 rounded-lg shadow-lg bg-surface border border-outline min-w-48 z-10"
      >
        <p class="text-sm text-on-surface font-medium mb-1">Popover Content</p>
        <p class="text-sm text-on-surface-variant">
          Positioned with usePopover. Click the button to dismiss.
        </p>
      </div>
    </div>
  </section>
</template>`
  }

  if (has('useStack') || has('useClickOutside')) {
    return `<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
${has('useClickOutside') ? `import { useClickOutside } from '@vuetify/v0'` : `import { useStack } from '@vuetify/v0'`}

const open = shallowRef(false)
${has('useClickOutside')
  ? `const dialog = useTemplateRef('dialog')

useClickOutside(dialog, () => {
  open.value = false
})`
  : ''}
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Dialog</h2>

    <button
      class="px-4 py-2 rounded bg-primary text-on-primary"
      @click="open = true"
    >
      Open Dialog
    </button>

    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="open = false" />
        <div
          ref="dialog"
          class="relative z-10 p-6 rounded-lg bg-surface shadow-xl max-w-sm w-full mx-4"
        >
          <h3 class="text-lg font-semibold text-on-surface mb-2">Dialog Title</h3>
          <p class="text-sm text-on-surface-variant mb-4">
            This dialog demonstrates overlay patterns with v0 composables.
          </p>
          <button
            class="px-4 py-2 rounded bg-primary text-on-primary"
            @click="open = false"
          >
            Close
          </button>
        </div>
      </div>
    </Teleport>
  </section>
</template>`
  }

  return ''
}

function generateObserverDemo (features: string[]): string {
  function has (f: string) {
    return features.includes(f)
  }

  if (has('useResizeObserver')) {
    return `<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useResizeObserver } from '@vuetify/v0'

const box = useTemplateRef('box')
const size = ref({ width: 0, height: 0 })

useResizeObserver(box, entries => {
  const entry = entries[0]
  size.value = {
    width: Math.round(entry.contentRect.width),
    height: Math.round(entry.contentRect.height),
  }
})
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Resize Observer</h2>

    <div
      ref="box"
      class="p-4 border-2 border-dashed border-outline rounded resize overflow-auto min-h-24 min-w-48 bg-surface-variant"
    >
      <p class="text-sm text-on-surface-variant">
        Drag the corner to resize. Current size: {{ size.width }} × {{ size.height }}px
      </p>
    </div>
  </section>
</template>`
  }

  if (has('useIntersectionObserver')) {
    return `<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useIntersectionObserver } from '@vuetify/v0'

const target = useTemplateRef('target')
const visible = shallowRef(false)

useIntersectionObserver(target, entries => {
  visible.value = entries[0].isIntersecting
})
</script>

<template>
  <section class="mb-8">
    <h2 class="text-lg font-semibold mb-4">Intersection Observer</h2>

    <p class="text-sm text-on-surface-variant mb-4">
      Scroll down to reveal the target element.
      Status: <strong :class="visible ? 'text-primary' : 'text-error'">{{ visible ? 'Visible' : 'Hidden' }}</strong>
    </p>

    <div class="h-48 overflow-auto border border-outline rounded p-4">
      <div class="h-64 flex items-end">
        <p class="text-sm text-on-surface-variant">↓ Keep scrolling...</p>
      </div>
      <div
        ref="target"
        class="p-4 rounded bg-primary/10 text-primary text-center"
      >
        🎯 You found me!
      </div>
    </div>
  </section>
</template>`
  }

  return ''
}

// ---- Category to generator + file name mapping ----

interface DemoConfig {
  file: string
  component: string
  generator: (features: string[]) => string
}

const DEMO_CONFIGS: DemoConfig[] = [
  { file: 'src/SelectionDemo.vue', component: 'SelectionDemo', generator: generateSelectionDemo },
  { file: 'src/FormDemo.vue', component: 'FormDemo', generator: generateFormDemo },
  { file: 'src/DataDemo.vue', component: 'DataDemo', generator: generateDataDemo },
  { file: 'src/DialogDemo.vue', component: 'DialogDemo', generator: generateDisclosureDemo },
  { file: 'src/ObserverDemo.vue', component: 'ObserverDemo', generator: generateObserverDemo },
]

function categorizeFeatures (features: string[]): Set<string> {
  const categories = new Set<string>()

  for (const feature of features) {
    const category = CATEGORY_MAP[feature]
    if (category) categories.add(category)
  }

  return categories
}

function generateAppVue (demos: Array<{ component: string, file: string }>, featureCount: number): string {
  const imports = demos
    .map(d => `import ${d.component} from './${d.component}.vue'`)
    .join('\n')

  const components = demos
    .map(d => `    <${d.component} />`)
    .join('\n')

  if (demos.length === 0) {
    return `<script setup lang="ts">
//
</script>

<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-2">Your v0 Framework</h1>
    <p class="text-on-surface-variant mb-8">
      ${featureCount} features loaded. Open any file to start building.
    </p>

    <div class="p-6 rounded-lg bg-surface-variant text-center">
      <p class="text-on-surface-variant">
        Your selected plugins are ready to use. Import composables from <code class="text-primary">'@vuetify/v0'</code> and start building.
      </p>
    </div>
  </div>
</template>`
  }

  return `<script setup lang="ts">
${imports}
</script>

<template>
  <div class="p-8 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-2">Your v0 Framework</h1>
    <p class="text-on-surface-variant mb-8">
      ${featureCount} features loaded. Edit any file to start building.
    </p>

${components}
  </div>
</template>`
}

export function generateFiles (manifest: FrameworkManifest): Record<string, string> {
  const allFeatures = [...manifest.features, ...manifest.resolved]
  const categories = categorizeFeatures(allFeatures)

  const files: Record<string, string> = {}
  const demos: Array<{ component: string, file: string }> = []

  for (const config of DEMO_CONFIGS) {
    // Check if any features match this demo's category
    const categoryKey = config.component
      .replace('Demo', '')
      .replace('Selection', 'selection')
      .replace('Form', 'forms')
      .replace('Data', 'data')
      .replace('Dialog', 'disclosure')
      .replace('Observer', 'observers')
      .toLowerCase()

    if (!categories.has(categoryKey)) continue

    const content = config.generator(allFeatures)
    if (!content) continue

    files[config.file] = content
    demos.push({ component: config.component, file: config.file })
  }

  files['src/App.vue'] = generateAppVue(demos, allFeatures.length)

  return files
}

function resolveAddons (features: string[]): string | undefined {
  const addons: string[] = []

  if (features.some(f => PINIA_FEATURES.has(f))) addons.push('pinia')
  if (features.some(f => ROUTER_FEATURES.has(f))) addons.push('router')

  return addons.length > 0 ? addons.join(',') : undefined
}

export function toHashData (manifest: FrameworkManifest): PlaygroundHashData {
  const allFeatures = [...manifest.features, ...manifest.resolved]
  const files = generateFiles(manifest)
  const addons = resolveAddons(allFeatures)

  return {
    files,
    active: 'src/App.vue',
    imports: generateImports(),
    settings: {
      preset: 'default',
      ...(addons ? { addons } : {}),
    },
  }
}

export async function encodeHash (data: PlaygroundHashData): Promise<string> {
  const { strToU8, strFromU8, zlibSync } = await import('fflate')
  const buffer = strToU8(JSON.stringify(data))
  const zipped = zlibSync(buffer, { level: 9 })
  const binary = strFromU8(zipped, true)
  return btoa(binary)
}

export async function toPlaygroundUrl (manifest: FrameworkManifest, baseUrl: string): Promise<string> {
  const data = toHashData(manifest)
  const hash = await encodeHash(data)
  return `${baseUrl}#${hash}`
}
