<script setup lang="ts">
  // Framework
  import { useTimer } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppSkeleton from '@/components/app/AppSkeleton.vue'
  import AppTooltip from '@/components/app/AppTooltip.vue'

  // Utilities
  import { shallowRef } from 'vue'

  // Types
  import type { RegistryExample, RegistryItem } from '@/data/registry'

  const {
    item,
    loading = false,
    error,
    opening = false,
    activeId,
    /** Show `npx @vuetify/cli add …` copy affordance (v0 registry only). */
    cli = false,
  } = defineProps<{
    item?: RegistryItem
    loading?: boolean
    error?: string
    opening?: boolean
    /** Example id currently loaded in the editor. */
    activeId?: string
    cli?: boolean
  }>()

  const emit = defineEmits<{
    open: [example: RegistryExample]
    retry: []
  }>()

  const copiedId = shallowRef<string>()

  const { start: clearCopied } = useTimer(() => {
    copiedId.value = undefined
  }, { duration: 1600 })

  function isActive (example: RegistryExample) {
    if (!activeId) return false
    return example.id === activeId
      || example.id === activeId.replace(/\.vue$/i, '')
      || `${example.id}.vue` === activeId
  }

  /** Same form as docs: `npx @vuetify/cli add <feature> [--example <id>]`. */
  function addCommand (feature: string, exampleId: string) {
    const base = `npx @vuetify/cli add ${feature}`
    if (!exampleId || exampleId === 'basic') return base
    return `${base} --example ${exampleId}`
  }

  async function onCopy (example: RegistryExample) {
    if (!item) return

    const command = addCommand(item.name, example.id)
    try {
      await navigator.clipboard.writeText(command)
      copiedId.value = example.id
      clearCopied()
    } catch {
      // Clipboard may be denied
    }
  }

  /**
   * Left-anchored fan (max 4 slots): first card sits flat, each extra fans
   * up/right. 4+ files → fourth card is a dimmed dotted overflow marker.
   */
  function fanSlots (count: number): { angle: number, x: number, y: number, overflow: boolean }[] {
    const n = Math.max(1, Math.min(4, count || 1))
    // Leftmost is always 0° / base position; fan continues to the right.
    const layout = {
      1: [{ angle: 0, x: 0, y: 0 }],
      2: [
        { angle: 0, x: 0, y: 0 },
        { angle: 14, x: 5, y: -1 },
      ],
      3: [
        { angle: 0, x: 0, y: 0 },
        { angle: 12, x: 4, y: -1 },
        { angle: 24, x: 8, y: -2 },
      ],
      4: [
        { angle: 0, x: 0, y: 0 },
        { angle: 10, x: 4, y: -1 },
        { angle: 20, x: 8, y: -2 },
        { angle: 30, x: 12, y: -3 },
      ],
    }[n as 1 | 2 | 3 | 4]!

    return layout.map((slot, index) => ({
      ...slot,
      overflow: count >= 4 && index === 3,
    }))
  }

  function fileCountLabel (count: number) {
    return count === 1 ? '1 file' : `${count} files`
  }
</script>

<template>
  <div v-if="loading" class="p-4">
    <AppSkeleton height="h-10" :lines="4" />
  </div>

  <div
    v-else-if="error"
    class="p-8 text-center flex flex-col gap-2 items-center"
  >
    <p class="text-sm text-on-surface-variant">{{ error }}</p>

    <button
      class="text-xs font-medium text-primary hover:underline"
      type="button"
      @click="emit('retry')"
    >
      Retry
    </button>
  </div>

  <ul
    v-else-if="item"
    class="p-2 flex flex-col gap-0.5 list-none m-0"
  >
    <li
      v-for="example in item.examples"
      :key="example.id"
      class="rounded-md border transition-colors"
      :class="isActive(example)
        ? 'border-primary/70 bg-primary/5 ring-1 ring-primary/25'
        : 'border-transparent hover:border-primary/40 hover:bg-surface-tint/50'"
    >
      <button
        :aria-current="isActive(example) ? 'true' : undefined"
        class="w-full flex items-center gap-3 text-left px-3 py-2 transition-colors disabled:opacity-50 overflow-visible"
        :class="isActive(example)
          ? 'cursor-default'
          : opening
            ? 'cursor-wait'
            : 'cursor-pointer'"
        :disabled="opening || isActive(example)"
        type="button"
        @click="emit('open', example)"
      >
        <span class="min-w-0 flex-1">
          <span class="flex items-center gap-2 min-w-0">
            <span
              class="text-sm font-medium truncate"
              :class="isActive(example) ? 'text-primary' : 'text-on-surface'"
            >
              {{ example.title || example.id }}
            </span>

            <span
              v-if="isActive(example)"
              class="shrink-0 text-[9px] font-medium uppercase tracking-wide text-primary px-1.5 py-0.5 rounded bg-primary/10"
            >
              Active
            </span>
          </span>
        </span>

        <span
          :aria-label="fileCountLabel(example.files.length)"
          class="relative shrink-0 w-11 h-9 overflow-visible"
          role="img"
        >
          <span
            v-for="(slot, index) in fanSlots(example.files.length)"
            :key="index"
            class="absolute left-0.5 bottom-0.5 flex items-center justify-center size-6 rounded-[4px] bg-surface shadow-sm origin-bottom-left"
            :class="slot.overflow
              ? 'border border-dashed border-on-surface-variant/45 text-on-surface-variant/40'
              : 'border border-divider text-on-surface-variant'"
            :style="{
              zIndex: index + 1,
              transform: `translate(${slot.x}px, ${slot.y}px) rotate(${slot.angle}deg)`,
            }"
          >
            <AppIcon icon="file" :size="14" />
          </span>
        </span>
      </button>

      <div
        v-if="cli"
        class="px-3 pb-2 -mt-0.5 min-w-0"
      >
        <AppTooltip
          as="button"
          class="max-w-full text-left bg-transparent border-0 p-0 cursor-pointer rounded"
          :open-delay="200"
          position-area="top"
          :text="copiedId === example.id ? 'Copied!' : 'Click to copy'"
          type="button"
          @click="onCopy(example)"
        >
          <code
            class="block max-w-full text-[10px] font-mono truncate transition-colors"
            :class="copiedId === example.id
              ? 'text-primary'
              : 'text-on-surface-variant/70 hover:text-on-surface-variant'"
          >{{ addCommand(item.name, example.id) }}</code>
        </AppTooltip>
      </div>
    </li>
  </ul>
</template>
