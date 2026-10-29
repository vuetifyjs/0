<script setup lang="ts">
  // Components
  import {
    Md1BottomSheet,
    Md1Button,
    Md1Dialog,
    Md1GridList,
    Md1Menu,
    Md1ProgressCircular,
    Md1Snackbar,
    Md1TextField,
    Md1ToggleButtons,
    Md1Tooltip,
    md1Breakpoints,
    md1Icons,
  } from '@paper/md1'

  // Framework
  import { useBreakpoints, useTimer } from '@vuetify/v0'

  // Context
  import { files } from './Md1Data'

  // Utilities
  import { ref, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { Item, Kind, Slot } from './Md1Data'

  /** A type's flat field colour (Material palette 300s), its glyph role and its spoken name. */
  const palette: Record<Kind, { icon: keyof typeof md1Icons, field: string, label: string }> = {
    folder: { icon: 'folder', field: '#90A4AE', label: 'Folder' },
    image: { icon: 'photo', field: '#4DB6AC', label: 'Image' },
    document: { icon: 'content-copy', field: '#7986CB', label: 'Document' },
    sheet: { icon: 'apps', field: '#81C784', label: 'Spreadsheet' },
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

  /** Below 600 the per-tile actions open a bottom sheet, the handset alternative to a menu (bottom-sheets page). */
  const mobile = toRef(() => width.value < md1Breakpoints[600])

  const filter = shallowRef<'all' | Kind>('all')
  const chosen = ref<number[]>([])

  /** The last removal's slots, so the snackbar's Undo puts the entries back in place. */
  const batch = ref<Slot<Item>[]>([])
  const open = shallowRef(false)
  const note = shallowRef('')
  /** Whether the snackbar carries Undo: deletes do, shares and uploads don't. */
  const act = shallowRef(false)

  const shown = toRef(() => files.all.value.filter(item =>
    filter.value === 'all' || item.kind === filter.value,
  ))

  const total = toRef(() => files.all.value.length)

  function onToggle (id: number) {
    chosen.value = chosen.value.includes(id)
      ? chosen.value.filter(value => value !== id)
      : [...chosen.value, id]
  }

  function onClear () {
    chosen.value = []
  }

  function say (text: string, undo: boolean) {
    note.value = text
    act.value = undo
    open.value = true
  }

  function onDelete () {
    const count = chosen.value.length

    batch.value = files.remove(chosen.value)
    chosen.value = []
    say(count === 1 ? 'Deleted 1 item' : `Deleted ${count} items`, true)
  }

  function onUndo () {
    files.restore(batch.value)
    batch.value = []
  }

  // The per-tile actions: Open and Rename talk through one target and two dialogs.

  const target = shallowRef<Item>()
  const view = shallowRef(false)
  const edit = shallowRef(false)
  const label = shallowRef('')

  const detail = toRef(() => target.value ? `${palette[target.value.kind].label} · ${target.value.meta}` : '')

  function onOpen (item: Item) {
    target.value = item
    view.value = true
  }

  function onRename (item: Item) {
    target.value = item
    label.value = item.name
    edit.value = true
  }

  function onApply () {
    const name = label.value.trim()

    if (target.value && name) files.rename(target.value.id, name)
  }

  function onShare (item: Item) {
    say(`Link copied for "${item.name}"`, false)
  }

  function onRemove (item: Item) {
    batch.value = files.remove([item.id])
    chosen.value = chosen.value.filter(value => value !== item.id)
    say('Deleted 1 item', true)
  }

  // The fake upload: a pending tile with a determinate arc, then the file lands in the store.

  const drops: { name: string, kind: Kind, size: string }[] = [
    { name: 'Autumn palette.png', kind: 'image', size: '2.3 MB' },
    { name: 'Supplier terms.pdf', kind: 'document', size: '412 KB' },
    { name: 'Forecast Q1.xls', kind: 'sheet', size: '198 KB' },
  ]

  const round = shallowRef(0)
  const uploading = shallowRef(false)
  const percent = shallowRef(0)

  const slated = toRef(() => drops[round.value % drops.length]!)

  // The value only grows; the arc eases to each new step (2 s to 100).
  const step = useTimer(() => {
    percent.value = Math.min(percent.value + 5, 100)
  }, { duration: 100, repeat: true })

  // A repeating timer re-arms after its handler returns, so the end is watched from outside.
  watch(percent, value => {
    if (value < 100) return

    step.stop()

    const spec = slated.value
    const today = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })

    files.add({ name: spec.name, kind: spec.kind, meta: `${spec.size} · ${today}` })
    round.value++
    uploading.value = false
    say(`Uploaded ${spec.name}`, false)
  })

  function onUpload () {
    if (uploading.value) return

    percent.value = 0
    uploading.value = true
    step.start()
  }
</script>

