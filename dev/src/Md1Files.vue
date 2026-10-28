<script setup lang="ts">
  // Components
  import { Md1Button, Md1GridList, Md1Snackbar, Md1ToggleButtons, md1Breakpoints, md1Icons } from '@paper/md1'

  // Framework
  import { useBreakpoints } from '@vuetify/v0'

  // Context
  import Md1Shell from './Md1Shell.vue'

  // Utilities
  import { ref, shallowRef, toRef } from 'vue'

  type Kind = 'folder' | 'image' | 'document' | 'sheet'

  interface Item {
    id: number
    name: string
    kind: Kind
    /** The second bar line: size and date, or the folder's count. */
    meta: string
  }

  const all: Item[] = [
    { id: 1, name: 'Projects', kind: 'folder', meta: '14 items · Oct 21' },
    { id: 2, name: 'Site assets', kind: 'folder', meta: '48 items · Oct 9' },
    { id: 3, name: 'Receipts', kind: 'folder', meta: '26 items · Sep 30' },
    { id: 4, name: 'Harbour at dawn.png', kind: 'image', meta: '4.1 MB · Oct 18' },
    { id: 5, name: 'Pine ridge.jpg', kind: 'image', meta: '6.8 MB · Oct 14' },
    { id: 6, name: 'Team offsite.jpg', kind: 'image', meta: '3.2 MB · Oct 6' },
    { id: 7, name: 'Launch banner.png', kind: 'image', meta: '2.7 MB · Sep 28' },
    { id: 8, name: 'Quarterly review.doc', kind: 'document', meta: '318 KB · Oct 20' },
    { id: 9, name: 'Release notes.doc', kind: 'document', meta: '96 KB · Oct 11' },
    { id: 10, name: 'Onboarding guide.pdf', kind: 'document', meta: '1.4 MB · Sep 24' },
    { id: 11, name: 'Budget 2027.xls', kind: 'sheet', meta: '242 KB · Oct 17' },
    { id: 12, name: 'Inventory.xls', kind: 'sheet', meta: '187 KB · Oct 3' },
  ]

  /** A type's flat field colour (Material palette 300s) and its glyph role. */
  const palette: Record<Kind, { icon: keyof typeof md1Icons, field: string }> = {
    folder: { icon: 'folder', field: '#90A4AE' },
    image: { icon: 'photo', field: '#4DB6AC' },
    document: { icon: 'content-copy', field: '#7986CB' },
    sheet: { icon: 'apps', field: '#81C784' },
  }

  /**
   * A tile thumbnail as an inline SVG data URI: a flat colour field with the
   * type's md1 glyph, drawn from the same path data `Md1Icon` renders. Passed
   * as the tile's image so the ripple, hover ink and fade-in stay stacked the
   * way the grid list draws them; the demo ships no raster images.
   */
  function thumb (kind: Kind) {
    const { icon, field } = palette[kind]
    const paths = md1Icons[icon].map(d => `<path d="${d}"/>`).join('')

    return 'data:image/svg+xml,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="${field}"/><g fill="#FFFFFF" fill-opacity="0.9" transform="translate(30 30) scale(1.5)">${paths}</g></svg>`,
    )
  }

  const thumbs: Record<Kind, string> = {
    folder: thumb('folder'),
    image: thumb('image'),
    document: thumb('document'),
    sheet: thumb('sheet'),
  }

  const { width } = useBreakpoints()

  /** 2 on a phone, 3 from the 600 breakpoint, 4 from 1280, over the default 4 dp gutter. */
  const columns = toRef(() => width.value >= md1Breakpoints[1280] ? 4 : (width.value >= md1Breakpoints[600] ? 3 : 2))

  const filter = shallowRef<'all' | Kind>('all')
  const chosen = ref<number[]>([])

  /** Ids removed from the grid; the snackbar's Undo takes the last batch back out. */
  const gone = ref<number[]>([])
  const batch = ref<number[]>([])
  const open = shallowRef(false)
  const note = shallowRef('')

  const shown = toRef(() => all.filter(item =>
    !gone.value.includes(item.id)
    && (filter.value === 'all' || item.kind === filter.value),
  ))

  const total = toRef(() => all.length - gone.value.length)

  function onToggle (id: number) {
    chosen.value = chosen.value.includes(id)
      ? chosen.value.filter(value => value !== id)
      : [...chosen.value, id]
  }

  function onClear () {
    chosen.value = []
  }

  function onDelete () {
    const ids = [...chosen.value]

    batch.value = ids
    gone.value = [...gone.value, ...ids]
    chosen.value = []
    note.value = ids.length === 1 ? 'Deleted 1 item' : `Deleted ${ids.length} items`
    open.value = true
  }

  function onUndo () {
    const ids = new Set(batch.value)

    gone.value = gone.value.filter(id => !ids.has(id))
    batch.value = []
  }
</script>

<template>
  <Md1Shell title="Files">
    <div class="md1-demo-files">
      <!-- The selection pattern's contextual bar replaces the filter row while tiles are selected, as the data table's contextual header does. -->
      <div class="md1-demo-files__bar">
        <template v-if="chosen.length > 0">
          <span class="md1-demo-files__count" role="status">
            {{ chosen.length === 1 ? '1 item selected' : `${chosen.length} items selected` }}
          </span>

          <Md1Button aria-label="Clear selection" icon="close" @click="onClear" />

          <Md1Button aria-label="Delete selected" icon="delete" @click="onDelete" />
        </template>

        <Md1ToggleButtons v-else v-model="filter" label="Show" mandatory>
          <Md1ToggleButtons.Item value="all">All</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="image">Images</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="document">Documents</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="sheet">Spreadsheets</Md1ToggleButtons.Item>
        </Md1ToggleButtons>
      </div>

      <Md1GridList v-if="shown.length > 0" :columns>
        <Md1GridList.Tile
          v-for="item in shown"
          :key="item.id"
          :selected="chosen.includes(item.id)"
          :src="thumbs[item.kind]"
          @click="onToggle(item.id)"
        >
          <Md1GridList.Bar :subtitle="item.meta" :title="item.name" />
        </Md1GridList.Tile>
      </Md1GridList>

      <p class="md1-demo-files__note" role="status">
        {{ shown.length > 0 ? `${shown.length} of ${total} items` : 'Nothing here. Pick another filter.' }}
      </p>
    </div>
  </Md1Shell>

  <Md1Snackbar.Portal>
    <Md1Snackbar v-model="open" action="Undo" @action="onUndo">{{ note }}</Md1Snackbar>
  </Md1Snackbar.Portal>
</template>

<style>
  .md1-demo-files {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
  }

  /* One reserved row for the filter and the contextual bar, so the swap never moves the grid. The filters scroll sideways on a phone, as md1 tabs do. */
  .md1-demo-files__bar {
    display: flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    min-height: 48px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .md1-demo-files__count {
    flex: 1 1 auto;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  .md1-demo-files__note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
