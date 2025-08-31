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