<template>
  <div class="md1-demo-files">
    <!-- The selection pattern's contextual bar replaces the filter row while tiles are selected, as the data table's contextual header does. -->
    <div class="md1-demo-files__bar">
      <template v-if="chosen.length > 0">
        <span class="md1-demo-files__count" role="status">
          {{ chosen.length === 1 ? '1 item selected' : `${chosen.length} items selected` }}
        </span>

        <Md1Tooltip>
          <Md1Tooltip.Activator v-slot="{ attrs }">
            <Md1Button v-bind="attrs" aria-label="Clear selection" icon="close" @click="onClear" />
          </Md1Tooltip.Activator>

          <Md1Tooltip.Content>Clear selection</Md1Tooltip.Content>
        </Md1Tooltip>

        <Md1Tooltip>
          <Md1Tooltip.Activator v-slot="{ attrs }">
            <Md1Button v-bind="attrs" aria-label="Delete selected" icon="delete" @click="onDelete" />
          </Md1Tooltip.Activator>

          <Md1Tooltip.Content>Delete</Md1Tooltip.Content>
        </Md1Tooltip>
      </template>

      <template v-else>
        <Md1ToggleButtons v-model="filter" label="Show" mandatory>
          <Md1ToggleButtons.Item value="all">All</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="image">Images</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="document">Documents</Md1ToggleButtons.Item>

          <Md1ToggleButtons.Item value="sheet">Spreadsheets</Md1ToggleButtons.Item>
        </Md1ToggleButtons>

        <span class="md1-demo-files__spacer" />

        <Md1Button :disabled="uploading" variant="raised" @click="onUpload">Upload</Md1Button>
      </template>
    </div>

    <Md1GridList v-if="shown.length > 0 || uploading" :columns>
      <Md1GridList.Tile
        v-for="item in shown"
        :key="item.id"
        :selected="chosen.includes(item.id)"
        :src="thumbs[item.kind]"
        @click="onToggle(item.id)"
      >
        <Md1GridList.Bar :subtitle="item.meta" :title="item.name" />

        <div class="md1-demo-files__act">
          <Md1Menu v-if="!mobile">
            <Md1Menu.Activator v-slot="{ attrs }">
              <Md1Button v-bind="attrs" :aria-label="`Actions for ${item.name}`" icon="more-vert" />
            </Md1Menu.Activator>

            <Md1Menu.Content>
              <Md1Menu.Item icon="open-in-new" @select="onOpen(item)">Open</Md1Menu.Item>

              <Md1Menu.Item icon="edit" @select="onRename(item)">Rename</Md1Menu.Item>

              <Md1Menu.Item icon="share" @select="onShare(item)">Share</Md1Menu.Item>

              <Md1Menu.Divider />

              <Md1Menu.Item icon="delete" @select="onRemove(item)">Delete</Md1Menu.Item>
            </Md1Menu.Content>
          </Md1Menu>

          <Md1BottomSheet v-else>
            <Md1BottomSheet.Activator v-slot="{ attrs }">
              <Md1Button v-bind="attrs" :aria-label="`Actions for ${item.name}`" icon="more-vert" />
            </Md1BottomSheet.Activator>

            <Md1BottomSheet.Title>{{ item.name }}</Md1BottomSheet.Title>

            <Md1BottomSheet.Item icon="open-in-new" @click="onOpen(item)">Open</Md1BottomSheet.Item>

            <Md1BottomSheet.Item icon="edit" @click="onRename(item)">Rename</Md1BottomSheet.Item>

            <Md1BottomSheet.Item icon="share" @click="onShare(item)">Share</Md1BottomSheet.Item>

            <Md1BottomSheet.Item icon="delete" @click="onRemove(item)">Delete</Md1BottomSheet.Item>
          </Md1BottomSheet>
        </div>
      </Md1GridList.Tile>

      <Md1GridList.Tile v-if="uploading" key="md1-demo-upload">
        <span class="md1-demo-files__load">
          <Md1ProgressCircular :aria-label="`Uploading ${slated.name}`" :value="percent" />
        </span>

        <Md1GridList.Bar subtitle="Uploading…" :title="slated.name" />
      </Md1GridList.Tile>
    </Md1GridList>

    <p class="md1-demo-files__note" role="status">
      {{ shown.length > 0 ? `${shown.length} of ${total} items` : 'Nothing here. Pick another filter.' }}
    </p>

    <Md1Dialog v-model="view">
      <Md1Dialog.Content>
        <Md1Dialog.Title>{{ target?.name }}</Md1Dialog.Title>

        <Md1Dialog.Text>{{ detail }}</Md1Dialog.Text>

        <Md1Dialog.Actions>
          <Md1Dialog.Confirm>Done</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Dialog v-model="edit">
      <Md1Dialog.Content>
        <Md1Dialog.Title>Rename</Md1Dialog.Title>

        <div class="md1-demo-files__field">
          <Md1TextField v-model="label" label="Name" required />
        </div>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel />

          <Md1Dialog.Confirm @confirm="onApply">Rename</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Snackbar.Portal>
      <Md1Snackbar v-model="open" :action="act ? 'Undo' : undefined" @action="onUndo">{{ note }}</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
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

  .md1-demo-files__spacer {
    flex: 1 1 auto;
  }

  .md1-demo-files__count {
    flex: 1 1 auto;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-2-size, 14px);
    font-weight: var(--md1-type-body-2-weight, 500);
    color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
  }

  /* The per-tile overflow: a 48 dp button at the tile's top end corner, in white over the image field. */
  .md1-demo-files__act {
    position: absolute;
    top: 0;
    inset-inline-end: 0;
  }

  /* The bar's white ink for an action over imagery; the selector outweighs the solo button's own primary-ink rule. */
  .md1-demo-files__act .md1-button[data-solo]:not([data-disabled]) {
    color: var(--md1-white, #FFFFFF);
  }

  /* The pending upload: the determinate arc centred over the tile's resting ink wash. */
  .md1-demo-files__load {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* The rename field keeps the dialog's 24 dp keylines. */
  .md1-demo-files__field {
    padding: 0 var(--md1-spacing-3, 24px);
  }

  .md1-demo-files__note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
