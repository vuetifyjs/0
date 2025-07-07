// Utilities
import { markdown } from 'markdown'

// Types
import type { MarkdownAdapter } from '..'

export interface MarkdownJsOptions {
  dialect?: string
}

export class MarkdownJsAdapter implements MarkdownAdapter {
  private options: MarkdownJsOptions

  constructor (options: MarkdownJsOptions = {}) {
    this.options = options
  }

  render = (content: string): string => {
    // TODO: Why do options blow up when passed to markdown.toHTML?
    // if (this.options?.dialect) {
    //   return markdown.toHTML(content, this.options.dialect, this.options)
    // }
    // return markdown.toHTML(content, this.options)

    return markdown.toHTML(content)
  }
}
