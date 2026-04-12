export type Schedule = {
  id: number
  department: string
  member: string
  mon: 'available' | 'busy' | 'off'
  tue: 'available' | 'busy' | 'off'
  wed: 'available' | 'busy' | 'off'
  thu: 'available' | 'busy' | 'off'
  fri: 'available' | 'busy' | 'off'
}

export const schedule: Schedule[] = [
  { id: 1, department: 'Engineering', member: 'Alice Chen', mon: 'available', tue: 'available', wed: 'busy', thu: 'available', fri: 'off' },
  { id: 2, department: 'Engineering', member: 'Bob Park', mon: 'busy', tue: 'available', wed: 'available', thu: 'available', fri: 'available' },
  { id: 3, department: 'Engineering', member: 'Carol Wu', mon: 'available', tue: 'busy', wed: 'busy', thu: 'off', fri: 'available' },
  { id: 4, department: 'Engineering', member: 'Dan Reeves', mon: 'available', tue: 'available', wed: 'available', thu: 'busy', fri: 'busy' },
  { id: 5, department: 'Design', member: 'Eva Santos', mon: 'off', tue: 'available', wed: 'available', thu: 'available', fri: 'busy' },
  { id: 6, department: 'Design', member: 'Frank Liu', mon: 'available', tue: 'busy', wed: 'off', thu: 'available', fri: 'available' },
  { id: 7, department: 'Design', member: 'Grace Kim', mon: 'busy', tue: 'available', wed: 'available', thu: 'busy', fri: 'off' },
  { id: 8, department: 'Marketing', member: 'Hiro Tanaka', mon: 'available', tue: 'available', wed: 'busy', thu: 'available', fri: 'available' },
  { id: 9, department: 'Marketing', member: 'Iris Novak', mon: 'busy', tue: 'off', wed: 'available', thu: 'available', fri: 'busy' },
  { id: 10, department: 'Marketing', member: 'Jake Morris', mon: 'available', tue: 'available', wed: 'available', thu: 'off', fri: 'available' },
]
