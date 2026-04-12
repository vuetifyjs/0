export type Employee = {
  id: number
  name: string
  department: string
  role: string
}

export const employees: Employee[] = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering', role: 'Lead' },
  { id: 2, name: 'Bob Smith', department: 'Engineering', role: 'Senior' },
  { id: 3, name: 'Frank Lee', department: 'Engineering', role: 'Junior' },
  { id: 4, name: 'Carol Davis', department: 'Design', role: 'Lead' },
  { id: 5, name: 'Dan Wilson', department: 'Design', role: 'Senior' },
  { id: 6, name: 'Henry Chen', department: 'Design', role: 'Junior' },
  { id: 7, name: 'Eve Martinez', department: 'Marketing', role: 'Director' },
  { id: 8, name: 'Grace Kim', department: 'Marketing', role: 'Senior' },
]
