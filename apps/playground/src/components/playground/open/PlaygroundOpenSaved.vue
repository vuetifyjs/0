<script setup lang="ts">
  // Framework
  import { Button, createSelection, createVirtual } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppJdenticon from '@/components/app/AppJdenticon.vue'
  import AppSkeleton from '@/components/app/AppSkeleton.vue'
  import AppTooltip from '@/components/app/AppTooltip.vue'

  // Context
  import PlaygroundOpenSavedRow from './PlaygroundOpenSavedRow.vue'

  // Utilities
  import { computed, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { VuetifyPlayground } from './types'
  import type { PlaygroundScope } from '@/composables/teamPlaygrounds'

  const {
    catalog,
    items,
    pinned = [],
    loading = false,
    error,
    query = '',
    total = 0,
    empty = 'No Vuetify Play playgrounds',
    scope = 'personal',
    canTeam = false,
    assigning = false,
    userTeamId,
  } = defineProps<{
    /** Scoped list before search. Selection survives a filter that hides a row. */
    catalog: VuetifyPlayground[]
    items: VuetifyPlayground[]
    /** Always-visible pinned pills, independent of chip/search. */
    pinned?: VuetifyPlayground[]
    loading?: boolean
    error?: string
    query?: string
    /** Unfiltered scoped count for empty vs no-match copy. */
    total?: number
    empty?: string
    scope?: PlaygroundScope
    /** User belongs to a team, so bulk move is available. */
    canTeam?: boolean
    assigning?: boolean
    /** Signed-in user's team id. Bulk "Make team" assigns this. */
    userTeamId?: string
  }>()

  const emit = defineEmits<{
    open: [item: VuetifyPlayground]
    unpin: [item: VuetifyPlayground]
    update: [item: VuetifyPlayground]
    remove: [id: string]
    assign: [payload: { ids: string[], teamId: string | null }]
  }>()

  const ROW_HEIGHT = 48
  const virtual = createVirtual(toRef(() => items), {
    itemHeight: ROW_HEIGHT,
    overscan: 8,
  })
  const { element, items: virtualItems, offset, size, scroll } = virtual
  const picked = createSelection({ multiple: true })
  const selecting = shallowRef(false)
  const flip = shallowRef(scope === 'team')

  const selectedCount = computed(() => picked.selectedIds.size)
  const bulkLabel = computed(() => flip.value ? 'Make personal' : 'Make team')

  function isSelected (id: string) {
    return picked.selectedIds.has(id)
  }

  function onToggle (id: string) {
    picked.toggle(id)
  }

  function clearPicked () {
    for (const id of picked.selectedIds) {
      picked.unselect(id)
    }
  }

  function onDone () {
    selecting.value = false
    clearPicked()
  }

  function onAssign () {
    if (selectedCount.value === 0 || assigning) return
    const teamId = flip.value ? null : userTeamId
    if (teamId === undefined) return
    emit('assign', {
      ids: [...picked.selectedIds].map(String),
      teamId,
    })
  }

  function sync (rows: VuetifyPlayground[]) {
    const next = new Set(rows.map(row => row.id))
    for (const id of picked.keys()) {
      if (!next.has(String(id))) picked.unregister(id)
    }
    const fresh = rows.filter(row => !picked.has(row.id))
    if (fresh.length === 0) return
    picked.onboard(fresh.map(row => ({ id: row.id })))
  }

  watch(() => catalog.map(item => item.id).join('\n'), () => {
    sync(catalog)
  }, { immediate: true })

  watch(() => scope, next => {
    clearPicked()
    selecting.value = false
    flip.value = next === 'team'
  })

  watch(() => canTeam, value => {
    if (value) return
    selecting.value = false
    clearPicked()
  })

  const bulkClass = 'h-6 inline-flex items-center gap-1 px-2 rounded-md border border-primary bg-primary/10 text-[11px] font-medium text-primary cursor-pointer shrink-0 data-[disabled]:opacity-40 data-[disabled]:cursor-not-allowed'
  const quietClass = 'h-6 inline-flex items-center px-2 rounded-md border border-divider text-[11px] text-on-surface-variant hover:text-on-surface cursor-pointer shrink-0'
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
    <p class="text-sm text-on-surface-variant">{{ empty }}</p>
  </div>

  <div
    v-else
    class="h-full min-h-0 flex-1 flex flex-col"
  >
    <div
      v-if="canTeam && total > 0"
      class="flex items-center justify-end gap-2 px-3 py-2 shrink-0 border-b border-divider"
    >
      <template v-if="selecting">
        <span
          v-if="selectedCount > 0"
          class="me-auto text-xs text-on-surface truncate"
        >
          {{ selectedCount }} selected
        </span>

        <Button.Root
          :aria-label="bulkLabel"
          :class="bulkClass"
          :disabled="selectedCount === 0 || assigning"
          @click="onAssign"
        >
          <AppIcon :icon="flip ? 'account-outline' : 'account-group'" :size="12" />
          {{ bulkLabel }}
        </Button.Root>

        <Button.Root
          :aria-label="flip ? 'Make team instead' : 'Make personal instead'"
          :class="quietClass"
          :disabled="assigning"
          @click="flip = !flip"
        >
          Flip
        </Button.Root>

        <Button.Root
          :class="quietClass"
          :disabled="assigning"
          @click="onDone"
        >
          Done
        </Button.Root>
      </template>

      <Button.Root
        v-else
        :class="quietClass"
        @click="selecting = true"
      >
        Select
      </Button.Root>
    </div>

    <div
      v-if="pinned.length > 0"
      class="flex flex-wrap gap-1 px-3 pt-2 shrink-0"
    >
      <span
        v-for="item in pinned"
        :key="item.id"
        class="inline-flex items-center max-w-[13rem] h-6 rounded-full border border-divider bg-surface-tint/40"
      >
        <Button.Root
          class="min-w-0 inline-flex items-center gap-1 pl-1.5 pr-1 text-[11px] text-on-surface border-0 bg-transparent cursor-pointer"
          @click="emit('open', item)"
        >
          <AppJdenticon :size="16" :value="item.id" />

          <AppIcon class="shrink-0 text-on-surface-variant" icon="pin" :size="12" />

          <span class="truncate">{{ item.title || 'Untitled' }}</span>
        </Button.Root>

        <AppTooltip
          as="span"
          class="inline-flex"
          :open-delay="200"
          position-area="top"
          text="Unpin"
        >
          <Button.Root
            aria-label="Unpin"
            class="shrink-0 p-0.5 mr-0.5 inline-flex items-center justify-center rounded-full border-0 bg-transparent text-on-surface-variant hover:bg-surface-tint hover:text-on-surface cursor-pointer"
            @click.stop="emit('unpin', item)"
          >
            <AppIcon icon="close" :size="12" />
          </Button.Root>
        </AppTooltip>
      </span>
    </div>

    <div
      v-if="items.length === 0"
      class="p-8 text-center flex items-center justify-center"
      :class="pinned.length > 0 ? 'py-6' : 'h-full'"
    >
      <p class="text-sm text-on-surface-variant">
        {{ query ? `No matches for “${query}”` : 'No playgrounds' }}
      </p>
    </div>

    <div
      v-else
      ref="element"
      class="flex-1 min-h-0 overflow-y-auto p-2"
      @scroll="scroll"
    >
      <div :style="{ height: `${offset}px` }" />

      <PlaygroundOpenSavedRow
        v-for="entry in virtualItems"
        :key="entry.raw.id"
        :item="entry.raw"
        :scope
        :selected="isSelected(entry.raw.id)"
        :selecting
        @open="emit('open', $event)"
        @remove="emit('remove', $event)"
        @toggle="onToggle"
        @update="emit('update', $event)"
      />

      <div :style="{ height: `${size}px` }" />
    </div>
  </div>
</template>
