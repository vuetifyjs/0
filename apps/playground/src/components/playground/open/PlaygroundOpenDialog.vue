<script setup lang="ts">
  // Framework
  import { createFilter } from '@vuetify/v0'

  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'
  import AppIcon from '@/components/app/AppIcon.vue'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Context
  import PlaygroundOpenExamples from './PlaygroundOpenExamples.vue'
  import PlaygroundOpenGallery from './PlaygroundOpenGallery.vue'
  import PlaygroundOpenSaved from './PlaygroundOpenSaved.vue'

  // Composables
  import { ONE_API, useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  // Data
  import { resolveFeatureAccent, resolveFeatureIcon } from '@/data/feature-icons'
  import { DEFAULT_REGISTRY, getRegistryIndex, getRegistryItem } from '@/data/registry'
  import { getVuetifyComponents, VUETIFY_EXAMPLES, vuetifyDocsUrl } from '@/data/vuetify-examples'

  // Local
  import { readOpenSession, touchOpenSession, writeOpenSession } from './open-session'
  import {
    exampleLabel,
    featureBucket,
    normalizeOpenRail,
    sortPlaygrounds,
    type OpenKind,
    type OpenRail,
    type OpenRailItem,
    type OpenSavedChip,
    type OpenSavedSort,
    type VuetifyPlayground,
  } from './types'

  // Utilities
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from 'vue'

  // Types
  import type { RegistryExample, RegistryIndexEntry, RegistryItem } from '@/data/registry'
  import type { VuetifyComponentEntry, VuetifyExampleMeta } from '@/data/vuetify-examples'

  const emit = defineEmits<{ close: [] }>()

  const playground = usePlayground()
  const one = useOnePlaygrounds()
  const restored = readOpenSession()
  const rail = shallowRef<OpenRail>(normalizeOpenRail(restored?.rail))
  const query = shallowRef(restored?.query ?? '')
  /** Vuetify0 kind chip — Components / Composables / Plugins (or all). */
  const kind = shallowRef<OpenKind | 'all'>(restored?.kind ?? 'all')
  const savedChip = shallowRef<OpenSavedChip>(restored?.savedChip ?? 'all')
  const savedSort = shallowRef<OpenSavedSort>(restored?.savedSort ?? 'updated')
  const savedSortDir = shallowRef<'asc' | 'desc'>(restored?.savedSortDir ?? 'desc')
  const pendingScroll = shallowRef(restored?.scrollTop ?? 0)
  const pendingExamplesScroll = shallowRef(restored?.examplesScrollTop ?? 0)
  /** Gallery wayfinding — name last opened on its rail (2 min session). */
  const lastFeature = shallowRef(restored?.lastFeature)
  const lastFeatureRail = shallowRef<OpenRail | undefined>(
    restored?.lastFeatureRail ? normalizeOpenRail(restored.lastFeatureRail) : undefined,
  )
  /** Restore examples drill-in after close → reopen (same 2 min window). */
  const pendingSelectedName = shallowRef(restored?.selectedName)

  // ── Saved playgrounds (API) ──────────────────────────────────────────
  const saved = ref<VuetifyPlayground[]>([])
  const savedLoading = shallowRef(false)
  const savedError = shallowRef<string>()
  const savedLoaded = shallowRef(false)

  // ── Docs registry examples (v0) ──────────────────────────────────────
  const items = ref<RegistryIndexEntry[]>([])
  const examplesLoading = shallowRef(true)
  const examplesError = shallowRef<string>()
  const input = useTemplateRef<HTMLInputElement>('input')
  const pane = useTemplateRef<HTMLElement>('pane')
  const opening = shallowRef(false)
  let scrollTimer = 0
  let touchTimer = 0

  // ── Vuetify 4 docs examples (path manifest + raw git) ───────────────
  const vuetifyItems = getVuetifyComponents()

  // Feature drill-in (example picker)
  const selected = shallowRef<RegistryIndexEntry>()
  const selectedItem = shallowRef<RegistryItem>()
  const selectedVuetify = shallowRef<VuetifyComponentEntry>()
  /** Last Vuetify example open attempt — Retry re-runs this. */
  const lastVuetifyMeta = shallowRef<VuetifyExampleMeta>()
  const itemLoading = shallowRef(false)
  const itemError = shallowRef<string>()

  const rails: OpenRailItem[] = [
    { id: 'v0', label: 'Vuetify0' },
    { id: 'vuetify', label: 'Vuetify 4' },
    { id: 'saved', label: 'Vuetify One' },
  ]

  const railLabel = computed(() =>
    rails.find(r => r.id === rail.value)?.label ?? 'Examples',
  )

  const kindCounts = computed(() => {
    const next = { components: 0, composables: 0, plugins: 0 }
    for (const item of items.value) {
      next[featureBucket(item)]++
    }
    return next
  })

  const kindChips = computed(() => [
    { id: 'all' as const, label: 'All', count: items.value.length },
    { id: 'components' as const, label: 'Components', count: kindCounts.value.components },
    { id: 'composables' as const, label: 'Composables', count: kindCounts.value.composables },
    { id: 'plugins' as const, label: 'Plugins', count: kindCounts.value.plugins },
  ].filter(chip => chip.id === 'all' || chip.count > 0))

  const kindItems = computed(() => {
    if (kind.value === 'all') return items.value
    return items.value.filter(item => featureBucket(item) === kind.value)
  })

  const savedCounts = computed(() => ({
    favorite: saved.value.filter(item => item.favorite).length,
    pinned: saved.value.filter(item => item.pinned).length,
  }))

  const savedChips = computed(() => [
    { id: 'all' as const, label: 'All', count: saved.value.length },
    { id: 'favorite' as const, label: 'Favorites', count: savedCounts.value.favorite },
  ].filter(chip => chip.id === 'all' || chip.count > 0))

  const pinnedItems = computed(() =>
    sortPlaygrounds(
      saved.value.filter(item => item.pinned),
      savedSort.value,
      savedSortDir.value,
    ),
  )

  const savedPool = computed(() => {
    const unpinned = saved.value.filter(item => !item.pinned)
    const pool = savedChip.value === 'favorite'
      ? unpinned.filter(item => item.favorite)
      : unpinned
    return sortPlaygrounds(pool, savedSort.value, savedSortDir.value)
  })

  // Flatten searchable text so createFilter can match example ids without a custom fn.
  const filterableV0 = computed(() =>
    kindItems.value.map(item => ({
      ...item,
      exampleSearch: item.examples.join(' '),
    })),
  )

  const filterableVuetify = computed(() =>
    vuetifyItems.map(item => ({
      ...item,
      exampleSearch: item.examples.map(e => `${e.id} ${e.title}`).join(' '),
      docs: vuetifyDocsUrl(item.name),
      category: 'Component',
      type: 'components' as const,
      level: 'stable',
      description: `${item.examples.length} docs example${item.examples.length === 1 ? '' : 's'}`,
      examples: item.examples.map(e => e.id),
    })),
  )

  const filterableSaved = computed(() =>
    savedPool.value.map(item => ({
      ...item,
      title: item.title || '',
    })),
  )

  const galleryFilter = createFilter({
    keys: ['name', 'title', 'description', 'category', 'exampleSearch'],
    mode: 'some',
  })

  const savedFilter = createFilter({
    keys: ['title', 'id'],
    mode: 'some',
  })

  const { items: filtered } = galleryFilter.apply(() => query.value, filterableV0)
  const { items: filteredVuetifyEntries } = galleryFilter.apply(() => query.value, filterableVuetify)
  const { items: filteredSaved } = savedFilter.apply(() => query.value, filterableSaved)

  /** Full Vuetify component entries after search (keeps example meta for drill-in). */
  const filteredVuetify = computed(() => {
    const names = new Set(filteredVuetifyEntries.value.map(e => e.name))
    return vuetifyItems.filter(c => names.has(c.name))
  })

  /** Registry-shaped view of the selected Vuetify component for the examples pane. */
  const selectedVuetifyAsItem = computed((): RegistryItem | undefined => {
    const entry = selectedVuetify.value
    if (!entry) return undefined
    return {
      name: entry.name,
      type: 'components',
      category: 'Component',
      level: 'stable',
      title: entry.title,
      description: `Vuetify 4 docs examples for ${entry.name}`,
      docs: vuetifyDocsUrl(entry.name),
      examples: entry.examples.map(example => ({
        id: example.id,
        title: example.title,
        description: example.path,
        dir: entry.name,
        files: [{ path: example.path, name: `${example.id}.vue`, entry: true, content: '' }],
        dependencies: ['vuetify'],
        tokens: [],
        icons: { collections: [], classes: [] },
      })),
    }
  })

  const selectedDocsHref = computed(() => {
    if (selectedVuetify.value) return vuetifyDocsUrl(selectedVuetify.value.name)
    const docs = selected.value?.docs?.trim() || selectedItem.value?.docs?.trim()
    return docs || undefined
  })

  const searchPlaceholder = computed(() => {
    if (rail.value === 'saved') return 'Filter Vuetify One…'
    if (rail.value === 'vuetify') return 'Filter Vuetify 4…'
    return 'Filter Vuetify0…'
  })

  const showSearch = computed(() => {
    if (selected.value || selectedVuetify.value) return false
    if (rail.value === 'saved') {
      return !savedLoading.value && !savedError.value && saved.value.length > 0
    }
    if (rail.value === 'vuetify') return vuetifyItems.length > 0
    return !examplesLoading.value && !examplesError.value && items.value.length > 0
  })

  const showKindChips = computed(() =>
    rail.value === 'v0'
    && !selected.value
    && !selectedVuetify.value
    && !examplesLoading.value
    && !examplesError.value
    && items.value.length > 0,
  )

  const showSavedChips = computed(() =>
    rail.value === 'saved'
    && !savedLoading.value
    && !savedError.value
    && saved.value.length > 0
    && savedChips.value.length > 1,
  )

  const showSavedSort = computed(() =>
    rail.value === 'saved'
    && !savedLoading.value
    && !savedError.value
    && saved.value.length > 0,
  )

  const savedSortChips = [
    { id: 'name' as const, label: 'Name' },
    { id: 'created' as const, label: 'Created' },
    { id: 'updated' as const, label: 'Updated' },
  ]

  const subtitle = computed(() => {
    if (rail.value === 'saved') {
      if (savedLoading.value) return 'Loading…'
      if (savedError.value) return 'Could not load'
      const n = filteredSaved.value.length
      return n === 1 ? '1 playground' : `${n} playgrounds`
    }
    if (rail.value === 'vuetify') {
      const n = filteredVuetify.value.length
      const total = vuetifyItems.length
      const examples = filteredVuetify.value.reduce((sum, c) => sum + c.examples.length, 0)
      if (query.value.trim() && n !== total) {
        return `${n} of ${total} components · ${examples} examples`
      }
      return `${total} components · ${examples} examples`
    }
    if (examplesLoading.value) return 'Loading…'
    if (examplesError.value) return 'Could not load registry'
    const n = filtered.value.length
    const pool = kindItems.value.length
    const total = items.value.length
    const examples = filtered.value.reduce((sum, item) => sum + item.examples.length, 0)
    const narrowed = kind.value !== 'all' || Boolean(query.value.trim())
    if (narrowed && n !== total) {
      return `${n} of ${total} features · ${examples} examples`
    }
    if (kind.value !== 'all' && n === pool) {
      return `${pool} features · ${examples} examples`
    }
    return `${total} features · ${examples} examples`
  })

  const selectedIcon = computed(() => {
    if (selectedVuetify.value) return 'vuetify'
    if (!selected.value) return undefined
    return resolveFeatureIcon(selected.value.name, selected.value.category)
  })

  const selectedAccent = computed(() => {
    if (selectedVuetify.value) return resolveFeatureAccent('components', 'Component')
    if (!selected.value) return undefined
    return resolveFeatureAccent(selected.value.type, selected.value.category)
  })

  /**
   * Example id to highlight as currently loaded in the editor, when the
   * drilled-in feature matches `activeExample`.
   */
  const activeExampleId = computed(() => {
    const active = playground.activeExample.value
    if (!active) return undefined

    if (active.source === 'v0' && selected.value) {
      if (active.item === selected.value.name && active.type === selected.value.type) {
        return active.example
      }
      // Registry deep-links sometimes omit type; name match is enough.
      if (active.item === selected.value.name) return active.example
      return undefined
    }

    if (active.source === 'vuetify' && selectedVuetify.value) {
      const hit = selectedVuetify.value.examples.find(
        e => e.id === active.id
          || e.path === active.path
          || e.path.endsWith(`/${active.id}.vue`)
          || e.path.endsWith(`/${active.id}`),
      )
      return hit?.id ?? (selectedVuetify.value.name === active.path.split('/')[0] ? active.id : undefined)
    }

    return undefined
  })

  onMounted(async () => {
    // Warm saved list when restoring that rail so the pane isn't empty flash.
    if (rail.value === 'saved') await loadSaved()
    await loadExamples()
    // Re-enter the examples pane if the user closed while drilled in.
    if (pendingSelectedName.value && rail.value !== 'saved') {
      const ok = await restoreDrillIn(pendingSelectedName.value)
      pendingSelectedName.value = undefined
      await nextTick()
      if (ok) restoreExamplesScroll()
      else restoreScroll()
    } else {
      await nextTick()
      restoreScroll()
    }
    if (!selected.value && !selectedVuetify.value) input.value?.focus()
    // Keep the 2-minute window alive while the dialog stays open.
    touchTimer = window.setInterval(() => touchOpenSession(), 30_000)
  })

  onBeforeUnmount(() => {
    window.clearTimeout(scrollTimer)
    window.clearInterval(touchTimer)
    persistSession()
  })

  function persistSession () {
    // Gallery scroll and examples scroll are separate: the shared pane element
    // switches content, so never write one over the other.
    const drilled = Boolean(selected.value || selectedVuetify.value)
    if (drilled && pane.value) {
      pendingExamplesScroll.value = pane.value.scrollTop
    } else if (!drilled && pane.value) {
      pendingScroll.value = pane.value.scrollTop
    }

    writeOpenSession({
      rail: rail.value,
      scrollTop: pendingScroll.value,
      examplesScrollTop: drilled ? pendingExamplesScroll.value : 0,
      query: query.value,
      kind: kind.value,
      savedChip: savedChip.value,
      savedSort: savedSort.value,
      savedSortDir: savedSortDir.value,
      lastFeature: lastFeature.value,
      lastFeatureRail: lastFeatureRail.value,
      selectedName: selected.value?.name ?? selectedVuetify.value?.name,
    })
  }

  /** Snapshot gallery scroll before content swaps (cancel pending debounce). */
  function captureGalleryScroll () {
    window.clearTimeout(scrollTimer)
    if (selected.value || selectedVuetify.value) return
    if (pane.value) pendingScroll.value = pane.value.scrollTop
  }

  function markLastFeature (name: string) {
    lastFeature.value = name
    lastFeatureRail.value = rail.value
  }

  /** Last-opened mark for the active gallery rail only. */
  const galleryLastFeature = computed(() =>
    lastFeatureRail.value === rail.value ? lastFeature.value : undefined,
  )

  /**
   * Re-apply a scroll position after layout paints. Gallery content often
   * arrives after first mount (registry fetch), so a single assignment is not
   * enough.
   */
  function restoreScrollTo (top: number) {
    if (!pane.value || top <= 0) return

    function apply () {
      if (!pane.value) return
      pane.value.scrollTop = top
    }

    apply()
    requestAnimationFrame(() => {
      apply()
      requestAnimationFrame(apply)
    })
    window.setTimeout(apply, 50)
    window.setTimeout(apply, 150)
    window.setTimeout(apply, 400)
  }

  function restoreScroll () {
    restoreScrollTo(pendingScroll.value)
  }

  function restoreExamplesScroll () {
    restoreScrollTo(pendingExamplesScroll.value)
  }

  function onPaneScroll () {
    window.clearTimeout(scrollTimer)
    scrollTimer = window.setTimeout(() => {
      if (!pane.value) return
      if (selected.value || selectedVuetify.value) {
        pendingExamplesScroll.value = pane.value.scrollTop
      } else {
        pendingScroll.value = pane.value.scrollTop
      }
      persistSession()
    }, 100)
  }

  /**
   * Re-open the examples pane for a feature name (session restore).
   * @returns false if the feature is gone — caller should restore gallery scroll.
   */
  async function restoreDrillIn (name: string): Promise<boolean> {
    if (rail.value === 'vuetify') {
      const hit = vuetifyItems.find(c => c.name === name)
      if (!hit) return false
      markLastFeature(hit.name)
      selectedVuetify.value = hit
      selected.value = undefined
      selectedItem.value = undefined
      itemError.value = undefined
      return true
    }

    const entry = items.value.find(i => i.name === name)
    if (!entry) return false
    // Skip gallery capture — pendingScroll already holds the list position.
    markLastFeature(entry.name)
    selected.value = entry
    selectedItem.value = undefined
    itemError.value = undefined
    itemLoading.value = true
    try {
      selectedItem.value = await getRegistryItem(entry)
    } catch (error) {
      itemError.value = error instanceof Error ? error.message : String(error)
    } finally {
      itemLoading.value = false
    }
    return true
  }

  async function loadExamples () {
    examplesLoading.value = true
    examplesError.value = undefined
    try {
      const index = await getRegistryIndex()
      items.value = index.items
        .filter(item => item.examples.length > 0)
        .toSorted((a, b) => a.title.localeCompare(b.title) || a.name.localeCompare(b.name))
    } catch (error) {
      examplesError.value = error instanceof Error
        ? error.message
        : `Failed to load registry from ${DEFAULT_REGISTRY}`
    } finally {
      examplesLoading.value = false
      await nextTick()
      // Don't clobber the examples list when already drilled in (or about to restore).
      if (!selected.value && !selectedVuetify.value && !pendingSelectedName.value) {
        restoreScroll()
      }
    }
  }

  async function loadSaved () {
    if (savedLoaded.value || savedLoading.value) return
    savedLoading.value = true
    savedError.value = undefined
    try {
      const res = await fetch(`${ONE_API}/one/playgrounds`, {
        credentials: 'include',
      })

      if (!res.ok) {
        savedError.value = res.status === 401
          ? 'Session expired. Please sign in again.'
          : `Failed to load playgrounds (${res.status})`
        return
      }

      const data = await res.json()
      saved.value = data.playgrounds ?? data
      savedLoaded.value = true
    } catch {
      savedError.value = 'Failed to load playgrounds'
    } finally {
      savedLoading.value = false
      await nextTick()
      restoreScroll()
    }
  }

  async function onRail (next: OpenRail) {
    if (rail.value === next && !selected.value && !selectedVuetify.value) return
    rail.value = next
    selected.value = undefined
    selectedItem.value = undefined
    selectedVuetify.value = undefined
    itemError.value = undefined
    query.value = ''
    kind.value = 'all'
    savedChip.value = 'all'
    pendingScroll.value = 0
    pendingExamplesScroll.value = 0
    if (pane.value) pane.value.scrollTop = 0
    persistSession()
    if (next === 'saved') await loadSaved()
    nextTick(() => input.value?.focus())
  }

  function onKind (next: OpenKind | 'all') {
    if (kind.value === next) {
      // Second click on an active kind chip clears back to All
      if (next !== 'all') kind.value = 'all'
      return
    }
    kind.value = next
    pendingScroll.value = 0
    if (pane.value) pane.value.scrollTop = 0
    persistSession()
  }

  function onSavedChip (next: OpenSavedChip) {
    if (savedChip.value === next) {
      if (next !== 'all') savedChip.value = 'all'
      return
    }
    savedChip.value = next
    pendingScroll.value = 0
    if (pane.value) pane.value.scrollTop = 0
    persistSession()
  }

  function onSavedSort (next: OpenSavedSort) {
    if (savedSort.value === next) {
      savedSortDir.value = savedSortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      savedSort.value = next
      savedSortDir.value = next === 'name' ? 'asc' : 'desc'
    }
    pendingScroll.value = 0
    if (pane.value) pane.value.scrollTop = 0
    persistSession()
  }

  async function onUnpin (item: VuetifyPlayground) {
    try {
      await one.patchMeta({ pinned: false }, item.id)
      saved.value = saved.value.map(entry => (
        entry.id === item.id ? { ...entry, pinned: false } : entry
      ))
    } catch {
      // leave the row pinned if the API rejects
    }
  }

  function onBack () {
    // Capture examples scroll before unmounting the list (optional for next drill).
    if (pane.value) pendingExamplesScroll.value = pane.value.scrollTop
    selected.value = undefined
    selectedItem.value = undefined
    selectedVuetify.value = undefined
    itemError.value = undefined
    persistSession()
    nextTick(() => {
      restoreScroll()
      input.value?.focus()
    })
  }

  async function loadFeature (entry: RegistryIndexEntry) {
    captureGalleryScroll()
    markLastFeature(entry.name)
    selected.value = entry
    selectedVuetify.value = undefined
    selectedItem.value = undefined
    itemError.value = undefined
    itemLoading.value = true
    pendingExamplesScroll.value = 0
    persistSession()
    try {
      selectedItem.value = await getRegistryItem(entry)
    } catch (error) {
      itemError.value = error instanceof Error ? error.message : String(error)
    } finally {
      itemLoading.value = false
    }
  }

  async function onSelectFeature (entry: RegistryIndexEntry) {
    // Single example → open immediately (card click is deliberate)
    if (entry.examples.length === 1) {
      captureGalleryScroll()
      markLastFeature(entry.name)
      selected.value = entry
      itemLoading.value = true
      itemError.value = undefined
      persistSession()
      try {
        const item = await getRegistryItem(entry)
        selectedItem.value = item
        const example = item.examples[0]
        if (example) await openExample(example)
      } catch (error) {
        itemError.value = error instanceof Error ? error.message : String(error)
      } finally {
        itemLoading.value = false
      }
      return
    }

    await loadFeature(entry)
  }

  async function onRetryFeature () {
    if (!selected.value) return
    await loadFeature(selected.value)
  }

  async function openExample (example: RegistryExample) {
    if (opening.value) return

    // Vuetify 4 path: content is not in the registry item — fetch raw git.
    if (selectedVuetify.value) {
      const meta = selectedVuetify.value.examples.find(e => e.id === example.id)
      if (!meta) return
      await openVuetifyMeta(meta)
      return
    }

    if (!selected.value) return
    opening.value = true
    try {
      await playground.openRegistryExample({
        item: selected.value.name,
        type: selected.value.type,
        example: example.id,
      })
      emit('close')
    } catch (error) {
      itemError.value = error instanceof Error ? error.message : String(error)
    } finally {
      opening.value = false
    }
  }

  async function onSelectVuetify (entry: VuetifyComponentEntry) {
    captureGalleryScroll()
    markLastFeature(entry.name)
    pendingExamplesScroll.value = 0
    selectedVuetify.value = entry
    selected.value = undefined
    selectedItem.value = undefined
    itemError.value = undefined
    persistSession()
    if (entry.examples.length === 1) {
      const only = entry.examples[0]
      if (only) await openVuetifyMeta(only)
    }
  }

  async function openVuetifyMeta (meta: VuetifyExampleMeta) {
    if (opening.value) return
    opening.value = true
    lastVuetifyMeta.value = meta
    itemError.value = undefined
    try {
      await playground.openVuetifyExample({ path: meta.path })
      emit('close')
    } catch (error) {
      itemError.value = error instanceof Error ? error.message : String(error)
    } finally {
      opening.value = false
    }
  }

  async function onRetryVuetify () {
    const meta = lastVuetifyMeta.value
    if (meta) {
      await openVuetifyMeta(meta)
      return
    }
    // Single-example drill-in with no prior meta: back to gallery.
    selectedVuetify.value = undefined
    itemError.value = undefined
  }

  function onClearQuery () {
    query.value = ''
    persistSession()
    nextTick(() => input.value?.focus())
  }

  function onSelectGallery (entry: RegistryIndexEntry) {
    if (rail.value === 'vuetify') {
      const hit = vuetifyItems.find(c => c.name === entry.name)
      if (hit) void onSelectVuetify(hit)
      return
    }
    void onSelectFeature(entry)
  }

  function railActiveClass (id: OpenRail) {
    const active = rail.value === id
    const drilled = Boolean(selected.value || selectedVuetify.value)
    if (active && !drilled) return 'bg-surface-tint text-on-surface font-medium'
    if (active && drilled) return 'bg-surface-tint/60 text-on-surface font-medium'
    return 'text-on-surface-variant hover:bg-surface-tint/60 hover:text-on-surface'
  }

  function railCount (id: OpenRail): number | undefined {
    if (id === 'v0') {
      if (examplesLoading.value || examplesError.value) return undefined
      return items.value.length
    }
    if (id === 'vuetify') return vuetifyItems.length
    if (id === 'saved' && savedLoaded.value) return saved.value.length
    return undefined
  }

  async function openSaved (item: VuetifyPlayground) {
    let content = item.content
    let owner = item.owner?.id
    if (!content) {
      const res = await fetch(`${ONE_API}/one/playgrounds/${item.id}`, {
        credentials: 'include',
      })
      if (!res.ok) return
      const data = await res.json()
      const playground_ = data.playground ?? data
      content = playground_.content
      owner = playground_.owner?.id ?? owner
    }
    if (!content) return
    // Pause autosave while REPL loads so we don't POST the previous editor state.
    one.pauseAutosave()
    try {
      // Skip URL sync here — we'll use navigateToPlayground for explicit push navigation
      one.setCurrent(item.id, item.title || 'Untitled', {
        favorite: item.favorite ?? false,
        pinned: item.pinned ?? false,
        locked: item.locked ?? false,
        visibility: item.visibility ?? 'public',
      }, { skipUrlSync: true, owner })
      one.markSynced(content)
      emit('close')
      await playground.openPlayground(content)
      // Navigate to the canonical playground URL (uses router.push for history)
      one.navigateToPlayground(item.id)
    } finally {
      one.resumeAutosave()
    }
  }
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex items-center justify-center"
      tabindex="-1"
      @keydown.esc="selected || selectedVuetify ? onBack() : $emit('close')"
    >
      <div
        class="absolute inset-0 bg-black/50"
        @click="$emit('close')"
      />

      <div
        aria-labelledby="open-title"
        aria-modal="true"
        class="relative bg-surface border border-divider rounded-lg shadow-xl w-[900px] max-w-[calc(100vw-2rem)] h-[640px] max-h-[calc(100vh-2rem)] flex overflow-hidden"
        role="dialog"
      >
        <!-- Left rail: product stacks (same search model) + Vuetify One -->
        <nav class="w-36 shrink-0 border-r border-divider flex flex-col gap-1 py-2 bg-surface">
          <template v-for="item in rails" :key="item.id">
            <div
              v-if="item.id === 'saved'"
              class="mx-3 my-2 border-t border-divider"
            />

            <button
              class="mx-1.5 flex items-center justify-between gap-2 px-2.5 py-2 text-xs text-left rounded-md transition-colors"
              :class="railActiveClass(item.id)"
              type="button"
              @click="onRail(item.id)"
            >
              <span class="truncate">{{ item.label }}</span>

              <span
                v-if="railCount(item.id) !== undefined"
                class="tabular-nums text-[10px] text-on-surface-variant shrink-0"
              >
                {{ railCount(item.id) }}
              </span>
            </button>
          </template>
        </nav>

        <!-- Main pane -->
        <div class="flex-1 flex flex-col min-w-0 min-h-0">
          <div class="relative overflow-hidden flex items-start justify-between gap-3 px-4 py-3 border-b border-divider shrink-0">
            <AppDotGrid :coverage="55" origin="bottom right" />

            <div class="relative z-10 min-w-0 flex items-start gap-3">
              <div
                v-if="(selected || selectedVuetify) && selectedAccent"
                class="w-9 h-9 rounded-md border border-divider/60 shrink-0 flex items-center justify-center"
                :style="{ background: selectedAccent.bg }"
              >
                <AppIcon
                  :icon="selectedIcon!"
                  :size="20"
                  :style="{ color: selectedAccent.fg, opacity: 1 }"
                />
              </div>

              <div class="min-w-0">
                <div v-if="selected || selectedVuetify" class="flex items-center gap-1.5 mb-0.5">
                  <button
                    class="text-[11px] text-on-surface-variant hover:text-primary transition-colors"
                    type="button"
                    @click="onBack"
                  >
                    {{ railLabel }}
                  </button>

                  <span class="text-[11px] text-on-surface-variant/50">/</span>

                  <span class="text-[11px] text-on-surface-variant truncate">
                    {{ selectedVuetify?.title || selectedVuetify?.name || selected?.title || selected?.name }}
                  </span>
                </div>

                <h2 id="open-title" class="text-sm font-medium truncate">
                  {{ selectedVuetify
                    ? (selectedVuetify.title || selectedVuetify.name)
                    : selected
                      ? (selected.title || selected.name)
                      : railLabel }}
                </h2>

                <p class="text-[11px] text-on-surface-variant mt-0.5 truncate">
                  <template v-if="selectedVuetify">
                    {{ selectedVuetify.name }}
                    · {{ exampleLabel(selectedVuetify.examples.length) }}
                    · {{ VUETIFY_EXAMPLES.repo }}@{{ VUETIFY_EXAMPLES.ref }}
                  </template>

                  <template v-else-if="selected">
                    {{ selected.type }}/{{ selected.name }}
                    <template v-if="selectedItem">
                      · {{ exampleLabel(selectedItem.examples.length) }}
                    </template>
                  </template>

                  <template v-else>
                    {{ subtitle }}
                  </template>
                </p>

                <a
                  v-if="selectedDocsHref"
                  class="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-1"
                  :href="selectedDocsHref"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View docs ↗
                </a>
              </div>
            </div>

            <AppCloseButton class="relative z-10" @click="$emit('close')" />
          </div>

          <div
            v-if="showSearch || showKindChips || showSavedChips || showSavedSort"
            class="px-4 py-2.5 border-b border-divider shrink-0 flex flex-col gap-2"
          >
            <div
              v-if="showSearch"
              class="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-divider bg-surface-tint/40 focus-within:border-primary/50 transition-colors"
            >
              <AppIcon class="shrink-0 text-on-surface-variant" icon="search" :size="16" />

              <input
                ref="input"
                v-model="query"
                class="flex-1 min-w-0 bg-transparent text-sm text-on-surface outline-none placeholder-on-surface-variant/50"
                :placeholder="searchPlaceholder"
                type="search"
              >

              <AppCloseButton
                v-if="query"
                label="Clear search"
                size="sm"
                @click="onClearQuery"
              />
            </div>

            <div
              v-if="showKindChips"
              aria-label="Filter by kind"
              class="flex flex-wrap gap-1.5"
              role="group"
            >
              <button
                v-for="chip in kindChips"
                :key="chip.id"
                :aria-pressed="kind === chip.id"
                class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] transition-colors border"
                :class="kind === chip.id
                  ? 'border-primary bg-primary/10 text-primary font-medium'
                  : 'border-divider text-on-surface-variant hover:border-primary/40 hover:text-on-surface'"
                type="button"
                @click="onKind(chip.id)"
              >
                <span>{{ chip.label }}</span>
                <span class="tabular-nums opacity-70">{{ chip.count }}</span>
              </button>
            </div>

            <div
              v-if="showSavedChips || showSavedSort"
              class="flex flex-wrap items-center justify-between gap-2"
            >
              <div
                v-if="showSavedChips"
                aria-label="Filter Vuetify One"
                class="flex flex-wrap gap-1.5"
                role="group"
              >
                <button
                  v-for="chip in savedChips"
                  :key="chip.id"
                  :aria-pressed="savedChip === chip.id"
                  class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] transition-colors border"
                  :class="savedChip === chip.id
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-divider text-on-surface-variant hover:border-primary/40 hover:text-on-surface'"
                  type="button"
                  @click="onSavedChip(chip.id)"
                >
                  <span>{{ chip.label }}</span>
                  <span class="tabular-nums opacity-70">{{ chip.count }}</span>
                </button>
              </div>

              <div
                v-if="showSavedSort"
                aria-label="Sort Vuetify One"
                class="flex flex-wrap gap-1.5"
                role="group"
              >
                <button
                  v-for="chip in savedSortChips"
                  :key="chip.id"
                  :aria-pressed="savedSort === chip.id"
                  class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] transition-colors border"
                  :class="savedSort === chip.id
                    ? 'border-primary bg-primary/10 text-primary font-medium'
                    : 'border-divider text-on-surface-variant hover:border-primary/40 hover:text-on-surface'"
                  type="button"
                  @click="onSavedSort(chip.id)"
                >
                  <span>{{ chip.label }}</span>

                  <span
                    v-if="savedSort === chip.id"
                    class="opacity-70"
                  >{{ savedSortDir === 'asc' ? '↑' : '↓' }}</span>
                </button>
              </div>
            </div>
          </div>

          <div
            ref="pane"
            class="flex-1 overflow-y-auto min-h-0"
            @scroll.passive="onPaneScroll"
          >
            <PlaygroundOpenExamples
              v-if="selectedVuetify"
              :active-id="activeExampleId"
              :error="itemError"
              :item="selectedVuetifyAsItem"
              :loading="false"
              :opening
              @open="openExample"
              @retry="onRetryVuetify"
            />

            <PlaygroundOpenExamples
              v-else-if="selected"
              :active-id="activeExampleId"
              cli
              :error="itemError"
              :item="selectedItem"
              :loading="itemLoading"
              :opening
              @open="openExample"
              @retry="onRetryFeature"
            />

            <PlaygroundOpenSaved
              v-else-if="rail === 'saved'"
              :error="savedError"
              :items="filteredSaved"
              :loading="savedLoading"
              :pinned="pinnedItems"
              :query
              :total="saved.length"
              @open="openSaved"
              @unpin="onUnpin"
            />

            <PlaygroundOpenGallery
              v-else-if="rail === 'vuetify'"
              :error="undefined"
              icon-override="vuetify"
              :items="filteredVuetifyEntries"
              :last-feature="galleryLastFeature"
              :loading="false"
              :query
              :rail-label
              :total="vuetifyItems.length"
              @retry="() => {}"
              @select="onSelectGallery"
            />

            <PlaygroundOpenGallery
              v-else
              :error="examplesError"
              :items="filtered"
              :last-feature="galleryLastFeature"
              :loading="examplesLoading"
              :query
              :rail-label
              :total="kindItems.length"
              @retry="loadExamples"
              @select="onSelectGallery"
            />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
