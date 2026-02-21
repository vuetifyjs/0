// Utilities
import { nextTick, shallowRef } from 'vue'

// Types
import type { ReplStore } from '@vue/repl'
import type { NestedContext } from '@vuetify/v0'

const PROTECTED = new Set(['src/App.vue', 'src/main.ts', 'src/uno.config.ts', 'import-map.json', 'tsconfig.json', 'src', '/'])
const VALID_EXT = /\.(vue|jsx?|tsx?|css|json)$/

const EXT_ICONS: Record<string, { icon: string, color: string }> = {
  vue: { icon: 'lang-vue', color: '#4FC08D' },
  ts: { icon: 'lang-ts', color: '#3179c7' },
  tsx: { icon: 'lang-ts', color: '#3179c7' },
  js: { icon: 'lang-js', color: '#d3b62a' },
  jsx: { icon: 'lang-js', color: '#d3b62a' },
  css: { icon: 'lang-css', color: '#1572B6' },
  json: { icon: 'lang-json', color: '#a57b39' },
}

export function useFileTreeCrud (tree: NestedContext, store: ReplStore) {
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
    if (PROTECTED.has(id)) return false
    if (tree.hasAncestor(id, '/')) return false
    if (!isFile(id) && (tree.children.get(id)?.length ?? 0) > 0) return false
    return true
  }

  function remove (id: string) {
    const wasActive = store.activeFile?.filename === id

    if (isFile(id)) {
      store.deleteFile(id)
    }

    tree.unregister(id)

    if (wasActive) {
      store.setActive('src/App.vue')
    }
  }

  return {
    creating,
    creatingType,
    pending,
    input,
    targetFolder,
    isFile,
    fileExt,
    add,
    confirm,
    cancel,
    deletable,
    remove,
  }
}
