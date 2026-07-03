import { ref } from 'vue'
import { useNotifications } from '@vuetify/v0'

interface ToastFile {
  id: string
  name: string
}

const SOURCE: ToastFile[] = [
  { id: 'f1', name: 'Q3-report.pdf' },
  { id: 'f2', name: 'design-spec.fig' },
  { id: 'f3', name: 'budget.xlsx' },
]

export function useToasts () {
  const notifications = useNotifications()
  const files = ref<ToastFile[]>(SOURCE.map(file => ({ ...file })))

  function notify (severity: 'success' | 'error') {
    const subject = severity === 'success'
      ? 'Changes saved'
      : 'Upload failed — try again'

    notifications.send({ subject, severity, timeout: 5000 })
  }

  function restore (file: ToastFile, index: number) {
    if (files.value.some(f => f.id === file.id)) return
    files.value.splice(Math.min(index, files.value.length), 0, file)
  }

  function remove (file: ToastFile) {
    const index = files.value.findIndex(f => f.id === file.id)
    if (index === -1) return

    files.value.splice(index, 1)

    // The undo closure rides along on the notification's data payload
    notifications.send({
      subject: `Deleted ${file.name}`,
      severity: 'info',
      timeout: 6000,
      data: { undo: () => restore(file, index) },
    })
  }

  return { files, notify, remove }
}
