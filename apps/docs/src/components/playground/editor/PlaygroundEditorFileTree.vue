<script setup lang="ts">
  // Framework
  import { createNested, isString } from '@vuetify/v0'

  // Components
  import { usePlayground } from '../app/PlaygroundApp.vue'

  // Utilities
  import { computed, nextTick, shallowRef, useTemplateRef, watch } from 'vue'

  // Data
  import { REPL_BUILTIN_FILES } from '@/data/playground-defaults'

  const playground = usePlayground()
  const store = playground.store
  const isReady = playground.isReady
  const activeFile = computed(() => store.activeFile?.filename)

  const tree = createNested()

  function buildChildren (files: string[], root: string) {
    const folders = new Set<string>()
    const direct: { id: string, value: string }[] = []

    for (const filepath of files) {
      const rel = filepath.startsWith(root + '/') ? filepath.slice(root.length + 1) : filepath
      const slashIndex = rel.indexOf('/')

      if (slashIndex === -1) {
        direct.push({ id: filepath, value: rel })
      } else {
        folders.add(rel.slice(0, slashIndex))
      }
    }

    const children: { id: string, value: string, children?: ReturnType<typeof buildChildren> }[] = []

    for (const folder of [...folders].toSorted()) {
      const folderId = `${root}/${folder}`
      const nested = files.filter(f => f.startsWith(folderId + '/'))
      children.push({
        id: folderId,
        value: folder,
        children: buildChildren(nested, folderId),
      })
    }

    children.push(...direct.toSorted((a, b) => a.value.localeCompare(b.value)))
    return children
  }

  watch(isReady, ready => {
    if (!ready) return

    const srcFiles: string[] = []
    for (const [filename, file] of Object.entries(store.files)) {
      if (REPL_BUILTIN_FILES.includes(filename as typeof REPL_BUILTIN_FILES[number])) continue
      if (!file.hidden) srcFiles.push(filename)
    }

    tree.onboard([{
      id: 'src',
      value: 'src',
      children: buildChildren(srcFiles, 'src'),
    }])

    tree.open('src')

    for (const id of tree.keys()) {
      if (!isString(id)) continue
      if (id.startsWith('src/') && !/\.\w+$/.test(id)) tree.open(id)
    }
  }, { immediate: true })

  const PROTECTED = new Set(['src/App.vue', 'src/main.ts', 'src/uno.config.ts', 'import-map.json', 'tsconfig.json', 'src', '/'])
  const VALID_EXT = /\.(vue|jsx?|tsx?|css|json)$/

  const CONFIG_FILES: { id: string, value: string, parentId?: string }[] = [
    { id: 'src/main.ts', value: 'main.ts', parentId: 'src' },
    { id: 'src/uno.config.ts', value: 'uno.config.ts', parentId: 'src' },
    { id: 'import-map.json', value: 'import-map.json' },
  ]

  const CONFIG_IDS = new Set(CONFIG_FILES.map(f => f.id))

  const showConfig = shallowRef(false)

  function toggleConfig () {
    showConfig.value = !showConfig.value
    if (showConfig.value) {
      for (const file of CONFIG_FILES) {
        tree.register(file)
      }
    } else {
      if (CONFIG_IDS.has(activeFile.value ?? '')) {
        store.setActive('src/App.vue')
      }
      for (const file of CONFIG_FILES) {
        tree.unregister(file.id)
      }
    }
  }

  function isConfig (id: string) {
    return CONFIG_IDS.has(id)
  }

  const EXT_ICONS: Record<string, { icon: string, color: string }> = {
    vue: { icon: 'lang-vue', color: '#4FC08D' },
    ts: { icon: 'lang-ts', color: '#3179c7' },
    tsx: { icon: 'lang-ts', color: '#3179c7' },
    js: { icon: 'lang-js', color: '#d3b62a' },
    jsx: { icon: 'lang-js', color: '#d3b62a' },
    css: { icon: 'lang-css', color: '#1572B6' },
    json: { icon: 'lang-json', color: '#a57b39' },
  }

  const creating = shallowRef<string | null>(null)
  const creatingType = shallowRef<'file' | 'folder'>('file')
  const pending = shallowRef('')
  const input = shallowRef<HTMLInputElement | null>(null)
  const targetFolder = shallowRef('src')

  function isFile (id: string) {
    return VALID_EXT.test(id)
  }

  function fileExt (id: string) {
    const ext = id.split('.').pop()
    return ext ? EXT_ICONS[ext] : undefined
  }

  function add (type: 'file' | 'folder') {
    creating.value = targetFolder.value
    creatingType.value = type
    pending.value = ''
    tree.open(targetFolder.value)
    nextTick(() => input.value?.focus())
  }

  function confirm () {
    const raw = pending.value.trim()
    const folder = creating.value
    const type = creatingType.value

    cancel()

    if (!raw || !folder) return

    const segments = raw.split('/').filter(Boolean)
    const last = segments.pop()!
    let parentId = folder

    if (type === 'file' && !VALID_EXT.test(last)) return

    for (const seg of segments) {
      const folderId = `${parentId}/${seg}`
      if (!tree.has(folderId)) {
        tree.register({ id: folderId, value: seg, parentId })
      }
      tree.open(folderId)
      parentId = folderId
    }

    const itemId = `${parentId}/${last}`
    if (tree.has(itemId)) return

    tree.register({ id: itemId, value: last, parentId })

    if (type === 'file') {
      store.addFile(itemId)
      if (itemId.endsWith('.vue')) {
        store.files[itemId]!.code = '<script setup lang="ts"><' + '/script>\n\n<template>\n  <div>\n    <slot />\n  </div>\n</template>\n'
      }
      store.setActive(itemId)
    } else {
      tree.open(itemId)
    }
  }

  function cancel () {
    creating.value = null
    pending.value = ''
  }

  function deletable (id: string): boolean {
    return !PROTECTED.has(id)
  }

  function removeRecursive (id: string) {
    for (const child of (tree.children.get(id) ?? [])) {
      removeRecursive(String(child))
    }
    if (isFile(id)) {
      store.deleteFile(id)
    }
    tree.unregister(id)
  }

  function remove (id: string) {
    const active = activeFile.value
    const wasActive = isFile(id)
      ? active === id
      : !!(active && active.startsWith(id + '/'))

    removeRecursive(id)

    if (wasActive) {
      store.setActive('src/App.vue')
    }
  }

  function getVisibleNodes (parentId?: string, depth = 0): {
    id: string
    depth: number
    ext?: {
      icon: string
      color: string
    }
  }[] {
    const ids = parentId
      ? tree.children.get(parentId) ?? []
      : tree.roots.value.map(r => r.id)

    return (ids as readonly (string | number)[]).flatMap(id => {
      const sid = String(id)
      const result: { id: string, depth: number, ext?: { icon: string, color: string } }[] = [{ id: sid, depth, ext: isFile(sid) ? fileExt(sid) : undefined }]
      if (!isFile(sid) && tree.opened(id)) {
        result.push(...getVisibleNodes(sid, depth + 1))
      }
      return result
    })
  }

  const visibleNodes = computed(() => {
    return getVisibleNodes()
  })

  const inputAfter = computed(() => {
    const folder = creating.value
    if (!folder) return null

    const nodes = visibleNodes.value
    const folderIndex = nodes.findIndex(n => n.id === folder)
    if (folderIndex === -1) return null

    const inputDepth = nodes[folderIndex]!.depth + 1
    let lastIdx = folderIndex
    for (let i = folderIndex + 1; i < nodes.length; i++) {
      if (tree.hasAncestor(nodes[i]!.id, folder)) {
        lastIdx = i
      } else {
        break
      }
    }
    return { id: nodes[lastIdx]!.id, inputDepth }
  })

  const treeEl = useTemplateRef<HTMLElement>('tree-el')

  function activate (id: string) {
    if (isFile(id)) {
      store.setActive(id)
      const parent = tree.parents.get(id)
      targetFolder.value = (isString(parent) ? parent : null) ?? 'src'
    } else {
      tree.flip(id)
      targetFolder.value = id
    }
  }

  function focusNode (id: string) {
    nextTick(() => {
      const el = treeEl.value?.querySelector(`[data-id="${CSS.escape(id)}"]`) as HTMLElement | null
      el?.focus()
    })
  }

  function onKeydown (e: KeyboardEvent, id: string) {
    const nodes = visibleNodes.value
    const idx = nodes.findIndex(n => n.id === id)

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault()
        const next = nodes[idx + 1]
        if (next) focusNode(next.id)
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const prev = nodes[idx - 1]
        if (prev) focusNode(prev.id)
        break
      }
      case 'ArrowRight': {
        e.preventDefault()
        if (!isFile(id)) {
          if (tree.opened(id)) {
            const first = nodes[idx + 1]
            if (first && tree.hasAncestor(first.id, id)) focusNode(first.id)
          } else {
            tree.open(id)
          }
        }
        break
      }
      case 'ArrowLeft': {
        e.preventDefault()
        if (!isFile(id) && tree.opened(id)) {
          tree.close(id)
        } else {
          const parent = tree.parents.get(id)
          if (isString(parent) && parent !== 'src') focusNode(parent)
        }
        break
      }
      case 'Enter':
      case ' ': {
        e.preventDefault()
        activate(id)
        break
      }
      case 'Home': {
        e.preventDefault()
        if (nodes.length > 0) focusNode(nodes[0]!.id)
        break
      }
      case 'End': {
        e.preventDefault()
        if (nodes.length > 0) focusNode(nodes.at(-1)!.id)
        break
      }
    }
  }
