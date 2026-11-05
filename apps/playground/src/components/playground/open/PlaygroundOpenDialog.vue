<script setup lang="ts">
  // Framework
  import { createFilter, IN_BROWSER, Select, Switch, useStorage } from '@vuetify/v0'

  // Components
  import AppCloseButton from '@/components/app/AppCloseButton.vue'
  import AppIcon from '@/components/app/AppIcon.vue'
  import AppTooltip from '@/components/app/AppTooltip.vue'
  import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

  // Context
  import PlaygroundOpenBins from './PlaygroundOpenBins.vue'
  import PlaygroundOpenExamples from './PlaygroundOpenExamples.vue'
  import PlaygroundOpenGallery from './PlaygroundOpenGallery.vue'
  import PlaygroundOpenSaved from './PlaygroundOpenSaved.vue'

  // Composables
  import {
    filterPlaygroundsByScope,
    playgroundScope,
    playgroundTeamId,
    readUserTeam,
    settledTeamId,
    shouldAssignTeam,
  } from '@/composables/teamPlaygrounds'
  import { ONE_API, useOnePlaygrounds } from '@/composables/useOnePlaygrounds'

  // Data
  import { resolveFeatureAccent, resolveFeatureIcon } from '@/data/feature-icons'
  import { DEFAULT_REGISTRY, getRegistryIndex, getRegistryItem } from '@/data/registry'
  import { getVuetifyComponents, VUETIFY_EXAMPLES, vuetifyDocsUrl } from '@/data/vuetify-examples'

  // Local
  import { readOpenSession, touchOpenSession, writeOpenSession } from './open-session'
  import {
    binsOfType,
    binTypeOptions,
    exampleLabel,
    featureBucket,
    normalizeOpenRail,
    sortPlaygrounds,
    type OpenKind,
    type OpenRail,
    type OpenRailItem,
    type OpenSavedChip,
    type OpenSavedSort,
    type VuetifyBin,
    type VuetifyPlayground,
  } from './types'

  // Stores
  import { useAuthStore } from '@vuetify/auth'

  // Utilities
  import { isNumber } from '#v0/utilities'
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, toRef, useTemplateRef, watch } from 'vue'

  // Types
  import type { RegistryExample, RegistryIndexEntry, RegistryItem } from '@/data/registry'
  import type { VuetifyComponentEntry, VuetifyExampleMeta } from '@/data/vuetify-examples'

  const rail = defineModel<OpenRail>('rail', { required: true })
  const emit = defineEmits<{ close: [] }>()

  const playground = usePlayground()
  const auth = useAuthStore()
  const one = useOnePlaygrounds()
  const userTeam = toRef(() => readUserTeam(auth.user))
  const savedScope = toRef(() => userTeam.value ? playgroundScope.value : 'personal')
  const assigning = shallowRef(false)
  const storage = useStorage()
  /** Optional larger Open card. Restore puts it back; it does not dismiss. */
  const maximized = storage.get('playground-open-maximized', false)
  /** Last pulled totals. Shown until this open's list request finishes. */
  const playCount = storage.get<number | undefined>('playground-open-play-count')
  const binCount = storage.get<number | undefined>('playground-open-bin-count')
  const restored = readOpenSession()
  if (restored?.rail) rail.value = normalizeOpenRail(restored.rail)
  const query = shallowRef(restored?.query ?? '')
  /** Vuetify0 kind chip — Components / Composables / Plugins (or all). */
  const kind = shallowRef<OpenKind | 'all'>(restored?.kind ?? 'all')
  const savedChip = shallowRef<OpenSavedChip>(restored?.savedChip ?? 'all')
  const savedSort = shallowRef<OpenSavedSort>(restored?.savedSort ?? 'updated')
  const savedSortDir = shallowRef<'asc' | 'desc'>(restored?.savedSortDir ?? 'desc')
  /** Vuetify Bin file-type filter. `all` or a language id from `binTypeKey`. */
  const binType = shallowRef(restored?.binType ?? 'all')
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

  // ── Vuetify Bins (same One session, separate product) ───────────────
  const bins = ref<VuetifyBin[]>([])
  const binsLoading = shallowRef(false)
  const binsError = shallowRef<string>()
  const binsLoaded = shallowRef(false)

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

  const yoursRails: OpenRailItem[] = [
    { id: 'saved', label: 'Vuetify Play' },
    { id: 'bins', label: 'Vuetify Bin' },
  ]
  const exampleRails: OpenRailItem[] = [
    { id: 'v0', label: 'Vuetify0' },
    { id: 'vuetify', label: 'Vuetify 4' },
  ]
  const rails: OpenRailItem[] = [...yoursRails, ...exampleRails]

  const railLabel = computed(() =>
    rails.find(r => r.id === rail.value)?.label ?? 'Examples',
  )

  /** Icon mark beside the content title. Hidden once a gallery item is open. */
  const railMark = computed(() => {
    if (rail.value === 'saved') return 'https://cdn.vuetifyjs.com/docs/images/one/logos/vplay.svg'
    if (rail.value === 'bins') return 'https://cdn.vuetifyjs.com/docs/images/one/logos/vbin.svg'
    if (rail.value === 'v0') return 'https://cdn.vuetifyjs.com/docs/images/one/logos/vzero.svg'
    if (rail.value === 'vuetify') return 'https://cdn.vuetifyjs.com/docs/images/one/logos/vuetify.svg'
    return undefined
  })

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

  const scopedSaved = computed(() => filterPlaygroundsByScope(saved.value, savedScope.value))

  const savedCounts = computed(() => ({
    favorite: scopedSaved.value.filter(item => item.favorite).length,
    pinned: scopedSaved.value.filter(item => item.pinned).length,
  }))

  const savedChips = computed(() => [
    { id: 'all' as const, label: 'All', count: scopedSaved.value.length },
    { id: 'favorite' as const, label: 'Favorites', count: savedCounts.value.favorite },
  ].filter(chip => chip.id === 'all' || chip.count > 0))

  const pinnedItems = computed(() =>
    sortPlaygrounds(
      scopedSaved.value.filter(item => item.pinned),
      savedSort.value,
      savedSortDir.value,
    ),
  )

  const savedPool = computed(() => {
    const unpinned = scopedSaved.value.filter(item => !item.pinned)
    const pool = savedChip.value === 'favorite'
      ? unpinned.filter(item => item.favorite)
      : unpinned
    return sortPlaygrounds(pool, savedSort.value, savedSortDir.value)
  })

  const binsCounts = computed(() => ({
    favorite: bins.value.filter(item => item.favorite).length,
  }))

  const binsChips = computed(() => [
    { id: 'all' as const, label: 'All', count: bins.value.length },
    { id: 'favorite' as const, label: 'Favorites', count: binsCounts.value.favorite },
  ].filter(chip => chip.id === 'all' || chip.count > 0))

  const pinnedBins = computed(() =>
    sortPlaygrounds(
      bins.value.filter(item => item.pinned),
      savedSort.value,
      savedSortDir.value,
    ),
  )

  const binTypes = toRef(() => binTypeOptions(bins.value))

  const binTypeItems = toRef(() => [
    { id: 'all', label: 'All types', count: bins.value.length, icon: '', color: '' },
    ...binTypes.value,
  ])

  const binTypeLabel = toRef(() => {
    if (binType.value === 'all') return 'Type'
    return binTypes.value.find(item => item.id === binType.value)?.label ?? 'Type'
  })

  const binsPool = computed(() => {
    const unpinned = bins.value.filter(item => !item.pinned)
    const pool = savedChip.value === 'favorite'
      ? unpinned.filter(item => item.favorite)
      : unpinned
    return sortPlaygrounds(binsOfType(pool, binType.value), savedSort.value, savedSortDir.value)
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

  const filterableBins = computed(() =>
    binsPool.value.map(item => ({
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

  const binsFilter = createFilter({
    keys: ['title', 'id'],
    mode: 'some',
  })
  const { items: filteredBins } = binsFilter.apply(() => query.value, filterableBins)

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
    if (rail.value === 'saved') return 'Filter Vuetify Play…'
    if (rail.value === 'bins') return 'Filter Vuetify Bin…'
    if (rail.value === 'vuetify') return 'Filter Vuetify 4…'
    return 'Filter Vuetify0…'
  })

  const showSearch = computed(() => {
    if (selected.value || selectedVuetify.value) return false
    if (rail.value === 'saved') {
      return !savedLoading.value && !savedError.value && scopedSaved.value.length > 0
    }
    if (rail.value === 'bins') {
      return !binsLoading.value && !binsError.value && bins.value.length > 0
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
    && scopedSaved.value.length > 0
    && savedChips.value.length > 1,
  )

  const showSavedSort = computed(() =>
    rail.value === 'saved'
    && !savedLoading.value
    && !savedError.value
    && scopedSaved.value.length > 0,
  )

  const showTeamSwitch = computed(() =>
    rail.value === 'saved'
    && !selected.value
    && !selectedVuetify.value
    && userTeam.value !== null
    && !savedLoading.value
    && !savedError.value,
  )

  const showBinsChips = computed(() =>
    rail.value === 'bins'
    && !binsLoading.value
    && !binsError.value
    && bins.value.length > 0
    && binsChips.value.length > 1,
  )

  const showBinsSort = computed(() =>
    rail.value === 'bins'
    && !binsLoading.value
    && !binsError.value
    && bins.value.length > 0,
  )

  const showBinType = computed(() =>
    rail.value === 'bins'
    && !binsLoading.value
    && !binsError.value
    && binTypes.value.length > 1,
  )

  watch(binTypes, options => {
    if (!binsLoaded.value || binType.value === 'all') return
    if (options.some(option => option.id === binType.value)) return
    binType.value = 'all'
    persistSession()
  })

  const listChips = computed(() => rail.value === 'bins' ? binsChips.value : savedChips.value)
  const showListChips = computed(() => showSavedChips.value || showBinsChips.value)
  const showListSort = computed(() => showSavedSort.value || showBinsSort.value)

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
    if (rail.value === 'bins') {
      if (binsLoading.value) return 'Loading…'
      if (binsError.value) return 'Could not load'
      const n = filteredBins.value.length
      return n === 1 ? '1 bin' : `${n} bins`
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
    if (rail.value === 'bins') await loadBins()
    await loadExamples()
    // Re-enter the examples pane if the user closed while drilled in.
    if (pendingSelectedName.value && rail.value !== 'saved' && rail.value !== 'bins') {
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
      binType: binType.value,
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
      saved.value = await one.list()
      savedLoaded.value = true
    } catch (error) {
      if (error instanceof Error && error.message === 'Sign in required') {
        savedError.value = 'Session expired. Please sign in again.'
      } else if (error instanceof Error) {
        savedError.value = error.message
      } else {
        savedError.value = 'Failed to load playgrounds'
      }
    } finally {
      savedLoading.value = false
      await nextTick()
      restoreScroll()
    }
  }

  async function loadBins () {
    if (binsLoaded.value || binsLoading.value) return
    binsLoading.value = true
    binsError.value = undefined
    try {
      const rows = await one.listBins()
      bins.value = rows.map(item => ({
        id: item.id,
        title: item.title || '',
        content: item.content ?? '',
        language: item.language,
        favorite: item.favorite,
        pinned: item.pinned,
        createdAt: item.createdAt ?? '',
        updatedAt: item.updatedAt ?? '',
      }))
      binsLoaded.value = true
    } catch (error) {
      if (error instanceof Error && error.message === 'Sign in required') {
        binsError.value = 'Session expired. Please sign in again.'
      } else if (error instanceof Error) {
        binsError.value = error.message
      } else {
        binsError.value = 'Failed to load bins'
      }
    } finally {
      binsLoading.value = false
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
    binType.value = 'all'
    pendingScroll.value = 0
    pendingExamplesScroll.value = 0
    if (pane.value) pane.value.scrollTop = 0
    persistSession()
    if (next === 'saved') await loadSaved()
    if (next === 'bins') await loadBins()
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

  function onBinType () {
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
      await one.patchMeta({ pinned: false }, item.id, {
        title: item.title,
        favorite: item.favorite ?? false,
        pinned: item.pinned ?? false,
        locked: item.locked ?? false,
        visibility: item.visibility ?? 'public',
      })
      saved.value = saved.value.map(entry => (
        entry.id === item.id ? { ...entry, pinned: false } : entry
      ))
    } catch {
      // leave the row pinned if the API rejects
    }
  }

  function onTeamScope (team: boolean) {
    playgroundScope.value = team ? 'team' : 'personal'
  }

  async function onAssign (payload: { ids: string[], teamId: string | null }) {
    if (assigning.value) return
    assigning.value = true
    const userId = auth.user?.id
    try {
      for (const id of payload.ids) {
        const item = saved.value.find(entry => entry.id === id)
        if (!item || !shouldAssignTeam(item, userId, payload.teamId)) continue
        try {
          const result = await one.patchMeta({ teamId: payload.teamId }, item.id, {
            title: item.title,
            favorite: item.favorite ?? false,
            pinned: item.pinned ?? false,
            locked: item.locked ?? false,
            visibility: item.visibility ?? 'public',
            teamId: playgroundTeamId(item),
          })
          const teamId = settledTeamId(playgroundTeamId(item), result, true)
          onUpdate({ ...item, ...result, teamId })
        } catch {
          // Leave the row. The next list load shows the server value.
        }
      }
    } finally {
      assigning.value = false
    }
  }

  function onUpdate (next: VuetifyPlayground) {
    saved.value = saved.value.map(entry => (
      entry.id === next.id ? { ...entry, ...next } : entry
    ))
  }

  function onRemove (id: string) {
    saved.value = saved.value.filter(entry => entry.id !== id)
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
    if (id === 'saved') {
      if (savedLoaded.value) return saved.value.length
      if (isNumber(playCount.value)) return playCount.value
    }
    if (id === 'bins') {
      if (binsLoaded.value) return bins.value.length
      if (isNumber(binCount.value)) return binCount.value
    }
    return undefined
  }

  // Persist only a finished pull (and later edits to that list). A failed
  // request leaves the previous total in place.
  watch(() => savedLoaded.value ? saved.value.length : undefined, count => {
    if (isNumber(count)) playCount.value = count
  })
  watch(() => binsLoaded.value ? bins.value.length : undefined, count => {
    if (isNumber(count)) binCount.value = count
  })

  function openBin (item: VuetifyBin) {
    if (!IN_BROWSER) return
    window.open(`https://bin.vuetifyjs.com/bins/${encodeURIComponent(item.id)}`, '_blank', 'noopener')
  }

  function toBinFile (item: VuetifyBin) {
    return {
      title: item.title,
      language: item.language ?? '',
      content: item.content,
    }
  }

  function copyBin (item: VuetifyBin) {
    copyBins([item])
  }

  function copyBins (items: VuetifyBin[]) {
    if (opening.value || items.length === 0) return

    opening.value = true
    try {
      playground.copyBins(items.map(toBinFile))
      emit('close')
    } catch (error) {
      binsError.value = error instanceof Error ? error.message : String(error)
    } finally {
      opening.value = false
    }
  }

  async function openSaved (item: VuetifyPlayground) {
    let content = item.content
    let owner = item.owner?.id
    let teamId = item.teamId ?? null
    if (!content) {
      const res = await fetch(`${ONE_API}/one/playgrounds/${item.id}`, {
        credentials: 'include',
      })
      if (!res.ok) return
      const data = await res.json()
      const playground_ = data.playground ?? data
      content = playground_.content
      owner = playground_.owner?.id ?? owner
      if (Object.hasOwn(playground_, 'teamId')) teamId = playground_.teamId || null
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
      }, { skipUrlSync: true, owner, teamId })
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
        class="relative bg-surface border border-divider rounded-lg shadow-xl flex flex-col sm:flex-row overflow-hidden"
        :class="maximized
          ? 'w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]'
          : 'w-[900px] max-w-[calc(100vw-2rem)] h-[640px] max-h-[calc(100vh-2rem)]'"
        role="dialog"
      >
        <!-- Left rail: your One content, then example stacks -->
        <nav
          aria-label="Open source"
          class="flex flex-row flex-wrap sm:flex-nowrap sm:flex-col w-full sm:w-36 shrink-0 border-b sm:border-b-0 sm:border-r border-divider gap-1 p-2 bg-surface"
        >
          <p class="hidden sm:block mx-3 mt-1 mb-0.5 text-[10px] font-medium uppercase tracking-wide text-on-surface-variant">
            Vuetify One
          </p>

          <button
            v-for="item in yoursRails"
            :key="item.id"
            :aria-pressed="rail === item.id"
            class="flex-1 sm:flex-none min-w-0 mx-0 sm:mx-1.5 flex items-center justify-center sm:justify-between gap-2 px-2.5 py-1.5 sm:py-2 text-xs text-center sm:text-left rounded-md transition-colors"
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

          <div class="hidden sm:block mx-3 my-2 border-t border-divider" />

          <p class="hidden sm:block mx-3 mb-0.5 text-[10px] font-medium uppercase tracking-wide text-on-surface-variant">
            Examples
          </p>

          <button
            v-for="item in exampleRails"
            :key="item.id"
            :aria-pressed="rail === item.id"
            class="flex-1 sm:flex-none min-w-0 mx-0 sm:mx-1.5 flex items-center justify-center sm:justify-between gap-2 px-2.5 py-1.5 sm:py-2 text-xs text-center sm:text-left rounded-md transition-colors"
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

                <h2 id="open-title" class="text-sm font-medium flex items-center gap-1.5 min-w-0">
                  <img
                    v-if="!selected && !selectedVuetify && railMark"
                    alt=""
                    class="h-4 w-4 shrink-0"
                    :src="railMark"
                  >

                  <span class="truncate">
                    {{ selectedVuetify
                      ? (selectedVuetify.title || selectedVuetify.name)
                      : selected
                        ? (selected.title || selected.name)
                        : railLabel }}
                  </span>
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

            <div class="relative z-10 flex items-center gap-1">
              <div class="hidden sm:block">
                <AppTooltip
                  :aria-label="maximized ? 'Restore' : 'Maximize'"
                  :aria-pressed="maximized"
                  class="close-button"
                  :style="{ width: '24px', height: '24px' }"
                  :text="maximized ? 'Restore' : 'Maximize'"
                  @click="maximized = !maximized"
                >
                  <AppIcon :icon="maximized ? 'fullscreen-exit' : 'fullscreen'" :size="14" />
                </AppTooltip>
              </div>

              <AppCloseButton @click="$emit('close')" />
            </div>
          </div>

          <div
            v-if="showSearch || showKindChips || showListChips || showListSort || showTeamSwitch"
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
              v-if="showListChips || showListSort || showTeamSwitch"
              class="flex flex-wrap items-center justify-between gap-2"
            >
              <div
                v-if="showTeamSwitch || showListChips || showBinType"
                class="flex flex-wrap items-center gap-1.5"
              >
                <AppTooltip
                  v-if="showTeamSwitch"
                  as="span"
                  class="inline-flex"
                  position-area="top"
                  text="Show playgrounds shared with your team"
                >
                  <span class="inline-flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                    <Switch.Root
                      class="inline-flex items-center border-none bg-transparent p-0 outline-none"
                      label="Team"
                      :model-value="savedScope === 'team'"
                      @update:model-value="onTeamScope"
                    >
                      <Switch.Track class="relative inline-flex items-center rounded-full transition-colors h-4 w-7 bg-surface-variant data-[state=checked]:bg-primary">
                        <Switch.Thumb class="block size-3 rounded-full bg-on-surface-variant shadow-sm transition-transform translate-x-0.5 data-[state=checked]:translate-x-3.5 data-[state=checked]:bg-on-primary" />
                      </Switch.Track>
                    </Switch.Root>

                    <span>Team</span>
                  </span>
                </AppTooltip>

                <div
                  v-if="showListChips"
                  :aria-label="rail === 'bins' ? 'Filter Vuetify Bin' : 'Filter Vuetify Play'"
                  class="flex flex-wrap gap-1.5"
                  role="group"
                >
                  <button
                    v-for="chip in listChips"
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

                <Select.Root
                  v-if="showBinType"
                  v-model="binType"
                  mandatory
                  @update:model-value="onBinType"
                >
                  <Select.Activator
                    aria-label="Filter by file type"
                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border transition-colors cursor-pointer"
                    :class="binType === 'all'
                      ? 'border-divider text-on-surface-variant hover:border-primary/40 hover:text-on-surface'
                      : 'border-primary bg-primary/10 text-primary font-medium'"
                  >
                    <span>{{ binTypeLabel }}</span>

                    <Select.Cue class="flex items-center transition-transform data-[state=open]:rotate-180">
                      <AppIcon icon="chevron-down" :size="12" />
                    </Select.Cue>
                  </Select.Activator>

                  <Select.Content class="z-20 bg-surface border border-divider rounded-md shadow-lg py-1 min-w-40 max-h-60 overflow-y-auto">
                    <Select.Item
                      v-for="item in binTypeItems"
                      :id="item.id"
                      :key="item.id"
                      v-slot="{ isSelected }"
                      class="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-left text-on-surface cursor-pointer hover:bg-surface-tint data-[highlighted]:bg-surface-tint data-[selected]:text-primary"
                      :value="item.id"
                    >
                      <AppIcon
                        v-if="item.icon"
                        class="shrink-0"
                        :icon="item.icon"
                        :size="14"
                        :style="{ color: item.color }"
                      />

                      <span
                        v-else
                        class="size-3.5 shrink-0"
                      />

                      <span class="flex-1 truncate">{{ item.label }}</span>

                      <span
                        class="tabular-nums text-[10px] opacity-70"
                        :class="isSelected ? 'text-primary' : 'text-on-surface-variant'"
                      >{{ item.count }}</span>
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>

              <div
                v-if="showListSort"
                :aria-label="rail === 'bins' ? 'Sort Vuetify Bin' : 'Sort Vuetify Play'"
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
            class="flex-1 min-h-0"
            :class="(rail === 'saved' || rail === 'bins') && !selected && !selectedVuetify
              ? 'overflow-hidden flex flex-col'
              : 'overflow-y-auto'"
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

            <PlaygroundOpenBins
              v-else-if="rail === 'bins'"
              :catalog="bins"
              :error="binsError"
              :items="filteredBins"
              :loading="binsLoading"
              :pinned="pinnedBins"
              :query
              :total="bins.length"
              @copy="copyBin"
              @copy-many="copyBins"
              @open="openBin"
            />

            <PlaygroundOpenSaved
              v-else-if="rail === 'saved'"
              :assigning
              :can-team="userTeam !== null"
              :catalog="scopedSaved"
              :empty="savedScope === 'team' ? 'No team playgrounds' : 'No Vuetify Play playgrounds'"
              :error="savedError"
              :items="filteredSaved"
              :loading="savedLoading"
              :pinned="pinnedItems"
              :query
              :scope="savedScope"
              :total="scopedSaved.length"
              :user-team-id="userTeam?.id"
              @assign="onAssign"
              @open="openSaved"
              @remove="onRemove"
              @unpin="onUnpin"
              @update="onUpdate"
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
