// Types
import type { PopoverAlign, PopoverPlacement, PopoverSide } from './adapter'

// Logical block-start/block-end are the block axis (top/bottom); logical
// inline-start/inline-end are the inline axis (left/right in LTR) -
// conflating them hands a JS adapter the wrong axis, even though
// V0PopoverAdapter (which renders `raw` verbatim) is unaffected either way.
const SIDE_KEYWORDS: Record<string, PopoverSide> = {
  'top': 'top',
  'bottom': 'bottom',
  'left': 'left',
  'right': 'right',
  'block-start': 'top',
  'block-end': 'bottom',
  'inline-start': 'left',
  'inline-end': 'right',
}

/**
 * Best-effort normalization of a CSS `position-area` value into an
 * engine-neutral `{ side, align }` descriptor. Covers the common single- and
 * two-token forms (`'bottom'`, `'top span-left'`, `'bottom span-right'`,
 * logical `block-start`/`block-end`/`inline-start`/`inline-end`); anything
 * else falls back to `bottom`/`center`. `raw` always carries the original
 * value verbatim, so no expressiveness is lost even when the normalization
 * doesn't recognize it.
 */
export function toPlacement (positionArea: string): PopoverPlacement {
  const tokens = positionArea.trim().split(/\s+/)
  /* v8 ignore next -- defensive: split() on a string always yields at least one element */
  const first = tokens[0] ?? 'bottom'

  const side: PopoverSide = SIDE_KEYWORDS[first] ?? 'bottom'

  let align: PopoverAlign = 'center'
  const second = tokens[1]
  if (second === 'span-left' || second === 'span-start' || second === 'left') {
    align = 'start'
  } else if (second === 'span-right' || second === 'span-end' || second === 'right') {
    align = 'end'
  }

  return { side, align, raw: positionArea }
}
