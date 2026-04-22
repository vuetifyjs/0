const selfClosingTags = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'source',
  'track',
  'wbr',
] as const satisfies HTMLElementName[]

/**
 * Set of HTML elements that are self-closing (void elements)
 * These elements cannot have children and don't need closing tags
 */

export const SELF_CLOSING_TAGS = /* @__PURE__ */ new Set(selfClosingTags)

/**
 * Check if an element is self-closing
 */
/* #__NO_SIDE_EFFECTS__ */
export function isSelfClosingTag (tag: keyof HTMLElementTagNameMap): boolean {
  return SELF_CLOSING_TAGS.has(tag.toLowerCase() as SelfClosingElement)
}

/**
 * Type for all valid HTML element names
 */
export type HTMLElementName = keyof HTMLElementTagNameMap

/**
 * Type for self-closing HTML elements
 */
export type SelfClosingElement = (typeof selfClosingTags)[number]
