import { createContext } from '@vuetify/v0'
import type { QueueTicketInput } from '@vuetify/v0'
import type { ID } from '@vuetify/v0/types'
import type { ComputedRef, ShallowRef } from 'vue'

// Input type for registering uploads
export interface UploadInput extends QueueTicketInput {
  name: string
  size: string
  progress: ShallowRef<number>
}

// Output type after queue processes the input
export interface Upload extends UploadInput {
  id: ID
  index: number
  isPaused: boolean
  dismiss: () => void
}

export interface UploadContext {
  first: ComputedRef<Upload | undefined>
  items: ComputedRef<Upload[]>
  pending: ComputedRef<Upload[]>
  size: ComputedRef<number>
  add: (name: string, size: string) => void
  cancel: (id: ID) => void
}

export const [
  useUploads,
  provideUploads,
] = createContext<UploadContext>('v0:uploads')
