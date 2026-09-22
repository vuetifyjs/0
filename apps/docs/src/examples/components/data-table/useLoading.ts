import { ref } from 'vue'

export interface User {
  id: number
  name: string
  role: string
}

const seed: User[] = [
  { id: 1, name: 'Alice Johnson', role: 'Admin' },
  { id: 2, name: 'Bob Smith', role: 'Editor' },
  { id: 3, name: 'Carol White', role: 'Viewer' },
  { id: 4, name: 'David Brown', role: 'Editor' },
  { id: 5, name: 'Eve Davis', role: 'Admin' },
  { id: 6, name: 'Frank Miller', role: 'Viewer' },
]

export function useLoading () {
  const users = ref<User[]>([...seed])

  return { users }
}
