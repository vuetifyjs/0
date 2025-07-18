// Types
import type { StorageAdapter } from './adapter'

export class MemoryAdapter implements StorageAdapter {
  private store = new Map<string, string>()

  get length () {
    return this.store.size
  }

  getItem (key: string) {
    return this.store.get(key) ?? null
  }

  setItem (key: string, value: string) {
    this.store.set(key, value)
  }

  removeItem (key: string) {
    this.store.delete(key)
  }

  key (index: number) {
    return Array.from(this.store.keys())[index]
  }
}
