// Utilities
import { marked } from 'marked'

// Types
import type { MarkedOptions as Options } from 'marked'
import type { MarkdownAdapter } from '..'

export interface MarkedOptions extends Options {}

/**
 * Markdown adapter implementation using the Marked library.
 * This adapter provides markdown parsing and rendering capabilities
 * with full support for CommonMark and GitHub Flavored Markdown.
 */
export class MarkedAdapter implements MarkdownAdapter {
  constructor (options: MarkedOptions = {}) {
    marked.setOptions(options)
  }

  render (content: string): string {
    return marked.parse(content) as string
  }
}
