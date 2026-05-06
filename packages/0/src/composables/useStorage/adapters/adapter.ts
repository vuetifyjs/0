export abstract class StorageAdapter {
  get length (): number {
    return 0
  }

  key (_index: number): string | null {
    return null
  }

  abstract getItem (key: string): string | null
  abstract setItem (key: string, value: string): void
  abstract removeItem (key: string): void
}
