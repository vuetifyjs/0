export interface User {
  id: number
  name: string
  initials: string
  hue: number
}

export const users: User[] = [
  { id: 1, name: 'Ada Lovelace', initials: 'AL', hue: 12 },
  { id: 2, name: 'Grace Hopper', initials: 'GH', hue: 48 },
  { id: 3, name: 'Alan Turing', initials: 'AT', hue: 96 },
  { id: 4, name: 'Linus Torvalds', initials: 'LT', hue: 144 },
  { id: 5, name: 'Margaret Hamilton', initials: 'MH', hue: 192 },
  { id: 6, name: 'Donald Knuth', initials: 'DK', hue: 240 },
  { id: 7, name: 'Barbara Liskov', initials: 'BL', hue: 288 },
  { id: 8, name: 'Tim Berners-Lee', initials: 'TB', hue: 336 },
]
