import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { copyFile, glob, mkdir, writeFile } from 'node:fs/promises'
import { availableParallelism } from 'node:os'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Worker } from 'node:worker_threads'

import { getApiNamesGrouped } from './api-names'
import { parseFrontmatter } from './frontmatter'

// Types
import type { Frontmatter } from './frontmatter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAGES_DIR = resolve(__dirname, '../src/pages')
const DIST_DIR = resolve(__dirname, '../dist')
const CACHE_DIR = resolve(__dirname, '../node_modules/.cache/og-images')
const WORKER_URL = new URL('og-images-worker.ts', import.meta.url)

function hash (input: string | Buffer): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 16)
}

// Cache key includes the worker source and every visual asset so any change
// to template, fonts, or images automatically invalidates every cached PNG.
const TEMPLATE_VERSION = hash(Buffer.concat([
  readFileSync(fileURLToPath(WORKER_URL)),
  readFileSync(resolve(__dirname, 'fonts/Inter-Regular.ttf')),
  readFileSync(resolve(__dirname, 'fonts/Inter-Bold.ttf')),
  readFileSync(resolve(__dirname, 'fonts/vuetify0-logo.png')),
  readFileSync(resolve(__dirname, 'fonts/vzero-icon-white.png')),
]))

function getPath (file: string): string {
  return '/' + relative(PAGES_DIR, file)
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '')
}

function cleanTitle (raw: string): string {
  return raw.includes(' - ') ? raw.split(' - ')[0] : raw
}

const CATEGORY_MAP: Record<string, string> = {
  introduction: 'Introduction',
  guide: 'Guide',
  components: 'Components',
  composables: 'Composables',
  utilities: 'Utilities',
  api: 'API Reference',
}

function inferCategory (path: string, frontmatter: Frontmatter): string | undefined {
  if (frontmatter.features?.category) return frontmatter.features.category
  return CATEGORY_MAP[path.split('/')[1]]
}

interface FileEntry {
  path: string
  title: string
  description: string
  category?: string
  hash: string
}

function outFileFor (path: string): string {
  const out = path === '' || path === '/' ? '/index' : path
  return resolve(DIST_DIR, `og${out}.png`)
}

interface WorkerJob {
  id: number
  title: string
  description: string
  category?: string
}

interface WorkerResponse {
  id: number
  png?: Uint8Array
  error?: string
}

interface QueueItem {
  job: WorkerJob
  resolve: (buf: Buffer) => void
  reject: (error: Error) => void
}

class WorkerPool {
  private workers: Worker[] = []
  private idle: Worker[] = []
  private queue: QueueItem[] = []
  private nextId = 0
  private failed = false

  constructor (size: number) {
    for (let i = 0; i < size; i++) {
      const worker = new Worker(WORKER_URL, { execArgv: ['--import', 'tsx'] })
      this.workers.push(worker)
      this.idle.push(worker)
    }
  }

  run (job: Omit<WorkerJob, 'id'>): Promise<Buffer> {
    const id = this.nextId++
    return new Promise<Buffer>((resolve, reject) => {
      if (this.failed) {
        reject(new Error('Worker pool has failed'))
        return
      }
      this.queue.push({ job: { ...job, id }, resolve, reject })
      this.dispatch()
    })
  }

  async terminate () {
    await Promise.all(this.workers.map(worker => worker.terminate()))
  }

  private dispatch () {
    while (this.idle.length > 0 && this.queue.length > 0) {
      const worker = this.idle.shift()!
      const item = this.queue.shift()!
      this.assign(worker, item)
    }
  }

  private fail (error: Error) {
    if (this.failed) return
    this.failed = true
    const queued = this.queue
    this.queue = []
    for (const item of queued) item.reject(error)
  }

