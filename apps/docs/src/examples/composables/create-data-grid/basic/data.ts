export type Employee = {
  id: number
  name: string
  email: string
  department: string
  role: string
  salary: number
}

export const employees: Employee[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', department: 'Engineering', role: 'Lead', salary: 145_000 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', department: 'Engineering', role: 'Senior', salary: 130_000 },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', department: 'Design', role: 'Lead', salary: 125_000 },
  { id: 4, name: 'Dan Wilson', email: 'dan@example.com', department: 'Design', role: 'Senior', salary: 115_000 },
  { id: 5, name: 'Eve Martinez', email: 'eve@example.com', department: 'Marketing', role: 'Director', salary: 140_000 },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', department: 'Engineering', role: 'Junior', salary: 95_000 },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', department: 'Marketing', role: 'Senior', salary: 110_000 },
  { id: 8, name: 'Henry Chen', email: 'henry@example.com', department: 'Design', role: 'Junior', salary: 90_000 },
  { id: 9, name: 'Iris Patel', email: 'iris@example.com', department: 'Engineering', role: 'Senior', salary: 135_000 },
  { id: 10, name: 'Jack Brown', email: 'jack@example.com', department: 'Marketing', role: 'Junior', salary: 85_000 },
]
