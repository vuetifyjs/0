/**
 * Grouped characters (text-fields page, "Formatted input"): a pattern whose
 * slots take the user's characters and whose every other character is a
 * separator the field inserts on its own, such as `'(###) ###-####'`.
 *
 * Slots: `#` a digit, `A` a letter, `*` a digit or a letter. Separators should
 * not be letters or digits: the significant characters of an edited string are
 * its letters and digits, so an alphanumeric separator would be read back as input.
 */

const SLOTS = new Map<string, RegExp>([
  ['#', /\d/],
  ['A', /[a-z]/i],
  ['*', /[\da-z]/i],
])

const SIGNIFICANT = /[\da-z]/i

function slot (mask: string, index: number): boolean {
  return SLOTS.has(mask.charAt(index))
}

/** The letters and digits of a raw string, in order: the characters the slots take. */
function significant (value: string): string[] {
  return [...value].filter(char => SIGNIFICANT.test(char))
}

/**
 * Lays `value` into the pattern. With `trail`, the separators that follow the
 * last filled slot are written too, so the caret lands in the next group the
 * moment one fills ("the cursor automatically jumps to the next group"). Deleting
 * passes `trail: false`, or a backspace over a separator would be undone at once.
 */
export function format (value: string, mask: string, trail = false): string {
  const chars = significant(value)

  if (chars.length === 0) return ''

  let out = ''
  let index = 0

  for (let position = 0; position < mask.length; position++) {
    const char = mask.charAt(position)
    const test = SLOTS.get(char)

    if (test) {
      while (index < chars.length && !test.test(chars[index]!)) index++

      if (index >= chars.length) break

      out += chars[index++]
    } else {
      if (index >= chars.length && !trail) break

      out += char
    }
  }

  return out
}

/** The model value: the characters sitting in the slots of a formatted string. */
export function unmask (value: string, mask: string): string {
  let out = ''

  for (const [index, char] of [...value].entries()) {
    if (slot(mask, index)) out += char
  }

  return out
}

/**
 * Where the caret belongs in the formatted string: after as many significant
 * characters as stood before it in the raw string, then past any separators
 * when the user was typing forward.
 */
export function caret (raw: string, position: number, formatted: string, mask: string, forward: boolean): number {
  const count = significant(raw.slice(0, position)).length

  let index = 0
  let seen = 0

  while (seen < count && index < formatted.length) {
    if (slot(mask, index)) seen++
    index++
  }

  if (forward) {
    while (index < formatted.length && !slot(mask, index)) index++
  }

  return index
}
