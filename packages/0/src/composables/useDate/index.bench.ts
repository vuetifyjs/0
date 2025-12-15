import { Temporal } from '@js-temporal/polyfill'
import { bench, describe } from 'vitest'
import { V0DateAdapter } from './adapters/v0'

describe('useDate benchmarks', () => {
  describe('V0DateAdapter', () => {
    const adapter = new V0DateAdapter()
    const testDate = Temporal.PlainDateTime.from('2024-06-15T10:30:00')

    describe('construction', () => {
      bench('create date from null (now)', () => {
        adapter.date()
      })

      bench('create date from ISO string', () => {
        adapter.date('2024-06-15T10:30:00')
      })

      bench('create date from timestamp', () => {
        adapter.date(Date.now())
      })

      bench('create 1000 dates', () => {
        for (let i = 0; i < 1000; i++) {
          adapter.date('2024-06-15T10:30:00')
        }
      })
    })

    describe('formatting', () => {
      bench('format fullDate', () => {
        adapter.format(testDate, 'fullDate')
      })

      bench('format shortDate', () => {
        adapter.format(testDate, 'shortDate')
      })

      bench('format 1000 dates', () => {
        for (let i = 0; i < 1000; i++) {
          adapter.format(testDate, 'fullDate')
        }
      })
    })

    describe('navigation', () => {
      bench('startOfDay', () => {
        adapter.startOfDay(testDate)
      })

      bench('startOfWeek', () => {
        adapter.startOfWeek(testDate, 0)
      })

      bench('startOfMonth', () => {
        adapter.startOfMonth(testDate)
      })

      bench('getWeekArray', () => {
        adapter.getWeekArray(testDate, 0)
      })
    })

    describe('arithmetic', () => {
      bench('addDays', () => {
        adapter.addDays(testDate, 5)
      })

      bench('addMonths', () => {
        adapter.addMonths(testDate, 2)
      })

      bench('chain 10 additions', () => {
        let date = testDate

        for (let i = 0; i < 10; i++) {
          date = adapter.addDays(date, 1)
        }
      })
    })

    describe('comparison', () => {
      const other = Temporal.PlainDateTime.from('2024-06-20T10:30:00')

      bench('isAfter', () => {
        adapter.isAfter(testDate, other)
      })

      bench('isSameDay', () => {
        adapter.isSameDay(testDate, other)
      })

      bench('compare 1000 pairs', () => {
        for (let i = 0; i < 1000; i++) {
          adapter.isAfter(testDate, other)
        }
      })
    })

    describe('getters/setters', () => {
      bench('get components', () => {
        adapter.getYear(testDate)
        adapter.getMonth(testDate)
        adapter.getDate(testDate)
        adapter.getHours(testDate)
        adapter.getMinutes(testDate)
      })

      bench('set components', () => {
        let _date = testDate

        _date = adapter.setYear(_date, 2025)
        _date = adapter.setMonth(_date, 0)
        _date = adapter.setDate(_date, 1)
      })
    })
  })
})
