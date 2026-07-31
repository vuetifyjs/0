import { createContext } from '#v0/composables'

export interface Greeting {
  text: string
}

// createContext is the DI substrate under every v0 compound component. The
// namespace carries a `:` per the context-key convention.
export const [useGreeting, provideGreeting] = createContext<Greeting>('v0:vapor-greeting')
