<script setup lang="ts">
  // Components
  import {
    Md1Dialog,
    Md1Fab,
    Md1GridList,
    Md1ProgressCircular,
    Md1Snackbar,
    Md1ToggleButtons,
    md1Breakpoints,
  } from '@paper/md1'

  // Framework
  import { useBreakpoints, useTimer } from '@vuetify/v0'

  // Context
  import { photos } from './Md1Data'

  // Utilities
  import { ref, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { Photo, Slot } from './Md1Data'

  /**
   * A "photo" as an inline SVG data URI: a stylised landscape drawn from the
   * album's hue with seeded geometry, the imagery chapter's flat treatment.
   * The demo ships no raster images; the grid bar supplies the text protection.
   */
  function scene ({ id, hue }: Photo): string {
    const sun = 20 + (id * 29) % 56
    const high = 46 + (id * 17) % 16
    const low = 68 + (id * 11) % 14

    const scene = [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" preserveAspectRatio="xMidYMid slice">`,
      '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">',
      '<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.5"/>',
      '<stop offset="0.65" stop-color="#FFFFFF" stop-opacity="0"/>',
      '</linearGradient></defs>',
      `<rect width="120" height="120" fill="${hue}"/>`,
      '<rect width="120" height="120" fill="url(#sky)"/>',
      `<circle cx="${sun}" cy="30" r="11" fill="#FFFFFF" fill-opacity="0.85"/>`,
      `<path d="M0 ${high + 18} L34 ${high} L62 ${high + 14} L88 ${high - 6} L120 ${high + 12} V120 H0 Z" fill="#000000" fill-opacity="0.22"/>`,
      `<path d="M0 ${low + 14} L30 ${low} L58 ${low + 10} L92 ${low - 4} L120 ${low + 8} V120 H0 Z" fill="#000000" fill-opacity="0.38"/>`,
      '</svg>',
    ].join('')

    return 'data:image/svg+xml,' + encodeURIComponent(scene)
  }

  const { width } = useBreakpoints()

  /** 2 on a phone, 3 from the 600 breakpoint, 4 from 1280, over the default 4 dp gutter. */
  const columns = toRef(() => width.value >= md1Breakpoints[1280] ? 4 : (width.value >= md1Breakpoints[600] ? 3 : 2))

  const albums = ['Travel', 'Team', 'Product'] as const

  const filter = shallowRef<'all' | Photo['album']>('all')

  const shown = toRef(() => photos.all.value.filter(photo =>
    filter.value === 'all' || photo.album === filter.value,
  ))

  const total = toRef(() => photos.all.value.length)

  /** The last removal's slots, so the snackbar's Undo puts the photo back in place. */
  const batch = ref<Slot<Photo>[]>([])
  const open = shallowRef(false)
  const note = shallowRef('')
  /** Whether the snackbar carries Undo: deletes do, uploads and the camera stub don't. */
  const act = shallowRef(false)

  function say (text: string, undo: boolean) {
    note.value = text
    act.value = undo
    open.value = true
  }

  function onUndo () {
    photos.restore(batch.value)
    batch.value = []
  }

  // The lightbox: one dialog, fed by the pressed tile.

  const target = shallowRef<Photo>()
  const view = shallowRef(false)

  function onOpen (photo: Photo) {
    target.value = photo
    view.value = true
  }

  function onRemove () {
    if (!target.value) return

    batch.value = photos.remove([target.value.id])
    say('Photo deleted', true)
  }

  // The speed dial: upload reuses the determinate-progress pattern; the camera is a stub.

  const dial = shallowRef(false)

  const drops: Omit<Photo, 'id' | 'taken'>[] = [
    { title: 'Coast road', album: 'Travel', hue: '#1565C0' },
    { title: 'Festival rehearsal', album: 'Team', hue: '#00897B' },
    { title: 'Spring lookbook', album: 'Product', hue: '#5E35B1' },
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

    photos.add({ ...spec, taken: today })
    round.value++
    uploading.value = false
    say(`Uploaded ${spec.title}`, false)
  })

  function onDial (value: unknown) {
    if (value === 'upload' && !uploading.value) {
      percent.value = 0
      uploading.value = true
      step.start()
    }

    if (value === 'camera') say('The camera opens on a real device', false)
  }
