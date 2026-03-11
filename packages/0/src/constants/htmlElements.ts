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

export const SELF_CLOSING_TAGS = new Set(selfClosingTags)

/**
 * Common HTML element types for polymorphic components
 */
export const COMMON_ELEMENTS = {
  // Layout
  DIV: 'div',
  SPAN: 'span',
  SECTION: 'section',
  ARTICLE: 'article',
  ASIDE: 'aside',
  HEADER: 'header',
  FOOTER: 'footer',
  MAIN: 'main',
  NAV: 'nav',

  // Text
  P: 'p',
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',

  // Interactive
  BUTTON: 'button',
  A: 'a',
  INPUT: 'input',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  LABEL: 'label',

  // Lists
  UL: 'ul',
  OL: 'ol',
  LI: 'li',
  DL: 'dl',
  DT: 'dt',
  DD: 'dd',

  // Media
  IMG: 'img',
  VIDEO: 'video',
  AUDIO: 'audio',
  CANVAS: 'canvas',
  SVG: 'svg',

  // Table
  TABLE: 'table',
  THEAD: 'thead',
  TBODY: 'tbody',
  TFOOT: 'tfoot',
  TR: 'tr',
  TH: 'th',
  TD: 'td',

  // Form
  FORM: 'form',
  FIELDSET: 'fieldset',
  LEGEND: 'legend',
} as const

/**
 * Check if an element is self-closing
 */
export function isSelfClosingTag (tag: keyof HTMLElementTagNameMap): boolean {
  return SELF_CLOSING_TAGS.has(tag.toLowerCase() as any)
}

/**
 * Type for all valid HTML element names
 */
export type HTMLElementName = keyof HTMLElementTagNameMap

/**
 * Type for self-closing HTML elements
 */
export type SelfClosingElement = (typeof selfClosingTags)[number]
