import { ref } from 'vue'

export interface Band {
  label: string
  frequency: number
}

const bands: Band[] = [
  { label: '60', frequency: 60 },
  { label: '250', frequency: 250 },
  { label: '1k', frequency: 1000 },
  { label: '4k', frequency: 4000 },
  { label: '16k', frequency: 16_000 },
]

const presets: Record<string, number[]> = {
  flat: [0, 0, 0, 0, 0],
  bass: [8, 4, 0, -2, -4],
  vocal: [-2, 0, 6, 4, -2],
  treble: [-4, -2, 0, 4, 8],
}

export function useEqualizer () {
  const gains = ref([0, 0, 0, 0, 0])

  function reset () {
    gains.value = [0, 0, 0, 0, 0]
  }

  function apply (name: string) {
    const preset = presets[name]
    if (preset) gains.value = [...preset]
  }

  return {
    bands,
    gains,
    presets,
    reset,
    apply,
  }
}
