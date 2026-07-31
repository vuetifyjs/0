import { createStorage, MemoryStorageAdapter } from '@vuetify/v0'
import { shallowRef } from 'vue'
import type { Ref, ShallowRef } from 'vue'

export interface UseSettings {
  name: Ref<string>
  theme: Ref<string>
  note: ShallowRef<string>
  saved: ShallowRef<boolean>
  save: () => void
  forget: () => void
  reset: () => void
}

export function useSettings (): UseSettings {
  const storage = createStorage({
    adapter: new MemoryStorageAdapter(),
    prefix: 'settings:',
  })

  // get() returns reactive refs that persist on every change
  const name = storage.get('name', 'Guest')
  const theme = storage.get('theme', 'system')

  // The draft is edited in a local buffer and only written on demand,
  // so has('note') honestly reflects whether a draft has been persisted.
  const note = shallowRef('')
  const saved = shallowRef(storage.has('note'))

  function save () {
    storage.set('note', note.value)
    saved.value = storage.has('note')
  }

  function forget () {
    storage.remove('note')
    note.value = ''
    saved.value = storage.has('note')
  }

  function reset () {
    name.value = 'Guest'
    theme.value = 'system'
    forget()
  }

  return { name, theme, note, saved, save, forget, reset }
}
