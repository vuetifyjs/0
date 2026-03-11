import { createContext } from '@vuetify/v0'
import type { ID, RegistryTicket, RegistryTicketInput } from '@vuetify/v0'
import type { ComputedRef, ShallowRef } from 'vue'

export interface TaskTicketInput extends RegistryTicketInput<string> {
  priority: 'low' | 'medium' | 'high'
  done: boolean
}

export type TaskTicket = RegistryTicket<string> & TaskTicketInput

export interface TaskContext {
  tasks: ComputedRef<readonly TaskTicket[]>
  events: ShallowRef<string[]>
  add: (text: string, priority: TaskTicketInput['priority']) => void
  remove: (id: ID) => void
  toggle: (id: ID) => void
  clear: () => void
}

export const [useTaskRegistry, provideTaskRegistry] = createContext<TaskContext>('v0:task-registry')
