export interface Employee {
  id: number
  name: string
  department: string
  salary: number
  active: boolean
}

export const employees: Employee[] = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 120_000, active: true },
  { id: 2, name: 'Bob Smith', department: 'Engineering', salary: 95_000, active: true },
  { id: 3, name: 'Carol Davis', department: 'Design', salary: 88_000, active: false },
  { id: 4, name: 'Dan Wilson', department: 'Design', salary: 92_000, active: true },
  { id: 5, name: 'Eve Martinez', department: 'Marketing', salary: 78_000, active: true },
  { id: 6, name: 'Frank Lee', department: 'Marketing', salary: 82_000, active: true },
  { id: 7, name: 'Grace Kim', department: 'Engineering', salary: 110_000, active: true },
  { id: 8, name: 'Henry Chen', department: 'Sales', salary: 75_000, active: false },
  { id: 9, name: 'Iris Park', department: 'Sales', salary: 85_000, active: true },
  { id: 10, name: 'Jack Brown', department: 'Engineering', salary: 105_000, active: true },
]
