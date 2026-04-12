export interface User {
  id: number
  name: string
  email: string
  role: string
  age: number
}

export const users: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', age: 32 },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Editor', age: 28 },
  { id: 3, name: 'Carol Davis', email: 'carol@example.com', role: 'Viewer', age: 41 },
  { id: 4, name: 'Dan Wilson', email: 'dan@example.com', role: 'Editor', age: 35 },
  { id: 5, name: 'Eve Martinez', email: 'eve@example.com', role: 'Admin', age: 29 },
  { id: 6, name: 'Frank Lee', email: 'frank@example.com', role: 'Viewer', age: 47 },
  { id: 7, name: 'Grace Kim', email: 'grace@example.com', role: 'Editor', age: 33 },
  { id: 8, name: 'Henry Chen', email: 'henry@example.com', role: 'Viewer', age: 26 },
]
