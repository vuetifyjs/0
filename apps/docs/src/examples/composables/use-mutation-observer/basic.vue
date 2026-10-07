<script setup lang="ts">
  import { useMutationObserver } from '@vuetify/v0'
  import { ref, shallowRef, useTemplateRef } from 'vue'

  interface MutationEntry {
    type: string
    detail: string
  }

  const target = useTemplateRef<HTMLElement>('target')
  const mutations = ref<MutationEntry[]>([])
  const childCount = shallowRef(0)
  const activeChildren = shallowRef(0)
  let edits = 0

  const { isPaused, pause, resume } = useMutationObserver(
    target,
    entries => {
      for (const mutation of entries) {
        switch (mutation.type) {
          case 'childList': {
            mutations.value = [...mutations.value, {
              type: 'childList',
              detail: `+${mutation.addedNodes.length} / -${mutation.removedNodes.length} nodes`,
            }]

            break
          }
          case 'attributes': {
            mutations.value = [...mutations.value, {
              type: 'attributes',
              detail: `${mutation.attributeName} changed`,
            }]

            break
          }
          case 'characterData': {
            mutations.value = [...mutations.value, {
              type: 'characterData',
              detail: 'text updated',
            }]

            break
          }
        // No default
        }
      }
    },
    {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
    },
  )

  function onAddChild () {
    const el = target.value
    if (!el) return
    const child = document.createElement('div')
    childCount.value++
    child.textContent = `Child ${childCount.value}`
    child.className = 'px-3 py-1 rounded bg-surface-variant text-on-surface-variant text-sm'
    el.append(child)
    activeChildren.value++
  }

  function onRemoveChild () {
    const el = target.value
    if (!el || activeChildren.value === 0) return
    el.lastElementChild?.remove()
    activeChildren.value--
  }

  function onToggleAttribute () {
    const el = target.value
    if (!el) return
    el.toggleAttribute('data-highlighted')
  }

  function onUpdateText () {
    const text = target.value?.lastElementChild?.firstChild
    if (text?.nodeType !== Node.TEXT_NODE) return
    edits++
    const base = (text.nodeValue ?? 'Child').replace(/ · edit \d+$/, '')
    text.nodeValue = `${base} · edit ${edits}`
  }

  function onClear () {
    mutations.value = []
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap gap-2">
      <button
        class="px-3 py-1.5 bg-primary text-on-primary rounded-md text-sm font-medium"
        @click="onAddChild"
      >
        Add Child
      </button>

      <button
        class="px-3 py-1.5 bg-secondary text-on-secondary rounded-md text-sm font-medium disabled:opacity-50 disabled:pointer-events-none"
        :disabled="activeChildren === 0"
        @click="onRemoveChild"
      >
        Remove Child
      </button>

      <button
        class="px-3 py-1.5 bg-info text-on-info rounded-md text-sm font-medium"
        @click="onToggleAttribute"
      >
        Toggle Attribute
      </button>

      <button
        class="px-3 py-1.5 bg-warning text-on-warning rounded-md text-sm font-medium disabled:opacity-50 disabled:pointer-events-none"
        :disabled="activeChildren === 0"
        @click="onUpdateText"
      >
        Update Text
      </button>

      <button
        class="px-3 py-1.5 rounded-md text-sm font-medium border border-divider hover:bg-surface-tint"
        @click="isPaused ? resume() : pause()"
      >
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
    </div>

    <div class="relative">
      <div
        ref="target"
        class="p-3 rounded-lg border-2 border-dashed border-divider flex flex-wrap gap-2 items-start data-[highlighted]:border-primary data-[highlighted]:bg-primary/10"
      />

      <span
        v-if="activeChildren === 0"
        class="absolute inset-0 flex items-center px-3 text-sm text-on-surface-variant opacity-60 pointer-events-none"
      >
        Add children to observe mutations
      </span>
    </div>

    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-on-surface">
        Mutation Log ({{ mutations.length }})
      </span>

      <button
        class="text-xs text-on-surface-variant hover:text-on-surface"
        @click="onClear"
      >
        Clear
      </button>
    </div>

    <div class="max-h-48 overflow-y-auto rounded-lg border border-divider divide-y divide-divider">
      <div
        v-for="(entry, index) in mutations"
        :key="index"
        class="flex items-center gap-3 px-3 py-2 text-sm"
      >
        <span
          class="px-2 py-0.5 rounded text-xs font-mono"
          :class="{
            'bg-primary/15 text-primary': entry.type === 'childList',
            'bg-info/15 text-info': entry.type === 'attributes',
            'bg-warning/15 text-warning': entry.type === 'characterData',
          }"
        >
          {{ entry.type }}
        </span>

        <span class="text-on-surface-variant">{{ entry.detail }}</span>
      </div>

      <div
        v-if="mutations.length === 0"
        class="px-3 py-4 text-sm text-on-surface-variant text-center opacity-60"
      >
        No mutations recorded yet
      </div>
    </div>

    <p
      v-if="isPaused"
      class="text-xs text-warning text-center"
    >
      Observer paused — mutations will not be recorded
    </p>
  </div>
</template>
