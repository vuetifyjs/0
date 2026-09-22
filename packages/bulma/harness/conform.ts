declare global {
  interface ImportMeta {
    glob: (pattern: string, options: { query: string, import: string, eager: true }) => Record<string, unknown>
  }
}

/**
 * Conformance diff helper for @paper/bulma component tests.
 *
 * Fixtures are verbatim Bulma 1.0.4 docs markup captured in
 * `harness/fixtures/*.html`. Each file holds one or more fixture blocks,
 * each introduced by a `<!-- fixture: <label> -->` comment.
 *
 * Fixture strings are inlined at build time via `import.meta.glob(?raw)`,
 * so no fs access is needed under vitest browser mode. Parsing uses
 * DOMParser only — zero dependencies.
 *
 * Fixture addressing: `name` is the file basename, optionally followed by
 * `:<index>` or `:<label substring>` to pick a block — `'breadcrumb'`
 * (first block), `'breadcrumb:2'`, `'breadcrumb:icons'`.
 */

export interface ConformOptions {
  /** Attribute names skipped entirely on both sides. */
  ignoreAttrs?: string[]
  /**
   * Allow ANY attribute on the rendered element that the fixture lacks.
   * Default false — per the CANON diff-tolerance policy only additions of
   * `aria-*`, `data-*`, `role`, `tabindex`, and `id` are tolerated; every
   * other unexpected attribute fails conformance. Set true only with an
   * explanatory comment.
   */
  allowExtraAttrs?: boolean
  /** Allow classes the fixture lacks. Default false — fixture classes are the contract. */
  allowExtraClasses?: boolean
  /** Skip text content comparison. Default false. */
  ignoreText?: boolean
}

interface Block {
  label: string
  el: Element
}

const files = import.meta.glob('./fixtures/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

function source (file: string): string {
  const raw = files[`./fixtures/${file}.html`]
  if (!raw) {
    const known = Object.keys(files).map(key => key.replace('./fixtures/', '').replace('.html', ''))
    throw new Error(`conform: unknown fixture file "${file}" (known: ${known.join(', ')})`)
  }
  return raw
}

function parse (file: string): Block[] {
  const doc = new DOMParser().parseFromString(source(file), 'text/html')
  const list: Block[] = []
  let label = ''
  // Leading comments (the file header chain and often the first fixture label)
  // are hoisted by the HTML parser to the document and <head> — walk them
  // before the body so block 0's label is reachable.
  const nodes = [
    ...Array.from(doc.childNodes).filter(node => node.nodeType === Node.COMMENT_NODE),
    ...Array.from(doc.head.childNodes),
    ...Array.from(doc.body.childNodes),
  ]
  for (const node of nodes) {
    if (node.nodeType === Node.COMMENT_NODE) {
      const match = /fixture:\s*(.*)/.exec(node.textContent ?? '')
      if (match) label = match[1].trim()
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      list.push({ label, el: node as Element })
    }
  }
  return list
}

/** Load a fixture block as a detached Element. See file header for `name` syntax. */
export function loadFixture (name: string): Element {
  const colon = name.indexOf(':')
  const file = colon === -1 ? name : name.slice(0, colon)
  const pick = colon === -1 ? '0' : name.slice(colon + 1)
  const all = parse(file)
  if (all.length === 0) throw new Error(`conform: no fixture blocks found in ${file}.html`)
  if (/^\d+$/.test(pick)) {
    const block = all[Number(pick)]
    if (!block) throw new Error(`conform: fixture index ${pick} out of range in ${file}.html (${all.length} blocks)`)
    return block.el
  }
  const matches = all.filter(entry => entry.label.includes(pick))
  if (matches.length === 0) {
    throw new Error(`conform: no fixture labeled "${pick}" in ${file}.html (labels: ${all.map(entry => entry.label).join(' | ')})`)
  }
  // A substring matching blocks under DIFFERENT labels is ambiguous — a
  // shifted or renamed label must fail loudly, never silently repoint.
  const labels = new Set(matches.map(entry => entry.label))
  if (labels.size > 1) {
    throw new Error(`conform: label "${pick}" is ambiguous in ${file}.html (matches: ${[...labels].join(' | ')})`)
  }
  return matches[0].el
}

function text (el: Element): string {
  let out = ''
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) out += node.textContent ?? ''
  }
  return out.replaceAll(/\s+/g, ' ').trim()
}

