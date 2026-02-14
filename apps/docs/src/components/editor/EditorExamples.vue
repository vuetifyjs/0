<script setup lang="ts">
  // Composables
  import { generateAppWrapper } from '@/composables/editorLink'

  const raw = import.meta.glob('@/examples/**/*.{vue,ts,js}', {
    query: '?raw',
    import: 'default',
  }) as Record<string, () => Promise<string>>

  interface ExampleFile {
    filename: string
    loader: () => Promise<string>
  }

  interface ExampleDir {
    dir: string
    label: string
    files: ExampleFile[]
  }

  interface ExampleCategory {
    label: string
    dirs: ExampleDir[]
  }

  const emit = defineEmits<{
    select: [files: Record<string, string>]
  }>()

  // Parse paths and group by directory (no code loaded yet)
  const dirMap = new Map<string, ExampleFile[]>()

  for (const [key, loader] of Object.entries(raw)) {
    const marker = '/examples/'
    const idx = key.indexOf(marker)
    if (idx === -1) continue

    const relPath = key.slice(idx + marker.length)
    const lastSlash = relPath.lastIndexOf('/')
    const dir = lastSlash === -1 ? '' : relPath.slice(0, lastSlash)
    const filename = lastSlash === -1 ? relPath : relPath.slice(lastSlash + 1)

    if (!dirMap.has(dir)) dirMap.set(dir, [])
    dirMap.get(dir)!.push({ filename, loader })
  }

  // Directories with non-vue helpers or PascalCase .vue files are
  // multi-file examples (e.g. create-context/ with context.ts + NotificationConsumer.vue).
  // Directories with only lowercase .vue files contain standalone examples.
  function isMultiFileExample (files: ExampleFile[]) {
    return files.some(f =>
      !f.filename.endsWith('.vue') || /^[A-Z]/.test(f.filename),
    )
  }

  // Build categories
  const ORDER = ['components', 'composables', 'guide']

  const categories: ExampleCategory[] = (() => {
    const grouped = new Map<string, ExampleDir[]>()

    for (const [dir, files] of dirMap) {
      if (!files.some(f => f.filename.endsWith('.vue'))) continue

      const parts = dir.split('/')
      const topLevel = parts[0]
      const dirLabel = parts.slice(1).join(' / ')

      if (!grouped.has(topLevel)) grouped.set(topLevel, [])

      if (isMultiFileExample(files)) {
        // Group all files as one example entry
        grouped.get(topLevel)!.push({ dir, label: dirLabel || dir, files })
      } else {
        // Each .vue file is its own example entry
        for (const file of files) {
          const name = file.filename.replace(/\.vue$/, '')
          grouped.get(topLevel)!.push({
            dir,
            label: dirLabel ? `${dirLabel} / ${name}` : name,
            files: [file],
          })
        }
      }
    }

    return ORDER
      .filter(cat => grouped.has(cat))
      .map(cat => ({
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
        dirs: grouped.get(cat)!.toSorted((a, b) => a.label.localeCompare(b.label)),
      }))
  })()

  async function select (dir: ExampleDir) {
    // Load all file contents in parallel
    const loaded = await Promise.all(
      dir.files.map(async f => ({
        filename: f.filename,
        code: await f.loader(),
      })),
    )

    const result: Record<string, string> = {}

    // Use the last directory segment as the nested folder name
    // e.g. 'components/dialog' → 'dialog'
    const parts = dir.dir.split('/')
    const folder = parts.at(-1)

    for (const file of loaded) {
      result[`src/${folder}/${file.filename}`] = file.code
    }

    // Generate App.vue wrapper if none exists
    const hasAppVue = loaded.some(f => f.filename.toLowerCase() === 'app.vue')
    if (!hasAppVue) {
      const vueFiles = loaded.filter(f => f.filename.endsWith('.vue'))
      const entry = vueFiles.find(f => /^[a-z]/.test(f.filename)) ?? vueFiles[0]
      if (entry) {
        result['src/App.vue'] = generateAppWrapper(`${folder}/${entry.filename}`)
      }
    }

    emit('select', result)
  }
</script>

<template>
  <div class="max-h-[400px] overflow-y-auto py-1">
    <div v-for="cat in categories" :key="cat.label" class="mb-1">
      <div class="px-3 py-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
        {{ cat.label }}
      </div>

      <button
        v-for="item in cat.dirs"
        :key="item.label"
        class="w-full text-left px-3 py-1.5 text-sm text-on-surface opacity-80 hover:opacity-100 hover:bg-surface-tint transition-colors cursor-pointer"
        @click="select(item)"
      >
        {{ item.label }}

        <span v-if="item.files.length > 1" class="text-xs text-on-surface-variant">
          {{ item.files.length }} files
        </span>
      </button>
    </div>
  </div>
</template>
