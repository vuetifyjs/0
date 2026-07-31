import { ref, shallowRef, toRef } from 'vue'

export interface Photo {
  id: number
  title: string
  location: string
  color: string
}

export function useGallery () {
  const photos = ref<Photo[]>([
    { id: 1, title: 'Alpine Lake', location: 'Dolomites, Italy', color: 'bg-sky-800' },
    { id: 2, title: 'Dune Crest', location: 'Sahara, Morocco', color: 'bg-amber-700' },
    { id: 3, title: 'Old Growth', location: 'Olympic, USA', color: 'bg-emerald-800' },
    { id: 4, title: 'Tide Pools', location: 'Big Sur, USA', color: 'bg-cyan-800' },
    { id: 5, title: 'Aurora', location: 'Tromsø, Norway', color: 'bg-violet-900' },
  ])

  // Autoplay interval in ms. Fixed config, never reactive.
  const interval = 4000

  const active = shallowRef(1)

  const current = toRef(() => photos.value.find(photo => photo.id === active.value) ?? photos.value[0])
  const position = toRef(() => photos.value.findIndex(photo => photo.id === active.value) + 1)

  return { photos, interval, active, current, position }
}
