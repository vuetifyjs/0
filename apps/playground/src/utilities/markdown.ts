/**
 * Port of apps/docs/src/utilities/markdown.ts — keep in sync for description
 * chips (API cards, registry blurbs). Full-page markdown stays on markdown-it.
 */
import { Marked } from 'marked'

let inlineMarked: Marked | null = null

function getInlineMarked (): Marked {
  return inlineMarked ??= new Marked({ gfm: true })
}

/**
 * Render a short, source-authored markdown string (registry / maturity /
 * prop descriptions) to a single inline HTML fragment (bold, code, links).
 */
export function renderInlineMarkdown (text: string): string {
  return getInlineMarked().parseInline(text) as string
}
