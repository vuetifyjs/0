/**
 * Simple performance benchmarking utility for V0 framework.
 */

import { useLogger } from '#v0/composables/useLogger'

interface BenchmarkResult {
  readonly name: string
  readonly duration: number
  readonly ops: number
}

function now (): number {
  if (typeof performance !== 'undefined') return performance.now()
  return Date.now()
}

export async function run (
  name: string,
  fn: () => void,
  samples = 100,
): Promise<BenchmarkResult> {
  if (!__DEV__) {
    fn()
    return { name, duration: 0, ops: Infinity }
  }

  const times: number[] = []

  for (let i = 0; i < 5; i++) fn()

  for (let i = 0; i < samples; i++) {
    const start = now()
    fn()
    times.push(now() - start)
  }

  const duration = times.reduce((a, b) => a + b, 0) / times.length
  const ops = Math.round(1000 / duration)

  return { name, duration, ops }
}

export async function compare (
  benchmarks: Record<string, () => void>,
): Promise<BenchmarkResult[]> {
  const results: BenchmarkResult[] = []

  for (const [name, fn] of Object.entries(benchmarks)) {
    results.push(await run(name, fn))
  }

  return results.sort((a, b) => b.ops - a.ops)
}

export function guard<T extends any[], R> (
  name: string,
  fn: (...args: T) => R,
): (...args: T) => R {
  if (!__DEV__) return fn

  const logger = useLogger()

  return (...args: T): R => {
    const start = now()
    const result = fn(...args)
    const duration = now() - start

    if (duration > 16.67) {
      logger.warn(`${name} took ${duration.toFixed(2)}ms`)
    }

    return result
  }
}

if (__DEV__ && typeof globalThis !== 'undefined') {
  (globalThis as any).__v0Benchmark__ = { run, compare, guard }
}
