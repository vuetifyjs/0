import { createProgress } from '@vuetify/v0'
import { onUnmounted, shallowRef, toRef } from 'vue'

import type { ModelTicket, ModelTicketInput } from '@vuetify/v0'
import type { ShallowRef } from 'vue'

interface ProgressTicketInput extends ModelTicketInput<ShallowRef<number>> {
  value: ShallowRef<number>
}

export interface UploadFile {
  name: string
  ticket: ModelTicket<ProgressTicketInput>
  status: 'uploading' | 'complete'
}

export function useUpload () {
  const progress = createProgress({ max: 100 })
  const files = shallowRef<UploadFile[]>([])
  const timers: ReturnType<typeof setInterval>[] = []

  function upload (name: string) {
    const ticket = progress.register()

    const file: UploadFile = {
      name,
      ticket,
      status: 'uploading',
    }

    const updated = [...files.value, file]
    files.value = updated

    const timer = setInterval(() => {
      const current = ticket.value.value
      if (current >= 100) {
        clearInterval(timer)
        file.status = 'complete'
        files.value = [...files.value]
        return
      }
      ticket.value.value = Math.min(current + Math.random() * 15, 100)
    }, 200)

    timers.push(timer)
  }

  function clear () {
    for (const timer of timers) clearInterval(timer)
    timers.length = 0
    for (const file of files.value) file.ticket.unregister()
    files.value = []
  }

  onUnmounted(() => {
    for (const timer of timers) clearInterval(timer)
  })

  const total = toRef(() => progress.total.value)
  const percent = toRef(() => progress.percent.value)
  const isIndeterminate = toRef(() => progress.isIndeterminate.value)

  return {
    files,
    total,
    percent,
    isIndeterminate,
    upload,
    clear,
    fromValue: progress.fromValue,
  }
}
