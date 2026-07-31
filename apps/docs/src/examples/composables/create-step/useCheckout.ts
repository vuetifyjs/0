import { createStep } from '@vuetify/v0'
import { toRef, toValue } from 'vue'

import type { StepTicket, StepTicketInput } from '@vuetify/v0'

export interface Step {
  id: string
  label: string
  description: string
  disabled?: boolean
}

export type StepInput = StepTicketInput<Step>
export type StepRecord = StepTicket<StepInput>

export type Phase = 'done' | 'active' | 'todo' | 'off'

const steps: Step[] = [
  { id: 'cart', label: 'Cart', description: 'Review the items in your basket before you check out.' },
  { id: 'shipping', label: 'Shipping', description: 'Choose where your order should be delivered.' },
  { id: 'gift', label: 'Gift wrap', description: 'Gift wrapping is coming soon.', disabled: true },
  { id: 'payment', label: 'Payment', description: 'Enter your card details to complete the purchase.' },
  { id: 'review', label: 'Review', description: 'Confirm everything looks right, then place the order.' },
]

function phaseOf (ticket: StepRecord, index: number): Phase {
  if (toValue(ticket.disabled)) return 'off'
  if (ticket.index === index) return 'active'
  return ticket.index < index ? 'done' : 'todo'
}

export function useCheckout () {
  const wizard = createStep<StepInput, StepRecord>()

  const tickets = wizard.onboard(steps.map(step => ({
    id: step.id,
    value: step,
    disabled: step.disabled,
  })))

  wizard.first()

  const index = toRef(() => wizard.selectedIndex.value)
  const current = toRef(() => wizard.selectedValue.value)
  const isFirst = toRef(() => index.value === 0)
  const isLast = toRef(() => index.value === wizard.size - 1)
  const progress = toRef(() => (index.value / (wizard.size - 1)) * 100)

  const rows = toRef(() => tickets.map(ticket => ({
    id: ticket.id,
    label: ticket.value?.label,
    disabled: toValue(ticket.disabled),
    phase: phaseOf(ticket, index.value),
  })))

  return { wizard, rows, current, index, isFirst, isLast, progress }
}

export type Checkout = ReturnType<typeof useCheckout>
