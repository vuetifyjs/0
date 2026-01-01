/**
 * Shared frontmatter parsing utility for Vite plugins.
 * Handles the simple YAML subset used in documentation pages.
 */

export interface Frontmatter {
  title?: string
  features?: {
    category?: string
    label?: string
    order?: number
    hidden?: boolean
  }
}

export interface ParseResult {
  frontmatter: Frontmatter
  body: string
}

/**
 * Parse YAML frontmatter from markdown content.
 * Handles the subset of YAML used in v0 documentation:
 * - Simple key-value pairs
 * - Nested features block with category, label, order, hidden
 */
export function parseFrontmatter (content: string): ParseResult {
  if (!content.startsWith('---')) {
    return { frontmatter: {}, body: content }
  }

  const end = content.indexOf('---', 3)
  if (end === -1) {
    return { frontmatter: {}, body: content }
  }

  const frontmatterStr = content.slice(3, end).trim()
  const body = content.slice(end + 3).trim()

  const frontmatter: Frontmatter = {}
  const lines = frontmatterStr.split('\n')
  let inFeatures = false
  const features: NonNullable<Frontmatter['features']> = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('-')) continue

    // Check if we're entering/exiting a nested block
    if (!line.startsWith(' ') && !line.startsWith('\t')) {
      inFeatures = false
    }

    if (trimmed.startsWith('title:')) {
      frontmatter.title = trimmed.slice(6).trim().replace(/^['"]|['"]$/g, '')
    } else if (trimmed === 'features:') {
      inFeatures = true
    } else if (inFeatures) {
      if (trimmed.startsWith('category:')) {
        features.category = trimmed.slice(9).trim().replace(/^['"]|['"]$/g, '')
      } else if (trimmed.startsWith('label:')) {
        features.label = trimmed.slice(6).trim().replace(/^['"]|['"]$/g, '')
      } else if (trimmed.startsWith('order:')) {
        features.order = Number.parseInt(trimmed.slice(6).trim(), 10)
      } else if (trimmed.startsWith('hidden:')) {
        features.hidden = trimmed.slice(7).trim() === 'true'
      }
    }
  }

  if (Object.keys(features).length > 0) {
    frontmatter.features = features
  }

  return { frontmatter, body }
}

/**
 * Strip frontmatter from markdown content, returning only the body.
 */
export function stripFrontmatter (content: string): string {
  if (!content.startsWith('---')) return content
  const end = content.indexOf('---', 3)
  if (end === -1) return content
  return content.slice(end + 3).trim()
}
