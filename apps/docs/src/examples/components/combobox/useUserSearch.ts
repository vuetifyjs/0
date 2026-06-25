import { ref, shallowRef } from 'vue'

export interface User {
  id: string
  name: string
  handle: string
  avatar: string
}

const USERS: User[] = [
  { id: 'ada', name: 'Ada Lovelace', handle: 'ada', avatar: 'AL' },
  { id: 'alan', name: 'Alan Turing', handle: 'alan', avatar: 'AT' },
  { id: 'grace', name: 'Grace Hopper', handle: 'grace', avatar: 'GH' },
  { id: 'linus', name: 'Linus Torvalds', handle: 'linus', avatar: 'LT' },
  { id: 'margaret', name: 'Margaret Hamilton', handle: 'margaret', avatar: 'MH' },
  { id: 'dennis', name: 'Dennis Ritchie', handle: 'dennis', avatar: 'DR' },
  { id: 'barbara', name: 'Barbara Liskov', handle: 'barbara', avatar: 'BL' },
  { id: 'tim', name: 'Tim Berners-Lee', handle: 'tim', avatar: 'TB' },
  { id: 'donald', name: 'Donald Knuth', handle: 'donald', avatar: 'DK' },
  { id: 'katherine', name: 'Katherine Johnson', handle: 'katherine', avatar: 'KJ' },
]

export function useUserSearch () {
  const results = ref<User[]>(USERS)
  const assignees = ref<string[]>([])
  const loading = shallowRef(false)

  let timer: ReturnType<typeof setTimeout>

  // Mock server search — resolves a filtered list after a short delay
  function search (query: string): Promise<User[]> {
    const term = query.trim().toLowerCase()

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(
          term
            ? USERS.filter(u =>
                u.name.toLowerCase().includes(term) || u.handle.includes(term),
              )
            : USERS,
        )
      }, 350)
    })
  }

  // Debounced bridge from the combobox query to the mock server fetch
  function onSearch (query: string) {
    loading.value = true
    clearTimeout(timer)
    timer = setTimeout(async () => {
      results.value = await search(query)
      loading.value = false
    }, 250)
  }

  function reset () {
    assignees.value = []
    results.value = USERS
    loading.value = false
  }

  return { results, assignees, loading, onSearch, reset }
}
