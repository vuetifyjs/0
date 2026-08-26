import { ref } from 'vue'

export interface Project {
  id: number
  name: string
  owner: string
  team: string
  repo: string
  estimate: number
  updated: string
  status: 'Todo' | 'Doing' | 'Done'
}

export interface ProjectColumn {
  id: keyof Project
  title: string
  size: number
  pinned?: 'left' | 'right' | false
}

export const columns: ProjectColumn[] = [
  { id: 'name', title: 'Name', size: 18, pinned: 'left' },
  { id: 'owner', title: 'Owner', size: 12 },
  { id: 'team', title: 'Team', size: 12 },
  { id: 'repo', title: 'Repo', size: 16 },
  { id: 'estimate', title: 'Pts', size: 8 },
  { id: 'updated', title: 'Updated', size: 12 },
  { id: 'id', title: 'Id', size: 8 },
  { id: 'status', title: 'Status', size: 14, pinned: 'right' },
]

const seed: Project[] = [
  { id: 1, name: 'Auth refresh', owner: 'Alice', team: 'Platform', repo: 'vuetifyjs/0', estimate: 5, updated: 'Aug 21', status: 'Doing' },
  { id: 2, name: 'Docs ranking', owner: 'Bob', team: 'Docs', repo: 'vuetifyjs/docs', estimate: 3, updated: 'Aug 18', status: 'Todo' },
  { id: 3, name: 'Column pin', owner: 'Carol', team: 'Design', repo: 'vuetifyjs/0', estimate: 8, updated: 'Aug 22', status: 'Doing' },
  { id: 4, name: 'Empty copy', owner: 'David', team: 'Docs', repo: 'vuetifyjs/docs', estimate: 2, updated: 'Aug 12', status: 'Done' },
  { id: 5, name: 'Pager keys', owner: 'Eve', team: 'Platform', repo: 'vuetifyjs/0', estimate: 3, updated: 'Aug 19', status: 'Todo' },
  { id: 6, name: 'Sticky offset', owner: 'Frank', team: 'Design', repo: 'vuetifyjs/0', estimate: 5, updated: 'Aug 20', status: 'Todo' },
  { id: 7, name: 'Cell commit', owner: 'Grace', team: 'Platform', repo: 'vuetifyjs/0', estimate: 5, updated: 'Aug 22', status: 'Doing' },
  { id: 8, name: 'Row index', owner: 'Henry', team: 'Docs', repo: 'vuetifyjs/0', estimate: 2, updated: 'Aug 11', status: 'Done' },
]

export function useProjects () {
  const projects = ref<Project[]>([...seed])

  return { projects }
}
