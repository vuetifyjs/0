export type Project = {
  id: number
  name: string
  status: 'active' | 'paused' | 'done'
  priority: 'low' | 'medium' | 'high' | 'critical'
  assignee: string
  progress: number
  due: string
  budget: number
}

export const projects: Project[] = [
  { id: 1, name: 'Website Redesign', status: 'active', priority: 'high', assignee: 'Alice Chen', progress: 72, due: '2026-04-28', budget: 45_000 },
  { id: 2, name: 'Mobile App v2', status: 'active', priority: 'critical', assignee: 'Marcus Rivera', progress: 34, due: '2026-05-15', budget: 120_000 },
  { id: 3, name: 'API Migration', status: 'paused', priority: 'medium', assignee: 'Sara Okonkwo', progress: 58, due: '2026-06-01', budget: 30_000 },
  { id: 4, name: 'Design System', status: 'active', priority: 'high', assignee: 'Liam Park', progress: 91, due: '2026-04-20', budget: 55_000 },
  { id: 5, name: 'Analytics Dashboard', status: 'done', priority: 'medium', assignee: 'Nina Volkov', progress: 100, due: '2026-03-30', budget: 28_000 },
  { id: 6, name: 'Auth Service', status: 'active', priority: 'critical', assignee: 'James Wu', progress: 15, due: '2026-04-18', budget: 72_000 },
  { id: 7, name: 'CI/CD Pipeline', status: 'done', priority: 'low', assignee: 'Fatima Al-Rashid', progress: 100, due: '2026-03-15', budget: 12_000 },
  { id: 8, name: 'Data Export Tool', status: 'paused', priority: 'low', assignee: 'Carlos Mendez', progress: 22, due: '2026-07-10', budget: 18_000 },
  { id: 9, name: 'Search Indexing', status: 'active', priority: 'medium', assignee: 'Alice Chen', progress: 47, due: '2026-05-22', budget: 35_000 },
  { id: 10, name: 'Billing Integration', status: 'active', priority: 'high', assignee: 'Marcus Rivera', progress: 63, due: '2026-05-01', budget: 88_000 },
]
