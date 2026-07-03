import { ref, shallowRef } from 'vue'

export interface Crumb {
  text: string
  href?: string
}

export interface TrailWidth {
  label: string
  value: number
}

export function useTrail () {
  const crumbs = ref<Crumb[]>([
    { text: 'Home', href: '#' },
    { text: 'Documents', href: '#' },
    { text: 'Projects', href: '#' },
    { text: 'Vuetify', href: '#' },
    { text: 'Components', href: '#' },
    { text: 'Breadcrumbs' },
  ])

  const widths: TrailWidth[] = [
    { label: 'Desktop', value: 640 },
    { label: 'Tablet', value: 384 },
    { label: 'Mobile', value: 240 },
  ]

  const width = shallowRef(640)

  function resize (value: number) {
    width.value = value
  }

  return { crumbs, widths, width, resize }
}
