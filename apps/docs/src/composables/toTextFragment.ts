/**
 * Link a docs phrase with a text fragment (`#:~:text=`), then paint that
 * phrase the way the maturity matrix paints a search hit: `toHighlight`
 * decides the span, and the span becomes a `<mark>`.
 *
 * The fragment grammar follows the scroll-to-text-fragment spec. `-` and `,`
 * are syntax, so they are percent-encoded inside each piece.
 */

// Framework
import { isUndefined, toHighlight } from '@vuetify/v0'
import { IN_BROWSER } from '@vuetify/v0/constants'

const BLOCKS = 'p, li, h1, h2, h3, h4, h5, h6, td, th, dd, blockquote, figcaption'
const SKIP = 'pre, textarea, select, input, [contenteditable="true"], [data-docs-text-link]'
const MARK = 'docs-text-mark'
const EXACT_LIMIT = 120
const CONTEXT_LIMIT = 8

export interface TextDirective {
  prefix?: string
  start: string
  end?: string
  suffix?: string
}

export interface TextQuote {
  quote: string
  at: number
  text: string
}

interface Piece {
  node: Text
  start: number
}

interface Word {
  word: string
  from: number
  to: number
}

function encodePiece (value: string): string {
  return encodeURIComponent(value).replaceAll('-', '%2D')
}

