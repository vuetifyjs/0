/**
 * Discover skillz tour IDs for SSG route generation.
 * Reads tour JSON files to extract IDs for pre-rendering /skillz/:id routes.
 */

import { readdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const TOURS_DIR = resolve(__dirname, '../src/skillz/tours')

/**
 * Recursively find all index.json files in the tours directory
 */
async function findTourFiles (dir: string): Promise<string[]> {
  const files: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await findTourFiles(fullPath))
    } else if (entry.name === 'index.json') {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Get all skillz tour IDs for SSG route generation
 */
export async function getSkillzSlugs (): Promise<string[]> {
  const tourFiles = await findTourFiles(TOURS_DIR)
  const slugs: string[] = []

  for (const file of tourFiles) {
    try {
      const content = await readFile(file, 'utf8')
      const tour = JSON.parse(content)
      if (tour.id) {
        slugs.push(tour.id)
      }
    } catch {
      // Skip invalid files
    }
  }

  return slugs
}
