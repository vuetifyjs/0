<script setup lang="ts">
  import { useMutationObserver } from '@vuetify/v0'
  import { ref, useTemplateRef } from 'vue'

  interface MutationEntry {
    type: string
    detail: string
  }

  const target = useTemplateRef<HTMLElement>('target')
  const mutations = ref<MutationEntry[]>([])
  const childCount = ref(0)

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
              detail: `text updated`,
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
  }

  function onRemoveChild () {
    const el = target.value
    if (!el?.lastElementChild) return
    el.lastElementChild.remove()
  }

  function onToggleAttribute () {
    const el = target.value
    if (!el) return
    el.toggleAttribute('data-highlighted')
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
        class="px-3 py-1.5 bg-secondary text-on-secondary rounded-md text-sm font-medium"
        @click="onRemoveChild"
      >
        Remove Child
      </button>

      <button
        class="px-3 py-1.5 bg-accent text-on-accent rounded-md text-sm font-medium"
        @click="onToggleAttribute"
      >
        Toggle Attribute
      </button>

      <button
        class="px-3 py-1.5 rounded-md text-sm font-medium border border-divider hover:bg-surface-tint"
        @click="isPaused ? resume() : pause()"
      >
        {{ isPaused ? 'Resume' : 'Pause' }}
      </button>
    </div>

    <div
      ref="target"
      class="min-h-16 p-3 rounded-lg border-2 border-dashed border-divider flex flex-wrap gap-2 items-start"
    >
      <span
        v-if="!target?.children.length"
        class="text-sm text-on-surface-variant opacity-60"
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
            'bg-accent/15 text-accent': entry.type === 'attributes',
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
