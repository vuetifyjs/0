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
  eventLog: ShallowRef<string[]>
  addTask: (text: string, priority: TaskTicketInput['priority']) => void
  removeTask: (id: ID) => void
  toggleDone: (id: ID) => void
  clearCompleted: () => void
}

export const [useTaskRegistry, provideTaskRegistry] = createContext<TaskContext>('v0:task-registry')
