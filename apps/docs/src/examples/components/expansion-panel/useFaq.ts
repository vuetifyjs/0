import { shallowRef, toRef } from 'vue'

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export function useFaq () {
  const items: FaqItem[] = [
    {
      id: 'shipping',
      question: 'How long does shipping take?',
      answer: 'Standard orders ship within 1-2 business days and arrive in 3-5 business days. Express options are offered at checkout.',
    },
    {
      id: 'returns',
      question: 'What is your return policy?',
      answer: 'Unused items can be returned within 30 days for a full refund. Start a return from your account and we email a prepaid label.',
    },
    {
      id: 'warranty',
      question: 'Are products covered by a warranty?',
      answer: 'Every product carries a 2-year limited warranty against manufacturing defects. Register your purchase to extend it by a year.',
    },
    {
      id: 'support',
      question: 'How do I contact support?',
      answer: 'Reach the team by email or live chat, 9am-6pm on weekdays. Most tickets receive a first reply within a couple of hours.',
    },
  ]

  const open = shallowRef<string | undefined>(items[0].id)

  const current = toRef(() => items.find(item => item.id === open.value))

  function collapse () {
    open.value = undefined
  }

  return { items, open, current, collapse }
}
