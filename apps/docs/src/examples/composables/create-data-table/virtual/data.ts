export interface User {
  id: number
  name: string
  email: string
  score: number
}

export function generateUsers (count = 1000): User[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    score: Math.floor(Math.random() * 100),
  }))
}
