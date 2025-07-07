// Utilities
import MarkdownIt from 'markdown-it'

// Types
import type { Options } from 'markdown-it'
import type { MarkdownAdapter } from '..'

export interface MarkdownItOptions {}

export class MarkdownItAdapter implements MarkdownAdapter {
  private md: MarkdownIt

  constructor (options: Options = {}) {
    this.md = new MarkdownIt(options)
  }

  render = (content: string): string => {
    return this.md.render(content)
  }
}
