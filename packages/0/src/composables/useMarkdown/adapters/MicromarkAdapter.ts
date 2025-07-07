// Utilities
import { micromark } from 'micromark'

// Types
import type { Options } from 'micromark'
import type { MarkdownAdapter } from '..'

export interface MicromarkOptions extends Options {}

export class MicromarkAdapter implements MarkdownAdapter {
  private options: MicromarkOptions

  constructor (options: MicromarkOptions = {}) {
    this.options = options
  }

  render = (content: string): string => {
    return micromark(content, this.options)
  }
}
