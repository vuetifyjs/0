import { ref, toRef } from 'vue'

export interface FilterOption {
  id: string
  label: string
}

export interface FilterChip {
  key: string
  label: string
}

export interface FilterValues {
  prices: string[]
  brands: string[]
  rating: string
}

export function useFilterPanel () {
  const sections: FilterOption[] = [
    { id: 'price', label: 'Price' },
    { id: 'brand', label: 'Brand' },
    { id: 'rating', label: 'Rating' },
  ]

  const priceRanges: FilterOption[] = [
    { id: 'under-25', label: 'Under $25' },
    { id: '25-50', label: '$25 to $50' },
    { id: '50-100', label: '$50 to $100' },
    { id: 'over-100', label: 'Over $100' },
  ]

  const brands: FilterOption[] = [
    { id: 'acme', label: 'Acme' },
    { id: 'globex', label: 'Globex' },
    { id: 'initech', label: 'Initech' },
    { id: 'umbrella', label: 'Umbrella Co' },
  ]

  const ratings: FilterOption[] = [
    { id: '4', label: '4 stars & up' },
    { id: '3', label: '3 stars & up' },
    { id: '2', label: '2 stars & up' },
  ]

  // One open flag per section id. Each Collapsible binds v-model to open[id],
  // so expand()/collapse() can drive every section from a single place while a
  // user clicking one activator still toggles only that section.
  const open = ref<Record<string, boolean>>({
    price: true,
    brand: false,
    rating: false,
  })

  const filters = ref<FilterValues>({
    prices: [],
    brands: [],
    rating: '',
  })

  const allOpen = toRef(() => sections.every(section => open.value[section.id]))
  const anyOpen = toRef(() => sections.some(section => open.value[section.id]))

  const active = toRef(() =>
    filters.value.prices.length
    + filters.value.brands.length
    + (filters.value.rating ? 1 : 0),
  )

  const chips = toRef((): FilterChip[] => {
    const out: FilterChip[] = []

    for (const id of filters.value.prices) {
      const match = priceRanges.find(range => range.id === id)
      if (match) out.push({ key: `price:${id}`, label: match.label })
    }

    for (const id of filters.value.brands) {
      const match = brands.find(brand => brand.id === id)
      if (match) out.push({ key: `brand:${id}`, label: match.label })
    }

    if (filters.value.rating) {
      const match = ratings.find(rating => rating.id === filters.value.rating)
      if (match) out.push({ key: `rating:${filters.value.rating}`, label: match.label })
    }

    return out
  })

  function expand () {
    for (const section of sections) {
      open.value[section.id] = true
    }
  }

  function collapse () {
    for (const section of sections) {
      open.value[section.id] = false
    }
  }

  function clear () {
    filters.value = { prices: [], brands: [], rating: '' }
  }

  return {
    sections,
    priceRanges,
    brands,
    ratings,
    open,
    filters,
    allOpen,
    anyOpen,
    active,
    chips,
    expand,
    collapse,
    clear,
  }
}
