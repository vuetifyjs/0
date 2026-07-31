import { useBreakpoints } from '@vuetify/v0'
import { ref, toRef } from 'vue'

import type { BreakpointName } from '@vuetify/v0'

export interface Widget {
  id: number
  title: string
  metric: string
  detail: string
}

// Map each breakpoint to how many dashboard columns it should render
const COLUMNS: Record<BreakpointName, number> = {
  xs: 1,
  sm: 2,
  md: 2,
  lg: 3,
  xl: 4,
  xxl: 4,
}

export function useDashboard () {
  const breakpoints = useBreakpoints()

  const widgets = ref<Widget[]>([
    { id: 1, title: 'Revenue', metric: '$48.2k', detail: '+12% this week' },
    { id: 2, title: 'Sessions', metric: '9,310', detail: '1,204 active now' },
    { id: 3, title: 'Conversion', metric: '3.8%', detail: '+0.4 pts' },
    { id: 4, title: 'Avg. order', metric: '$72.40', detail: '212 orders today' },
    { id: 5, title: 'Refunds', metric: '$1.1k', detail: '6 pending' },
    { id: 6, title: 'Churn', metric: '1.9%', detail: '-0.2 pts' },
  ])

  const columns = toRef(() => COLUMNS[breakpoints.name.value])

  const flags = toRef((): Record<BreakpointName, boolean> => ({
    xs: breakpoints.xs.value,
    sm: breakpoints.sm.value,
    md: breakpoints.md.value,
    lg: breakpoints.lg.value,
    xl: breakpoints.xl.value,
    xxl: breakpoints.xxl.value,
  }))

  return {
    name: breakpoints.name,
    width: breakpoints.width,
    height: breakpoints.height,
    isMobile: breakpoints.isMobile,
    columns,
    flags,
    widgets,
  }
}
