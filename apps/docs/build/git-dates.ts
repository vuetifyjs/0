import { execSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT_DIR = resolve(__dirname, '../../..')

export interface GitDate {
  updated: string
  hash: string
}

export function getGitDate (filePath: string): GitDate | null {
  try {
    const result = execSync(
      `git log -1 --format="%aI|%h" -- "${filePath}"`,
      { cwd: ROOT_DIR, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] },
    ).trim()

    if (!result) return null

    const [updated, hash] = result.split('|')
    return { updated, hash }
  } catch {
    return null
  }
}

export function getGitHistory (filePath: string): string[] {
  try {
    const result = execSync(
      `git log --format="%aI" -- "${filePath}"`,
      { cwd: ROOT_DIR, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] },
    ).trim()

    if (!result) return []

    return result.split('\n')
  } catch {
    return []
  }
}

export function isRecent (iso: string | undefined | null, days: number): boolean {
  if (!iso) return false
  const then = Date.parse(iso)
  if (Number.isNaN(then)) return false
  const ageMs = Date.now() - then
  return ageMs >= 0 && ageMs < days * 24 * 60 * 60 * 1000
}
