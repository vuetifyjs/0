import { ref, shallowRef, toRef } from 'vue'

export interface Photo {
  id: number
  title: string
  location: string
  src: string
}

const cdn = 'https://cdn.vuetifyjs.com/images'

export function useGallery () {
  const photos = ref<Photo[]>([
    { id: 1, title: 'Alpine lake', location: 'Sunset', src: `${cdn}/carousel/sky.jpg` },
    { id: 2, title: 'Red squirrel', location: 'Forest', src: `${cdn}/carousel/squirrel.jpg` },
    { id: 3, title: 'Eagle owl', location: 'Pine', src: `${cdn}/carousel/bird.jpg` },
    { id: 4, title: 'Night pier', location: 'Crescent', src: `${cdn}/cards/docks.jpg` },
    { id: 5, title: 'Saguaro', location: 'Stars', src: `${cdn}/cards/sunshine.jpg` },
  ])

  // Autoplay interval in ms. Fixed config, never reactive.
  const interval = 4000

  const active = shallowRef(1)

  const current = toRef(() => photos.value.find(photo => photo.id === active.value) ?? photos.value[0])
  const position = toRef(() => photos.value.findIndex(photo => photo.id === active.value) + 1)

  return { photos, interval, active, current, position }
}