  private assign (worker: Worker, item: QueueItem) {
    const onMessage = (msg: WorkerResponse) => {
      if (msg.id !== item.job.id) return
      worker.off('message', onMessage)
      worker.off('error', onError)
      if (msg.error) {
        item.reject(new Error(msg.error))
      } else {
        item.resolve(Buffer.from(msg.png!))
      }
      if (!this.failed) {
        this.idle.push(worker)
        this.dispatch()
      }
    }

    const onError = (error: Error) => {
      worker.off('message', onMessage)
      worker.off('error', onError)
      item.reject(error)
      this.fail(error)
    }
    worker.on('message', onMessage)
    worker.once('error', onError)
    worker.postMessage(item.job)
  }
}

function isTruthy (value: string | undefined): boolean {
  if (!value) return false
  const lower = value.toLowerCase()
  return lower !== '0' && lower !== 'false' && lower !== 'no'
}

export async function generateOgImages (): Promise<void> {
  if (isTruthy(process.env.SKIP_OG_IMAGES)) {
    console.log('[og-images] Skipped (SKIP_OG_IMAGES set)')
    return
  }

  const start = performance.now()

  const files: FileEntry[] = []
  const root: Omit<FileEntry, 'hash'> = {
    path: '/',
    title: 'The AI-native headless framework for Vue',
    description: 'Headless components and composables for building modern applications and design systems',
  }
  files.push({ ...root, hash: hash(`${TEMPLATE_VERSION}|${root.title}|${root.description}|`) })

  for await (const file of glob(`${PAGES_DIR}/**/*.md`)) {
    const raw = readFileSync(file, 'utf8')
    const { frontmatter } = parseFrontmatter(raw)

    if (!frontmatter.title) continue

    const path = getPath(file)
    const title = cleanTitle(frontmatter.title)
    const description = frontmatter.description ?? ''
    const category = inferCategory(path, frontmatter)
    files.push({
      path,
      title,
      description,
      category,
      hash: hash(`${TEMPLATE_VERSION}|${title}|${description}|${category ?? ''}`),
    })
  }

  const grouped = await getApiNamesGrouped()
  for (const info of grouped.components) {
    const title = `${info.name} API`
    const description = `API reference for the ${info.name} component.`
    const category = 'API Reference'
    files.push({
      path: `/api/${info.slug}`,
      title,
      description,
      category,
      hash: hash(`${TEMPLATE_VERSION}|${title}|${description}|${category}`),
    })
  }
  for (const info of grouped.composables) {
    const title = `${info.name} API`
    const description = `API reference for the ${info.name} composable.`
    const category = 'API Reference'
    files.push({
      path: `/api/${info.slug}`,
      title,
      description,
      category,
      hash: hash(`${TEMPLATE_VERSION}|${title}|${description}|${category}`),
    })
  }

  await mkdir(CACHE_DIR, { recursive: true })

  const misses: FileEntry[] = []
  const cacheResults = await Promise.all(files.map(async file => {
    const cachePath = resolve(CACHE_DIR, `${file.hash}.png`)
    if (!existsSync(cachePath)) return { hit: false, file }
    const outFile = outFileFor(file.path)
    await mkdir(dirname(outFile), { recursive: true })
    await copyFile(cachePath, outFile)
    return { hit: true }
  }))
  let cached = 0
  for (const result of cacheResults) {
    if (result.hit) cached++
    else misses.push(result.file!)
  }

  let rendered = 0
  if (misses.length > 0) {
    const poolSize = Math.max(1, Math.min(availableParallelism(), misses.length))
    const pool = new WorkerPool(poolSize)
    try {
      await Promise.all(misses.map(async file => {
        const png = await pool.run({
          title: file.title,
          description: file.description,
          category: file.category,
        })
        const cachePath = resolve(CACHE_DIR, `${file.hash}.png`)
        const outFile = outFileFor(file.path)
        await mkdir(dirname(outFile), { recursive: true })
        await Promise.all([writeFile(cachePath, png), writeFile(outFile, png)])
        rendered++
      }))
    } finally {
      await pool.terminate()
    }
  }

  const elapsed = ((performance.now() - start) / 1000).toFixed(1)
  console.log(`[og-images] Generated ${rendered + cached} images in ${elapsed}s (${rendered} rendered, ${cached} cached)`)
}
