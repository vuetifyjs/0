<script setup lang="ts">
  // Framework
  import { createNested, useProxyRegistry } from '@vuetify/v0'

  // Utilities
  import { computed, nextTick, shallowRef } from 'vue'

  // Types
  import type { ReplStore } from '@vue/repl'

  const props = defineProps<{
    store: ReplStore
  }>()

  const tree = createNested()

  tree.onboard([
    {
      id: 'src',
      value: 'src',
      children: [
        { id: 'src/App.vue', value: 'App.vue' },
      ],
    },
    {
      id: 'project',
      value: 'project',
      children: [
        { id: 'src/main.ts', value: 'main.ts' },
        { id: 'src/uno.config.ts', value: 'uno.config.ts' },
        { id: 'import-map.json', value: 'import-map.json' },
        { id: 'tsconfig.json', value: 'tsconfig.json' },
      ],
    },
  ])

  tree.open('src')

  const proxy = useProxyRegistry(tree)
  const activeFile = computed(() => props.store.activeFile.filename)

  // ── CRUD State ─────────────────────────────────────────────────────────
  const creating = shallowRef<string | null>(null)
  const creatingType = shallowRef<'file' | 'folder'>('file')
  const pending = shallowRef('')
  const input = shallowRef<HTMLInputElement | null>(null)
  const targetFolder = shallowRef('src')

  const PROTECTED = new Set(['src/App.vue', 'src/main.ts', 'src/uno.config.ts', 'import-map.json', 'tsconfig.json', 'src', 'project'])
  const VALID_EXT = /\.(vue|jsx?|tsx?|css|json)$/

  function isFile (id: string) {
    return VALID_EXT.test(id)
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

  function fileExt (id: string) {
    const ext = id.split('.').pop()
    return ext ? EXT_ICONS[ext] : undefined
  }

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

  // ── CRUD Operations ────────────────────────────────────────────────────
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

    // Validate based on creation type
    if (type === 'file' && !VALID_EXT.test(last)) return

    // Create intermediate folders
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
      props.store.addFile(itemId)
      props.store.setActive(itemId)
    } else {
      tree.open(itemId)
    }
  }

  function cancel () {
    creating.value = null
    pending.value = ''
  }

  function deletable (id: string): boolean {
    if (PROTECTED.has(id)) return false
    if (tree.hasAncestor(id, 'project')) return false
    if (!isFile(id) && (tree.children.get(id)?.length ?? 0) > 0) return false
    return true
  }

  function remove (id: string) {
    const wasActive = activeFile.value === id

    if (isFile(id)) {
      props.store.deleteFile(id)
    }

    tree.unregister(id)

    if (wasActive) {
      props.store.setActive('src/App.vue')
    }
  }
</script>

<template>
  <nav class="w-[200px] border-r border-divider bg-surface overflow-y-auto shrink-0">
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
        :style="{ paddingLeft: `${tree.getDepth(id) * 12 + 8}px` }"
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
          class="shrink-0 opacity-0 group-hover/row:opacity-60 hover:!opacity-100 transition-opacity"
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
        :style="{ paddingLeft: `${(tree.getDepth(creating!) + 1) * 12 + 8}px` }"
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
