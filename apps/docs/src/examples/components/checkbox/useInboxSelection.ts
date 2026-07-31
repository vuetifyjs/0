import { ref, shallowRef, toRef } from 'vue'

export interface Email {
  id: string
  sender: string
  subject: string
  unread: boolean
}

const seed: Email[] = [
  { id: 'e1', sender: 'GitHub', subject: 'Your weekly digest is ready', unread: true },
  { id: 'e2', sender: 'Vercel', subject: 'Deployment succeeded for v0-docs', unread: false },
  { id: 'e3', sender: 'Stripe', subject: 'Invoice #4821 was paid', unread: true },
  { id: 'e4', sender: 'Linear', subject: 'You were assigned to V0-219', unread: false },
  { id: 'e5', sender: 'Figma', subject: 'Henry left 3 comments on Checkbox', unread: true },
]

export function useInboxSelection () {
  const emails = ref<Email[]>([...seed])
  const selected = ref<string[]>([])
  const status = shallowRef('')

  const count = toRef(() => selected.value.length)

  function archive () {
    if (selected.value.length === 0) return

    const ids = new Set(selected.value)
    emails.value = emails.value.filter(email => !ids.has(email.id))
    status.value = `Archived ${ids.size} ${ids.size === 1 ? 'message' : 'messages'}`
    selected.value = []
  }

  function remove () {
    if (selected.value.length === 0) return

    const ids = new Set(selected.value)
    emails.value = emails.value.filter(email => !ids.has(email.id))
    status.value = `Deleted ${ids.size} ${ids.size === 1 ? 'message' : 'messages'}`
    selected.value = []
  }

  function reset () {
    emails.value = [...seed]
    selected.value = []
    status.value = ''
  }

  return { emails, selected, status, count, archive, remove, reset }
}
