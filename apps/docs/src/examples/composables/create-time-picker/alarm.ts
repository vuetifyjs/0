import { createTimePicker } from '@vuetify/v0'
import { shallowRef } from 'vue'

export function useAlarm () {
  const value = shallowRef<string | null>('09:00')
  const time = createTimePicker({
    value,
    hourCycle: 'h12',
    min: '09:00',
    max: '17:00',
  })

  return {
    hour: time.hour,
    minute: time.minute,
    period: time.period,
    setPeriod: time.setPeriod,
    stepHour: time.stepHour,
    stepMinute: time.stepMinute,
    value,
  }
}
