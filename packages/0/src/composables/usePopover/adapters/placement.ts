// Types
import type { PopoverAlign, PopoverPlacement, PopoverSide } from './adapter'

const SIDES = new Set<string>(['top', 'bottom', 'left', 'right'])

/**
 * Best-effort normalization of a CSS `position-area` value into an
 * engine-neutral `{ side, align }` descriptor. Covers the common single- and
 * two-token forms (`'bottom'`, `'top span-left'`, `'bottom span-right'`,
 * logical `block-start`/`block-end`); anything else falls back to
 * `bottom`/`center`. `raw` always carries the original value verbatim, so no
 * expressiveness is lost even when the normalization doesn't recognize it.
 */
export function derivePlacement (positionArea: string): PopoverPlacement {
  const tokens = positionArea.trim().split(/\s+/)
  /* v8 ignore next -- defensive: split() on a string always yields at least one element */
  const first = tokens[0] ?? 'bottom'

  let side: PopoverSide = 'bottom'
  if (SIDES.has(first)) {
    side = first as PopoverSide
  } else if (first === 'block-start' || first === 'inline-start') {
    side = 'top'
  } else if (first === 'block-end' || first === 'inline-end') {
    side = 'bottom'
  }

  let align: PopoverAlign = 'center'
  const second = tokens[1]
  if (second === 'span-left' || second === 'span-start' || second === 'left') {
    align = 'start'
  } else if (second === 'span-right' || second === 'span-end' || second === 'right') {
    align = 'end'
  }

  return { side, align, raw: positionArea }
}