</script>

<template>
  <nav
    v-if="isReady"
    ref="tree-el"
    aria-label="File browser"
    class="border-r border-divider bg-surface overflow-y-auto shrink-0 h-100%"
  >
    <div class="flex items-center justify-between px-3 py-2">
      <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Files</span>

      <div class="flex items-center gap-1.5">
        <button
          aria-label="New file"
          class="opacity-50 hover:opacity-100 transition-opacity"
          title="New file"
          @click="add('file')"
        >
          <AppIcon icon="file-plus" :size="14" />
        </button>

        <button
          aria-label="New folder"
          class="opacity-50 hover:opacity-100 transition-opacity"
          title="New folder"
          @click="add('folder')"
        >
          <AppIcon icon="folder-plus" :size="14" />
        </button>

        <div class="w-px h-3 bg-divider mx-0.5" />

        <button
          :aria-label="showConfig ? 'Hide config files' : 'Show config files'"
          class="transition-opacity"
          :class="showConfig ? 'opacity-100' : 'opacity-50 hover:opacity-100'"
          title="Toggle config files"
          @click="toggleConfig"
        >
          <AppIcon icon="cog" :size="14" />
        </button>
      </div>
    </div>

    <div aria-label="Project files" role="tree">
      <template
        v-for="({ id, depth, ext }, index) in visibleNodes"
        :key="id"
      >
        <div
          :aria-expanded="!isFile(id) ? tree.opened(id) : undefined"
          :aria-selected="isFile(id) && id === activeFile ? true : undefined"
          class="group/row flex items-center gap-1.5 py-1 pr-2 text-sm cursor-pointer select-none hover:bg-surface-tint transition-colors"
          :class="isFile(id) && id === activeFile ? 'opacity-100 bg-surface-tint' : isConfig(id) ? 'opacity-50' : 'opacity-80'"
          :data-id="id"
          role="treeitem"
          :style="{ paddingLeft: `${depth * 8 + 8}px` }"
          :tabindex="index === 0 ? 0 : -1"
          @click="activate(id)"
          @keydown="onKeydown($event, id)"
        >
          <template v-if="!isFile(id)">
            <!-- <AppIcon
              class="transition-transform duration-150"
              :class="{ 'rotate-90': tree.opened(id) }"
              icon="chevron-right"
              :size="14"
            /> -->
            <AppIcon
              :icon="tree.opened(id) ? 'folder-open' : 'folder'"
              :size="14"
            />
          </template>
          <template v-else>
            <AppIcon
              v-if="ext"
              :icon="ext.icon"
              :size="14"
              :style="{ color: ext.color }"
            />
            <span v-else class="w-[14px]" />
          </template>

          <span class="flex-1 truncate" :class="isFile(id) ? 'opacity-80' : 'font-medium opacity-60'">
            {{ tree.get(id)?.value }}
          </span>

          <button
            v-if="deletable(id)"
            :aria-label="`Delete ${tree.get(id)?.value}`"
            class="shrink-0 inline-flex items-center justify-center opacity-0 group-hover/row:opacity-60 hover:!opacity-100 transition-opacity"
            title="Delete"
            @click.stop="remove(id)"
          >
            <AppIcon icon="close" :size="14" />
          </button>
        </div>

        <div
          v-if="inputAfter?.id === id"
          class="flex items-center gap-1.5 py-1 pr-2"
          :style="{ paddingLeft: `${inputAfter!.inputDepth * 8 + 8}px` }"
        >
          <span class="w-[14px]" />
          <input
            :ref="el => input = el as HTMLInputElement"
            v-model="pending"
            class="flex-1 min-w-0 bg-transparent text-sm text-on-surface outline-none border-b border-primary"
            :placeholder="creatingType === 'file' ? 'filename.vue' : 'folder-name'"
            @blur="confirm"
            @keydown.enter="confirm"
            @keydown.esc="cancel"
          >
        </div>
      </template>
    </div>
  </nav>
</template>
