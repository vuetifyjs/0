import { Marked } from 'marked'

import { processLinks } from './processLinks'

let blockMarked: Marked | null = null
function getBlockMarked (): Marked {
  return blockMarked ??= new Marked({ gfm: true, breaks: true })
}

let inlineMarked: Marked | null = null
function getInlineMarked (): Marked {
  return inlineMarked ??= new Marked({ gfm: true })
}

/**
 * Render a short, source-authored markdown string (JSDoc @remarks text) to
 * HTML. Block-level — paragraphs, lists — but no code highlighting or
 * callouts; for full page markdown use useMarkdown, which layers those on.
 */
export function renderMarkdown (text: string): string {
  return processLinks(getBlockMarked().parse(text) as string)
}

/**
 * Inline-only variant (bold, code, links) for single-line contexts that must
 * stay a single block element, e.g. an individual prop/option description.
 */
export function renderInlineMarkdown (text: string): string {
  return processLinks(getInlineMarked().parseInline(text) as string)
}