</script>

<template>
  <div class="md1-demo-gallery">
    <div class="md1-demo-gallery__bar">
      <Md1ToggleButtons v-model="filter" label="Album" mandatory>
        <Md1ToggleButtons.Item value="all">All</Md1ToggleButtons.Item>

        <Md1ToggleButtons.Item v-for="album in albums" :key="album" :value="album">{{ album }}</Md1ToggleButtons.Item>
      </Md1ToggleButtons>
    </div>

    <Md1GridList v-if="shown.length > 0 || uploading" :columns>
      <Md1GridList.Tile
        v-for="photo in shown"
        :key="photo.id"
        :src="scene(photo)"
        @click="onOpen(photo)"
      >
        <Md1GridList.Bar :subtitle="`${photo.album} · ${photo.taken}`" :title="photo.title" />
      </Md1GridList.Tile>

      <Md1GridList.Tile v-if="uploading" key="md1-demo-upload">
        <span class="md1-demo-gallery__load">
          <Md1ProgressCircular :aria-label="`Uploading ${slated.title}`" :value="percent" />
        </span>

        <Md1GridList.Bar subtitle="Uploading…" :title="slated.title" />
      </Md1GridList.Tile>
    </Md1GridList>

    <p class="md1-demo-gallery__note" role="status">
      {{ shown.length > 0 ? `${shown.length} of ${total} photos` : 'Nothing here. Pick another album.' }}
    </p>

    <Md1Dialog v-model="view">
      <Md1Dialog.Content class="md1-demo-gallery__box">
        <img
          v-if="target"
          alt=""
          class="md1-demo-gallery__media"
          :src="scene(target)"
        >

        <Md1Dialog.Title>{{ target?.title }}</Md1Dialog.Title>

        <Md1Dialog.Text>{{ target ? `${target.album} · Taken ${target.taken}` : '' }}</Md1Dialog.Text>

        <Md1Dialog.Actions>
          <Md1Dialog.Cancel>Close</Md1Dialog.Cancel>

          <Md1Dialog.Confirm @confirm="onRemove">Delete</Md1Dialog.Confirm>
        </Md1Dialog.Actions>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Fab
      v-model="dial"
      aria-label="Add photos"
      class="md1-demo-gallery__fab"
      icon="add"
      @select="onDial"
    >
      <Md1Fab.Action icon="cloud-upload" label="Upload photo" value="upload" />

      <Md1Fab.Action icon="photo" label="Take photo" value="camera" />
    </Md1Fab>

    <Md1Snackbar.Portal>
      <Md1Snackbar v-model="open" :action="act ? 'Undo' : undefined" @action="onUndo">{{ note }}</Md1Snackbar>
    </Md1Snackbar.Portal>
  </div>
</template>

<style>
  .md1-demo-gallery {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    /* Room under the grid for the 56 dp dial and its margins, so no bar hides behind it. */
    padding-bottom: calc(56px + 2 * var(--md1-keyline-margin, 16px));
  }

  .md1-demo-gallery__bar {
    display: flex;
    align-items: center;
    min-height: 48px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  /* The pending upload: the determinate arc centred over the tile's resting ink wash. */
  .md1-demo-gallery__load {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* The lightbox media bleeds to the sheet's edges above the title. */
  .md1-demo-gallery__media {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: var(--md1-radius, 2px) var(--md1-radius, 2px) 0 0;
  }

  .md1-demo-gallery__box .md1-demo-gallery__media {
    margin-bottom: var(--md1-spacing-2, 16px);
  }

  .md1-demo-gallery__note {
    margin: 0;
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* While the bottom bar shows, the fixed dial clears its seam and still rises with the snackbar. */
  @media (width < 960px) {
    .md1-fab.md1-demo-gallery__fab {
      inset-block-end: calc(var(--md1-demo-seam, 0px) + var(--md1-keyline-margin, 16px) + var(--md1-snackbar-height, 0px));
    }
  }
</style>