function decodePiece (value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/**
 * `#:~:text=` (or `#id:~:text=`). The leading colon is the directive
 * delimiter; `URL.hash` supplies the `#` when this string is assigned.
 */
export function toTextFragment (directive: TextDirective): string {
  let value = ''

  if (directive.prefix) value += `${encodePiece(directive.prefix)}-,`
  value += encodePiece(directive.start)
  if (directive.end) value += `,${encodePiece(directive.end)}`
  if (directive.suffix) value += `,-${encodePiece(directive.suffix)}`

  return `:~:text=${value}`
}

function parseDirective (hash: string): TextDirective | undefined {
  const at = hash.indexOf(':~:')
  if (at === -1) return undefined

  const raw = hash
    .slice(at + 3)
    .split('&')
    .find(part => part.startsWith('text='))

  if (!raw) return undefined

  return parseTextQuery(raw.slice(5))
}

function parseTextQuery (value: string): TextDirective | undefined {
  if (!value) return undefined

  let rest = value
  let prefix: string | undefined
  let suffix: string | undefined
  const suffixAt = rest.indexOf(',-')

  if (suffixAt !== -1) {
    suffix = decodePiece(rest.slice(suffixAt + 2))
    rest = rest.slice(0, suffixAt)
  }

  const prefixAt = rest.indexOf('-,')

  if (prefixAt !== -1) {
    prefix = decodePiece(rest.slice(0, prefixAt))
    rest = rest.slice(prefixAt + 2)
  }

  const comma = rest.indexOf(',')
  const start = decodePiece(comma === -1 ? rest : rest.slice(0, comma))
  const end = comma === -1 ? undefined : decodePiece(rest.slice(comma + 1))

  if (!start) return undefined

  return directive({ prefix, start, end, suffix })
}

function directive (fields: TextDirective): TextDirective {
  return {
    start: fields.start,
    ...(fields.prefix ? { prefix: fields.prefix } : {}),
    ...(fields.end ? { end: fields.end } : {}),
    ...(fields.suffix ? { suffix: fields.suffix } : {}),
  }
}

export function toFragmentUrl (href: string, directive: TextDirective): string {
  const url = new URL(href)
  url.hash = toTextFragment(directive)
  return url.href
}

/** The `:~:` directive suffix of a hash, including the colon. Empty when absent. */
export function toFragmentSuffix (hash: string): string {
  const at = hash.indexOf(':~:')
  return at === -1 ? '' : hash.slice(at)
}

/**
 * The directive this document was opened with.
 *
 * Chrome removes `:~:text=` from `location` before any script runs, and the
 * prose is not in the first HTML payload, so the browser's own highlight
 * never fires. The navigation entry still carries the original URL.
 */
export function readTextFragment (): TextDirective | undefined {
  if (!IN_BROWSER) return undefined

  const entry = performance.getEntriesByType('navigation')[0]
  if (!entry) return undefined

  try {
    const url = new URL(entry.name)
    if (url.pathname !== location.pathname || url.search !== location.search) return undefined

    return parseDirective(url.hash)
  } catch {
    return undefined
  }
}

function wordBefore (text: string, index: number): Word | undefined {
  let cursor = index

  while (cursor > 0 && /\s/.test(text.charAt(cursor - 1))) cursor--

  const to = cursor

  while (cursor > 0 && !/\s/.test(text.charAt(cursor - 1))) cursor--

  const word = text.slice(cursor, to)

  if (!word) return undefined

  return { word, from: cursor, to }
}

function wordAfter (text: string, index: number): Word | undefined {
  let cursor = index

  while (cursor < text.length && /\s/.test(text.charAt(cursor))) cursor++

  const from = cursor

  while (cursor < text.length && !/\s/.test(text.charAt(cursor))) cursor++

  const word = text.slice(from, cursor)

  if (!word) return undefined

  return { word, from, to: cursor }
}

function beside (
  text: string,
  startAt: number,
  endAt: number,
  directive: TextDirective,
): boolean {
  if (directive.prefix && !text.slice(0, startAt).trimEnd().endsWith(directive.prefix)) return false
  if (directive.suffix && !text.slice(endAt).trimStart().startsWith(directive.suffix)) return false
  return true
}

function occurrences (text: string, directive: TextDirective): Array<[number, number]> {
  if (!directive.start) return []

  const ranges: Array<[number, number]> = []
  let from = 0

  while (from < text.length) {
    const startAt = text.indexOf(directive.start, from)
    if (startAt === -1) break

    let endAt = startAt + directive.start.length

    if (directive.end) {
      const endPos = text.indexOf(directive.end, endAt)
      if (endPos === -1) break
      endAt = endPos + directive.end.length
    }

    if (beside(text, startAt, endAt, directive)) ranges.push([startAt, endAt])

    from = startAt + 1
  }

  return ranges
}

function passage (quote: string): Pick<TextDirective, 'end' | 'start'> {
  if (quote.length <= EXACT_LIMIT) return { start: quote }

  const words = quote.split(/\s+/).filter(Boolean)

  if (words.length < 8) return { start: quote }

  return {
    start: words.slice(0, 4).join(' '),
    end: words.slice(-4).join(' '),
  }
}

function buildDirective (text: string, quote: string, at: number): TextDirective {
  const { start, end } = passage(quote)
  let prefix: string | undefined
  let suffix: string | undefined
  let prefixFrom = at
  let suffixTo = at + quote.length

  for (let step = 0; step < CONTEXT_LIMIT; step++) {
    const next = directive({ prefix, start, end, suffix })

    if (occurrences(text, next).length <= 1) return next

    const before = wordBefore(text, prefixFrom)
    const after = wordAfter(text, suffixTo)

    if (!before && !after) return next

    if (before) {
      prefix = prefix ? `${before.word} ${prefix}` : before.word
      prefixFrom = before.from
    }

    if (after) {
      suffix = suffix ? `${suffix} ${after.word}` : after.word
      suffixTo = after.to
    }
  }

  return directive({ prefix, start, end, suffix })
}

/**
 * A directive parsed from a hash, or one that points at `quote` starting at `at`.
 * Exact text when the phrase is unique; surrounding words until it isn't.
 */
export function toTextDirective (hash: string): TextDirective | undefined
export function toTextDirective (text: string, quote: string, at: number): TextDirective
export function toTextDirective (
  textOrHash: string,
  quote?: string,
  at?: number,
): TextDirective | undefined {
  if (isUndefined(quote) || isUndefined(at)) return parseDirective(textOrHash)

  return buildDirective(textOrHash, quote, at)
}

/**
 * Match spans for a directive. `toHighlight` is the painter's source of
 * truth: the search finds a range, and the composable's match chunk is what
 * gets wrapped.
 */
export function toTextRanges (text: string, directive: TextDirective): Array<[number, number]> {
  const found = occurrences(text, directive)
  const first = found[0]

  if (!first) return []

  const chunks = toHighlight(text, undefined, { matches: [first] })
  const ranges: Array<[number, number]> = []
  let cursor = 0

  for (const chunk of chunks) {
    const next = cursor + chunk.text.length
    if (chunk.match) ranges.push([cursor, next])
    cursor = next
  }

  return ranges
}

function elementOf (node: Node): Element | null {
  return node instanceof Element ? node : node.parentElement
}

function rejected (node: Node): boolean {
  return !!elementOf(node)?.closest(SKIP)
}

function blockOf (node: Node): HTMLElement | null {
  const block = elementOf(node)?.closest(BLOCKS)

  if (!(block instanceof HTMLElement)) return null
  if (rejected(block)) return null

  return block
}

function firstText (node: Node): Text | undefined {
  if (rejected(node)) return undefined
  if (node instanceof Text) return node.data ? node : undefined
  if (!(node instanceof Element)) return undefined

  for (const child of node.childNodes) {
    const text = firstText(child)
    if (text) return text
  }

  return undefined
}

function lastText (node: Node): Text | undefined {
  if (rejected(node)) return undefined
  if (node instanceof Text) return node.data ? node : undefined
  if (!(node instanceof Element)) return undefined

  for (let index = node.childNodes.length - 1; index >= 0; index--) {
    const child = node.childNodes[index]
    if (!child) continue
    const text = lastText(child)
    if (text) return text
  }

  return undefined
}

function textPoint (
  container: Node,
  offset: number,
  edge: 'end' | 'start',
): { node: Text, local: number } | undefined {
  if (container instanceof Text) return { node: container, local: offset }
  if (!(container instanceof Element)) return undefined

  if (edge === 'end' && offset > 0) {
    const child = container.childNodes[offset - 1]
    const text = child ? lastText(child) : undefined
    if (!text) return undefined
    return { node: text, local: text.length }
  }

  const child = container.childNodes[offset]
  const text = child ? firstText(child) : undefined
  if (!text) return undefined
  return { node: text, local: 0 }
}

function flatten (root: HTMLElement): { text: string, pieces: Piece[] } {
  const pieces: Piece[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode (node) {
      if (!(node instanceof Text) || !node.data || rejected(node)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  let text = ''
  let current = walker.nextNode()

  while (current) {
    if (current instanceof Text) {
      pieces.push({ node: current, start: text.length })
      text += current.data
    }
    current = walker.nextNode()
  }

  return { text, pieces }
}

/**
 * The selected phrase, if it sits in one block inside `root`. Cross-block
 * selections are refused: a flattened article glues paragraphs together, and
 * a highlight of that glue would paint the wrong span.
 */
export function toTextQuote (root: HTMLElement, range: Range): TextQuote | undefined {
  if (range.collapsed) return undefined
  if (!root.contains(range.commonAncestorContainer)) return undefined
  if (rejected(range.startContainer) || rejected(range.endContainer)) return undefined

  const block = blockOf(range.startContainer)

  if (!block || block !== blockOf(range.endContainer)) return undefined

  const raw = range.toString()
  const lead = raw.length - raw.trimStart().length
  const quote = raw.trim()

  if (quote.length < 2) return undefined

  const flat = flatten(root)
  const start = textPoint(range.startContainer, range.startOffset, 'start')

  if (!start) return undefined

  const piece = flat.pieces.find(item => item.node === start.node)

  if (!piece) return undefined

  const at = piece.start + start.local + lead

  if (flat.text.slice(at, at + quote.length) !== quote) return undefined

  return { quote, at, text: flat.text }
}

function paint (pieces: readonly Piece[], from: number, to: number) {
  const hits: Array<{ node: Text, localStart: number, localEnd: number }> = []

  for (const piece of pieces) {
    const pieceEnd = piece.start + piece.node.data.length
    if (pieceEnd <= from || piece.start >= to) continue

    hits.push({
      node: piece.node,
      localStart: Math.max(0, from - piece.start),
      localEnd: Math.min(piece.node.data.length, to - piece.start),
    })
  }

  for (let index = hits.length - 1; index >= 0; index--) {
    const hit = hits[index]
    if (!hit || hit.localStart >= hit.localEnd) continue

    let target = hit.node

    if (hit.localEnd < target.data.length) target.splitText(hit.localEnd)
    if (hit.localStart > 0) target = target.splitText(hit.localStart)

    const mark = document.createElement('mark')
    mark.className = `${MARK} bg-warning text-on-warning rounded px-0.5`
    target.parentNode?.insertBefore(mark, target)
    mark.append(target)
  }
}

export function clearTextMarks (root: ParentNode) {
  for (const mark of root.querySelectorAll(`mark.${MARK}`)) {
    const parent = mark.parentNode
    if (!parent) continue

    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
    mark.remove()
    parent.normalize()
  }
}

/** Wrap the directive's match. Returns false when the phrase is not in `root`. */
export function paintTextFragment (root: HTMLElement, directive: TextDirective): boolean {
  clearTextMarks(root)

  const flat = flatten(root)
  const range = toTextRanges(flat.text, directive)[0]

  if (!range) return false

  paint(flat.pieces, range[0], range[1])
  return true
}
