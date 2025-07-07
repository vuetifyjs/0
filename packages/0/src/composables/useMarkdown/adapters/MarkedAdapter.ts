// Utilities
import { marked } from 'marked'

// Types
import type { MarkedOptions as Options } from 'marked'
import type { MarkdownAdapter } from '..'

export interface MarkedOptions extends Options {}

export class MarkedAdapter implements MarkdownAdapter {
  constructor (options: MarkedOptions = {}) {
    marked.setOptions(options)
  }

  render (content: string): string {
    return marked.parse(content) as string
  }
}
