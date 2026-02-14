<script setup lang="ts">
  // Framework
  import { createNested, useProxyRegistry } from '@vuetify/v0'

  // Composables
  import { useFileTreeCrud } from '@/composables/useFileTreeCrud'

  // Utilities
  import { computed } from 'vue'

  // Types
  import type { ReplStore } from '@vue/repl'

  // Data
  import { INFRASTRUCTURE_FILES, REPL_BUILTIN_FILES } from '@/data/editor-defaults'

  const props = defineProps<{
    store: ReplStore
  }>()

  const tree = createNested()

  // Derive tree from store.files so it works with any loaded file set
  // Build nested tree structure from file paths
  // e.g. 'src/pagination/basic.vue' → src > pagination > basic.vue
  const srcFiles: string[] = []
  const projectFiles: string[] = []

  for (const [filename, file] of Object.entries(props.store.files)) {
    if (REPL_BUILTIN_FILES.includes(filename as typeof REPL_BUILTIN_FILES[number])) continue

    if (file.hidden) {
      // Show main.ts under src/, other infrastructure files under /
      if (filename === 'src/main.ts') {
        srcFiles.push(filename)
      } else if (INFRASTRUCTURE_FILES.has(filename)) {
        projectFiles.push(filename)
      }
      // Skip alias files created for REPL import resolution
    } else {
      srcFiles.push(filename)
    }
  }

  function buildChildren (files: string[], root: string) {
    const folders = new Set<string>()
    const direct: { id: string, value: string }[] = []

    for (const filepath of files) {
      // Strip root prefix (e.g. 'src/' → 'pagination/basic.vue')
      const rel = filepath.startsWith(root + '/') ? filepath.slice(root.length + 1) : filepath
      const slashIdx = rel.indexOf('/')

      if (slashIdx === -1) {
        // Direct child file
        direct.push({ id: filepath, value: rel })
      } else {
        // Nested — collect intermediate folder
        folders.add(rel.slice(0, slashIdx))
      }
    }

    const children: { id: string, value: string, children?: ReturnType<typeof buildChildren> }[] = []

    // Add folders first (sorted)
    for (const folder of [...folders].toSorted()) {
      const folderId = `${root}/${folder}`
      const nested = files.filter(f => f.startsWith(folderId + '/'))
      children.push({
        id: folderId,
        value: folder,
        children: buildChildren(nested, folderId),
      })
    }

    // Then direct files (sorted)
    children.push(...direct.toSorted((a, b) => a.value.localeCompare(b.value)))
    return children
  }

  tree.onboard([
    {
      id: 'src',
      value: 'src',
      children: buildChildren(srcFiles, 'src'),
    },
    {
      id: '/',
      value: '/',
      children: [
        ...projectFiles.map(f => ({ id: f, value: f.split('/').pop()! })),
        ...REPL_BUILTIN_FILES.map(f => ({ id: f, value: f })),
      ],
    },
  ])

  tree.open('src')

  // Auto-open all nested folders under src
  for (const id of tree.keys()) {
    const s = id as string
    if (s.startsWith('src/') && !/\.\w+$/.test(s)) {
      tree.open(id)
    }
  }

  const proxy = useProxyRegistry(tree)
  const activeFile = computed(() => props.store.activeFile?.filename)

  const {
    creating, creatingType, pending, input, targetFolder,
    isFile, fileExt, add, confirm, cancel, deletable, remove,
  } = useFileTreeCrud(tree, props.store)

  // ── Tree helpers ───────────────────────────────────────────────────────
  function getVisibleNodes (parentId?: string): string[] {
    const ids = parentId
      ? tree.children.get(parentId) ?? []
      : tree.roots.value.map(r => r.id)

    return (ids as string[]).flatMap(id => {
      const result = [id]
      if (!isFile(id) && tree.opened(id)) {
        result.push(...getVisibleNodes(id))
      }
      return result
    })
  }

  const visibleNodes = computed(() => {
    void proxy.keys.length
    return getVisibleNodes()
  })

  // ID after which the inline input should render (last visible descendant of creating folder)
  const inputAfter = computed(() => {
    const folder = creating.value
    if (!folder) return null

    const nodes = visibleNodes.value
    const folderIdx = nodes.indexOf(folder)
    if (folderIdx === -1) return null

    let lastIdx = folderIdx
    for (let i = folderIdx + 1; i < nodes.length; i++) {
      if (tree.hasAncestor(nodes[i], folder)) {
        lastIdx = i
      } else {
        break
      }
    }
    return nodes[lastIdx]
  })

  function onClick (id: string) {
    if (isFile(id)) {
      props.store.setActive(id)
      targetFolder.value = (tree.parents.get(id) as string) ?? 'src'
    } else {
      tree.flip(id)
      targetFolder.value = id
    }
  }
</script>

<template>
  <nav class="border-r border-divider bg-surface overflow-y-auto shrink-0">
    <div class="flex items-center justify-between px-3 py-2">
      <span class="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Files</span>

      <div class="flex items-center gap-1">
        <button
          class="opacity-50 hover:opacity-100 transition-opacity"
          title="New file"
          @click="add('file')"
        >
          <AppIcon icon="file-plus" :size="14" />
        </button>

        <button
          class="opacity-50 hover:opacity-100 transition-opacity"
          title="New folder"
          @click="add('folder')"
        >
          <AppIcon icon="folder-plus" :size="14" />
        </button>
      </div>
    </div>

    <template
      v-for="id in visibleNodes"
      :key="id"
    >
      <div
        class="group/row flex items-center gap-1.5 py-1 pr-2 text-sm cursor-pointer select-none hover:bg-surface-tint transition-colors"
        :class="isFile(id) && id === activeFile ? 'opacity-100 bg-surface-tint' : 'opacity-80'"
        :style="{ paddingLeft: `${tree.getDepth(id) * 8 + 8}px` }"
        @click="onClick(id)"
      >
        <template v-if="!isFile(id)">
          <AppIcon
            class="transition-transform duration-150"
            :class="{ 'rotate-90': tree.opened(id) }"
            icon="chevron-right"
            :size="14"
          />
          <AppIcon
            :icon="tree.opened(id) ? 'folder-open' : 'folder'"
            :size="14"
          />
        </template>
        <template v-else>
          <span class="w-[14px]" />
          <AppIcon
            v-if="fileExt(id)"
            :icon="fileExt(id)!.icon"
            :size="14"
            :style="{ color: fileExt(id)!.color }"
          />
          <span v-else class="w-[14px]" />
        </template>

        <span class="flex-1 truncate" :class="isFile(id) ? 'opacity-80' : 'font-medium opacity-60'">
          {{ tree.get(id)?.value }}
        </span>

        <!-- Delete item -->
        <button
          v-if="deletable(id)"
          class="shrink-0 inline-flex items-center justify-center opacity-0 group-hover/row:opacity-60 hover:!opacity-100 transition-opacity"
          title="Delete"
          @click.stop="remove(id)"
        >
          <AppIcon icon="close" :size="14" />
        </button>
      </div>

      <!-- Inline input at bottom of folder children -->
      <div
        v-if="inputAfter === id"
        class="flex items-center gap-1.5 py-1 pr-2"
        :style="{ paddingLeft: `${(tree.getDepth(creating!) + 1) * 8 + 8}px` }"
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
  </nav>
</template>