function skip (name: string, options: Required<ConformOptions>): boolean {
  return name === 'class' || name.startsWith('data-v-') || options.ignoreAttrs.includes(name)
}

/** Charter-tolerated additive attributes (CANON diff-tolerance policy #2). */
function tolerated (name: string): boolean {
  return name.startsWith('aria-') || name.startsWith('data-') || name === 'role' || name === 'tabindex' || name === 'id'
}

function fail (path: string, reason: string, actual: Element, expected: Element): never {
  throw new Error(`conform: ${path}: ${reason}\n  expected: ${expected.outerHTML}\n  actual:   ${actual.outerHTML}`)
}

function compare (actual: Element, expected: Element, options: Required<ConformOptions>, path: string): void {
  if (actual.tagName !== expected.tagName) {
    fail(path, `expected <${expected.tagName.toLowerCase()}>, got <${actual.tagName.toLowerCase()}>`, actual, expected)
  }
  for (const cls of Array.from(expected.classList)) {
    if (!actual.classList.contains(cls)) fail(path, `missing class "${cls}"`, actual, expected)
  }
  if (!options.allowExtraClasses) {
    for (const cls of Array.from(actual.classList)) {
      if (!expected.classList.contains(cls)) fail(path, `unexpected class "${cls}"`, actual, expected)
    }
  }
  for (const attr of Array.from(expected.attributes)) {
    if (skip(attr.name, options)) continue
    const value = actual.getAttribute(attr.name)
    if (value === null) fail(path, `missing attribute ${attr.name}="${attr.value}"`, actual, expected)
    if (value !== attr.value) fail(path, `attribute ${attr.name}: expected "${attr.value}", got "${value}"`, actual, expected)
  }
  if (!options.allowExtraAttrs) {
    for (const attr of Array.from(actual.attributes)) {
      // CANON diff-tolerance policy #2: additive aria-*, data-*, role,
      // tabindex, and id are deliberate v0 improvements — never failures.
      if (skip(attr.name, options) || tolerated(attr.name)) continue
      if (!expected.hasAttribute(attr.name)) fail(path, `unexpected attribute ${attr.name}="${attr.value}"`, actual, expected)
    }
  }
  if (!options.ignoreText && text(actual) !== text(expected)) {
    fail(path, `text: expected "${text(expected)}", got "${text(actual)}"`, actual, expected)
  }
  const wanted = Array.from(expected.children)
  const rendered = Array.from(actual.children)
  if (rendered.length !== wanted.length) {
    fail(path, `expected ${wanted.length} children, got ${rendered.length}`, actual, expected)
  }
  for (const [index, child] of wanted.entries()) {
    compare(rendered[index], child, options, `${path} > ${child.tagName.toLowerCase()}[${index}]`)
  }
}

/**
 * Assert `el` conforms to the fixture: same tag hierarchy, every fixture
 * class present per node, matching attributes and (normalized) text.
 * Throws with a node path and expected/actual markup on the first mismatch.
 */
export function conform (el: Element, name: string, options: ConformOptions = {}): void {
  const resolved: Required<ConformOptions> = {
    ignoreAttrs: options.ignoreAttrs ?? [],
    allowExtraAttrs: options.allowExtraAttrs ?? false,
    allowExtraClasses: options.allowExtraClasses ?? false,
    ignoreText: options.ignoreText ?? false,
  }
  const expected = loadFixture(name)
  compare(el, expected, resolved, expected.tagName.toLowerCase())
}
