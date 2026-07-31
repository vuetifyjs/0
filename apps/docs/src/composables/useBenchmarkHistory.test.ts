import { beforeEach, describe, expect, it, vi } from 'vitest'

// Utilities
import { effectScope, nextTick } from 'vue'

// The per-version snapshot directory is discovered via import.meta.glob, which
// enumerates the filesystem at build time — so the snapshot files may legitimately
// be absent (CI regenerates them). Mock the source module to feed fixtures.
vi.mock('./benchmarkHistorySources', () => ({
  historySources: {
    '0.1.0.json': () => Promise.resolve({
      default: {
        version: '0.1.0',
        items: {
          createDataTable: {
            benchmarks: {
              _groups: {
                initialization: {
                  'Create table (1,000 items)': { name: 'Create table (1,000 items)', hz: 20_000, hzLabel: '20.0k ops/s', mean: 0.000_05, meanLabel: '50.0μs', rme: 10, tier: 'blazing' },
                },
              },
            },
          },
        },
      },
    }),
    '0.2.0.json': () => Promise.resolve({
      default: {
        version: '0.2.0',
        items: {
          createDataTable: {
            benchmarks: {
              _groups: {
                initialization: {
                  'Create table (1,000 items)': { name: 'Create table (1,000 items)', hz: 22_000, hzLabel: '22.0k ops/s', mean: 0.000_045_4, meanLabel: '45.4μs', rme: 11, tier: 'blazing' },
                },
              },
            },
          },
          createFilter: {
            benchmarks: {
              _groups: {
                'primitive filtering': {
                  'Filter 1k strings': { name: 'Filter 1k strings', hz: 5000, hzLabel: '5.0k ops/s', mean: 0.0002, meanLabel: '200μs', rme: 8, tier: 'fast' },
                },
              },
            },
          },
        },
      },
    }),
    '1.0.0-alpha.0.json': () => Promise.resolve({
      default: {
        version: '1.0.0-alpha.0',
        items: {
          createDataTable: {
            benchmarks: {
              _groups: {
                initialization: {
                  'Create table (1,000 items)': { name: 'Create table (1,000 items)', hz: 25_000, hzLabel: '25.0k ops/s', mean: 0.000_04, meanLabel: '40.0μs', rme: 12, tier: 'blazing' },
                },
              },
            },
          },
          createFilter: {
            benchmarks: {
              _groups: {
                'primitive filtering': {
                  'Filter 1k strings': { name: 'Filter 1k strings', hz: 5500, hzLabel: '5.5k ops/s', mean: 0.000_182, meanLabel: '182μs', rme: 9, tier: 'fast' },
                },
              },
            },
          },
        },
      },
    }),
  },
}))

vi.mock('@/data/metrics.json', () => ({
  default: {
    createDataTable: {
      coverage: { statements: 99.5, functions: 100, branches: 100, overall: 99.8 },
      benchmarks: {
        _groups: {
          initialization: {
            'Create table (1,000 items)': { name: 'Create table (1,000 items)', hz: 16_000, hzLabel: '16.0k ops/s', mean: 0.000_062_5, meanLabel: '62.5μs', rme: 13, tier: 'blazing' },
          },
        },
      },
    },
    createFilter: {
      coverage: { statements: 100, functions: 100, branches: 100, overall: 100 },
      benchmarks: {
        _groups: {
          'primitive filtering': {
            'Filter 1k strings': { name: 'Filter 1k strings', hz: 6000, hzLabel: '6.0k ops/s', mean: 0.000_167, meanLabel: '167μs', rme: 7, tier: 'fast' },
          },
        },
      },
    },
    Button: {
      coverage: { statements: 100, functions: 100, branches: 100, overall: 100 },
    },
  },
}))

// Composables
import { useBenchmarkHistory, __resetBenchmarkHistoryCacheForTests } from './useBenchmarkHistory'

async function setup (featureName: string) {
  const scope = effectScope()
  let api!: ReturnType<typeof useBenchmarkHistory>
  scope.run(() => {
    api = useBenchmarkHistory(featureName)
  })
  await vi.waitFor(() => {
    expect(api.isLoading.value).toBe(false)
  })
  await nextTick()
  return { api, stop: () => scope.stop() }
}

describe('useBenchmarkHistory', () => {
  beforeEach(() => {
    __resetBenchmarkHistoryCacheForTests()
  })

  it('should return null history for a feature with no historical data', async () => {
    const { api, stop } = await setup('Button')
    expect(api.history.value).toBeNull()
    stop()
  })

  it('should return null history for an unknown feature', async () => {
    const { api, stop } = await setup('DoesNotExist')
    expect(api.history.value).toBeNull()
    stop()
  })

  it('should build a 4-point trend for a feature present in all four sources', async () => {
    const { api, stop } = await setup('createDataTable')
    const history = api.history.value
    expect(history).not.toBeNull()
    expect(history!.feature).toBe('createDataTable')
    expect(history!.versionsSpanned).toEqual(['0.1.0', '0.2.0', '1.0.0-alpha.0', 'current'])
    expect(history!.groups).toHaveLength(1)

    const bench = history!.groups[0].benchmarks[0]
    expect(bench.name).toBe('Create table (1,000 items)')
    expect(bench.points).toHaveLength(4)
    expect(bench.points.map(p => p.hz)).toEqual([20_000, 22_000, 25_000, 16_000])
    expect(bench.points.map(p => p.version)).toEqual(['0.1.0', '0.2.0', '1.0.0-alpha.0', 'current'])
    expect(bench.points.map(p => p.isCurrent)).toEqual([false, false, false, true])
    stop()
  })

  it('should build a 3-point trend for a feature added in 0.2.0', async () => {
    const { api, stop } = await setup('createFilter')
    const history = api.history.value
    expect(history).not.toBeNull()
    expect(history!.versionsSpanned).toEqual(['0.2.0', '1.0.0-alpha.0', 'current'])

    const bench = history!.groups[0].benchmarks[0]
    expect(bench.points).toHaveLength(3)
    expect(bench.points.map(p => p.version)).toEqual(['0.2.0', '1.0.0-alpha.0', 'current'])
    stop()
  })

  it('should compute delta as percent change from first to last point', async () => {
    const { api, stop } = await setup('createDataTable')
    const bench = api.history.value!.groups[0].benchmarks[0]
    expect(bench.delta).toBeCloseTo(-20, 5)
    stop()
  })

  it('should expose isLoading that flips to false after the load resolves', async () => {
    const { api, stop } = await setup('createDataTable')
    expect(api.isLoading.value).toBe(false)
    stop()
  })
})
