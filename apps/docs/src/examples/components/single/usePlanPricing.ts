import { shallowRef, toRef } from 'vue'

export interface BillingPeriod {
  id: string
  label: string
  note?: string
}

export function usePlanPricing () {
  // Pro plan, priced per month for each billing cadence.
  const monthly = 15
  const yearly = 12
  const savings = Math.round((1 - yearly / monthly) * 100)

  const periods: BillingPeriod[] = [
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly', note: `Save ${savings}%` },
  ]

  // Single keeps exactly one period selected; seed it so a price always shows.
  const period = shallowRef('monthly')

  const isYearly = toRef(() => period.value === 'yearly')
  const price = toRef(() => isYearly.value ? yearly : monthly)
  const billed = toRef(() =>
    isYearly.value
      ? `$${yearly * 12} billed annually`
      : `$${monthly} billed monthly`,
  )

  return { periods, period, price, billed, savings, isYearly }
}
