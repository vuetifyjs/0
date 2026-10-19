<script setup lang="ts">
  // Framework
  import { Button, Checkbox, createSelection, createVirtual, Popover } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppSkeleton from '@/components/app/AppSkeleton.vue'
  import AppTooltip from '@/components/app/AppTooltip.vue'

  // Local
  import { binLanguageLabel, formatDate } from './types'

  // Utilities
  import { computed, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { VuetifyBin } from './types'

  const {
    catalog,
    items,
    pinned = [],
    loading = false,
    error,
    query = '',
    total = 0,
  } = defineProps<{
    /** Full bin list. Selection survives a filter that hides a checked row. */
    catalog: VuetifyBin[]
    items: VuetifyBin[]
    /** Always-visible pinned pills, independent of chip/search. */
    pinned?: VuetifyBin[]
    loading?: boolean
    error?: string
    query?: string
    /** Unfiltered count for empty vs no-match copy. */
    total?: number
  }>()

  const emit = defineEmits<{
    'open': [item: VuetifyBin]
    'copy': [item: VuetifyBin]
    'copy-many': [items: VuetifyBin[]]
  }>()

  const ROW_HEIGHT = 40
  const ROW_GAP = 4
  const virtual = createVirtual(toRef(() => items), {
    itemHeight: ROW_HEIGHT + ROW_GAP,
    overscan: 8,
  })
  const { element, items: virtualItems, offset, size, scroll } = virtual
  const picked = createSelection({ multiple: true })
  const selecting = shallowRef(false)

  const selectedCount = computed(() => picked.selectedIds.size)

  const bulkLabel = computed(() => {
    if (selectedCount.value === 0) return 'Add to project'
    if (selectedCount.value === 1) return 'Add 1 to project'
    return `Add ${selectedCount.value} to project`
  })

  function label (item: VuetifyBin) {
    return `${item.title || 'Untitled'}, opens on Vuetify Bin`
  }

  function isSelected (id: string) {
    return picked.selectedIds.has(id)
  }

  function onToggle (id: string) {
    picked.toggle(id)
  }

  function onRow (id: string) {
    if (!selecting.value) return
    onToggle(id)
  }

  function onSelect (item: VuetifyBin) {
    picked.select(item.id)
    selecting.value = true
  }

  function onAddSelected () {
    const ids = picked.selectedIds
    const seen = new Set<string>()
    const chosen: VuetifyBin[] = []
    for (const bin of [...pinned, ...items, ...catalog]) {
      if (!ids.has(bin.id) || seen.has(bin.id)) continue
      seen.add(bin.id)
      chosen.push(bin)
    }
    if (chosen.length === 0) return
    emit('copy-many', chosen)
  }

  function syncBins (rows: VuetifyBin[]) {
    const next = new Set(rows.map(row => row.id))
    for (const id of picked.keys()) {
      if (!next.has(String(id))) picked.unregister(id)
    }
    const fresh = rows.filter(row => !picked.has(row.id))
    if (fresh.length === 0) return
    picked.onboard(fresh.map(row => ({ id: row.id })))
  }

  watch(() => catalog.map(bin => bin.id).join('\n'), () => {
    syncBins(catalog)
  }, { immediate: true })

  watch(selectedCount, count => {
    if (count === 0) selecting.value = false
  })

  const addTip = 'Make copy and add to current Playground'
  const addClass = 'inline-flex items-center justify-center size-6 shrink-0 rounded border-0 bg-transparent text-primary hover:bg-primary/10 cursor-pointer'
  const menuItemClass = 'w-full flex items-center px-3 py-1.5 text-xs text-left text-on-surface hover:bg-surface-tint border-0 bg-transparent cursor-pointer'
  const copyClass = 'h-6 inline-flex items-center gap-1 px-2 rounded-md border border-primary bg-primary/10 text-[11px] font-medium text-primary cursor-pointer shrink-0'
  const bulkClass = `${copyClass} data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed`
  const boxClass = 'size-4 shrink-0 inline-flex items-center justify-center rounded-sm border border-on-surface-variant/40 bg-surface data-[state=checked]:border-primary data-[state=checked]:bg-primary/10 data-[state=indeterminate]:border-primary'
</script>

<template>
  <div
    v-if="loading"
    class="p-4 h-full"
  >
    <AppSkeleton height="h-12" :lines="4" />
  </div>

  <div
    v-else-if="error"
    class="p-8 text-center flex items-center justify-center h-full"
  >
    <p class="text-sm text-on-surface-variant">{{ error }}</p>
  </div>

  <div
    v-else-if="total === 0"
    class="p-8 text-center flex items-center justify-center h-full"
  >
    <p class="text-sm text-on-surface-variant">No Vuetify Bins</p>
  </div>

  <div
    v-else
    class="h-full min-h-0 flex-1 flex flex-col"
  >
    <div
      v-if="pinned.length > 0"
      class="flex flex-wrap gap-1 px-3 pt-2 shrink-0"
    >
      <div
        v-for="item in pinned"
        :key="item.id"
        class="min-w-0 max-w-[13rem] h-6 inline-flex items-center rounded-full border border-divider bg-surface-tint/40"
      >
        <Button.Root
          :aria-label="label(item)"
          class="min-w-0 h-full inline-flex items-center gap-1 px-1.5 text-[11px] text-on-surface cursor-pointer border-0 bg-transparent"
          @click="emit('open', item)"
        >
          <AppIcon class="shrink-0 text-on-surface-variant" icon="pin" :size="12" />

          <span class="truncate">{{ item.title || 'Untitled' }}</span>
        </Button.Root>

        <AppTooltip
          :aria-label="addTip"
          class="h-full border-s border-divider"
          :class="addClass"
          :open-delay="200"
          position-area="top"
          :text="addTip"
          @click="emit('copy', item)"
        >
          <AppIcon icon="plus" :size="14" />
        </AppTooltip>
      </div>
    </div>

    <div
      v-if="selecting"
      class="flex items-center justify-end gap-2 px-3 py-2 shrink-0 border-b border-divider"
    >
      <span
        v-if="selectedCount > 0"
        class="me-auto text-xs text-on-surface truncate"
      >
        {{ selectedCount }} selected
      </span>

      <Button.Root
        :aria-label="bulkLabel"
        :class="bulkClass"
        :disabled="selectedCount === 0"
        @click="onAddSelected"
      >
        <AppIcon icon="copy" :size="12" />
        {{ bulkLabel }}
      </Button.Root>
    </div>

    <div
      v-if="items.length === 0"
      class="p-8 text-center flex items-center justify-center"
      :class="pinned.length > 0 ? 'py-6' : 'h-full'"
    >
      <p class="text-sm text-on-surface-variant">
        {{ query ? `No matches for “${query}”` : 'No bins' }}
      </p>
    </div>

    <div
      v-else
      ref="element"
      class="flex-1 min-h-0 overflow-y-auto p-2"
      @scroll="scroll"
    >
      <div :style="{ height: `${offset}px` }" />

      <div
        v-for="entry in virtualItems"
        :key="entry.raw.id"
        class="h-10 mb-1 box-border flex items-center justify-between gap-3 px-3 rounded-md hover:bg-surface-tint/60"
        :class="isSelected(entry.raw.id) ? 'bg-primary/5' : ''"
        @click="onRow(entry.raw.id)"
      >
        <Checkbox.Root
          v-if="selecting"
          :class="boxClass"
          :label="`Select ${entry.raw.title || 'Untitled'}`"
          :model-value="isSelected(entry.raw.id)"
          @click.stop
          @update:model-value="onToggle(entry.raw.id)"
        >
          <Checkbox.Indicator class="text-primary text-[10px] leading-none">✓</Checkbox.Indicator>
        </Checkbox.Root>

        <Button.Root
          :aria-label="label(entry.raw)"
          class="min-w-0 flex-1 text-sm text-on-surface truncate hover:text-primary border-0 bg-transparent cursor-pointer text-left p-0"
          @click.stop="emit('open', entry.raw)"
        >
          {{ entry.raw.title || 'Untitled' }}
        </Button.Root>

        <div class="flex items-center gap-2 shrink-0">
          <span class="text-xs text-on-surface-variant">
            {{ binLanguageLabel(entry.raw.language) }}
          </span>

          <span class="text-xs text-on-surface-variant tabular-nums">
            {{ entry.raw.updatedAt || entry.raw.createdAt ? formatDate(entry.raw.updatedAt || entry.raw.createdAt) : '' }}
          </span>

          <Popover.Root v-slot="{ toggle }">
            <Popover.Activator
              aria-label="Add options"
              :class="addClass"
              @click.stop
            >
              <AppIcon icon="plus" :size="16" />
            </Popover.Activator>

            <Popover.Content
              class="bg-surface border border-divider rounded-md shadow-lg py-1 min-w-64"
              position-area="bottom span-left"
              @click.stop
            >
              <Button.Root
                :class="menuItemClass"
                @click="toggle(); emit('copy', entry.raw)"
              >
                Make copy and add to current Playground
              </Button.Root>

              <Button.Root
                :class="menuItemClass"
                @click="toggle(); onSelect(entry.raw)"
              >
                Select
              </Button.Root>
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>

      <div :style="{ height: `${size}px` }" />
    </div>
  </div>
</template>
