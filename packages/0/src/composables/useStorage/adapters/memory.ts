// Adapters
import { StorageAdapter } from './adapter'

/**
 * In-memory storage adapter that extends the StorageAdapter abstract class.
 * This adapter provides temporary storage that persists only for the current
 * session and is useful for testing or when persistent storage is not available.
 */
export class MemoryStorageAdapter extends StorageAdapter {
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
    return String(Array.from(this.store.keys())[index] ?? '')
  }
}
