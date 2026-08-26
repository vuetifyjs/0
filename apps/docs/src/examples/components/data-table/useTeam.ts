import { ref, shallowRef } from 'vue'

export interface Member {
  id: number
  name: string
  email: string
  role: string
  team: string
  avatar?: string
}

export const columns = [
  { id: 'name', title: 'Name', sortable: true, filterable: true },
  { id: 'email', title: 'Email', sortable: true, filterable: true },
  { id: 'role', title: 'Role', sortable: true },
  { id: 'team', title: 'Team', sortable: true },
]

function src (img: number) {
  return `https://i.pravatar.cc/64?img=${img}`
}

const seed: Member[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', team: 'Platform', avatar: src(1) },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', team: 'Docs', avatar: src(12) },
  { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Viewer', team: 'Design' },
  { id: 4, name: 'David Brown', email: 'david@example.com', role: 'Editor', team: 'Platform', avatar: src(33) },
  { id: 5, name: 'Eve Davis', email: 'eve@example.com', role: 'Admin', team: 'Docs', avatar: src(5) },
  { id: 6, name: 'Frank Miller', email: 'frank@example.com', role: 'Viewer', team: 'Design', avatar: src(14) },
  { id: 7, name: 'Grace Lee', email: 'grace@example.com', role: 'Editor', team: 'Platform', avatar: src(9) },
  { id: 8, name: 'Henry Wilson', email: 'henry@example.com', role: 'Viewer', team: 'Docs' },
  { id: 9, name: 'Iris Patel', email: 'iris@example.com', role: 'Admin', team: 'Design', avatar: src(20) },
  { id: 10, name: 'Jack Chen', email: 'jack@example.com', role: 'Editor', team: 'Support', avatar: src(52) },
  { id: 11, name: 'Kara Nguyen', email: 'kara@example.com', role: 'Viewer', team: 'Support', avatar: src(26) },
  { id: 12, name: 'Leo Rossi', email: 'leo@example.com', role: 'Editor', team: 'Platform', avatar: src(68) },
  { id: 13, name: 'Maya Brooks', email: 'maya@example.com', role: 'Admin', team: 'Docs', avatar: src(32) },
  { id: 14, name: 'Noah Kim', email: 'noah@example.com', role: 'Viewer', team: 'Design', avatar: src(15) },
  { id: 15, name: 'Olivia Park', email: 'olivia@example.com', role: 'Editor', team: 'Support', avatar: src(47) },
  { id: 16, name: 'Quinn Adler', email: 'quinn@example.com', role: 'Viewer', team: 'Platform' },
]

export function useTeam () {
  const query = shallowRef('')
  const members = ref<Member[]>([...seed])

  return { query, members }
}
