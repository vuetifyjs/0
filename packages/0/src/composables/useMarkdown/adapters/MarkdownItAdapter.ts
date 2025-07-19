// Utilities
import MarkdownIt from 'markdown-it'

// Types
import type { Options } from 'markdown-it'
import type { MarkdownAdapter } from '..'

export interface MarkdownItOptions {}

/**
 * Markdown adapter implementation using the markdown-it library.
 * This adapter provides highly extensible markdown parsing with
 * plugin support and customizable syntax rules.
 */
export class MarkdownItAdapter implements MarkdownAdapter {
  private md: MarkdownIt

  constructor (options: Options = {}) {
    this.md = new MarkdownIt(options)
  }

  render = (content: string): string => {
    return this.md.render(content)
  }
}
