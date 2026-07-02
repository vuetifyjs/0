import { Marked } from 'marked'

import { processLinks } from './processLinks'

let inlineMarked: Marked | null = null
function getInlineMarked (): Marked {
  return inlineMarked ??= new Marked({ gfm: true })
}

/**
 * Render a short, source-authored markdown string (a maturity.json
 * `description`, or an individual prop/option description) to a single
 * inline HTML fragment (bold, code, links) — for full page markdown use
 * useMarkdown, which layers on block-level rendering, code highlighting,
 * and callouts.
 */
export function renderInlineMarkdown (text: string): string {
  return processLinks(getInlineMarked().parseInline(text) as string)
}
