import { shallowRef } from 'vue'

export interface Person {
  id: number
  name: string
  role: string
  location: string
}

const ROLES = ['Engineer', 'Designer', 'Manager', 'Analyst', 'Recruiter', 'Marketer']
const LOCATIONS = ['Remote', 'New York', 'Berlin', 'Tokyo', 'São Paulo', 'Sydney']

function person (index: number): Person {
  return {
    id: index,
    name: `Employee ${String(index + 1).padStart(5, '0')}`,
    role: ROLES[index % ROLES.length],
    location: LOCATIONS[index % LOCATIONS.length],
  }
}

export function useDirectory (initial = 10_000) {
  const rows = shallowRef<Person[]>(
    Array.from({ length: initial }, (_, i) => person(i)),
  )

  function append (count = 1000) {
    const start = rows.value.length
    const next = Array.from({ length: count }, (_, i) => person(start + i))
    rows.value = [...rows.value, ...next]
  }

  return { rows, append }
}
