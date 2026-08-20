import axe from 'axe-core'

// Types
import type { AxeResults, ElementContext, ImpactValue, Result, RunOptions } from 'axe-core'

/** Fences the report in the run log so the `a11y` CI job can lift it out verbatim. */
export const REPORT_START = '--- v0 a11y report ---'
export const REPORT_END = '--- end v0 a11y report ---'

/** axe impact plus the synthetic fallback when axe omits one. */
export type AxeImpact = NonNullable<ImpactValue> | 'unknown'

/**
 * A single axe-core violation, flattened to the shape the sweep reports on.
 */
export interface AxeViolation {
  /** Fixture the violation was found in — a component directory name. */
  readonly subject: string
  /** axe-core rule id, e.g. `aria-valid-attr-value`. */
  readonly rule: string
  readonly impact: AxeImpact
  readonly help: string
  readonly helpUrl: string
  /** One entry per offending element, as an html snippet. */
  readonly nodes: readonly string[]
}

/**
 * Rules axe-core only makes sense of when it is looking at a whole document:
 * landmarks, page title, `<html lang>`, a single `<h1>`. The sweep mounts one
 * component into a bare container, so these fire on structure the component
 * does not own and cannot fix.
 *
 * `region` is intentionally **not** here. The harness wraps mounts in `<main>`
 * so bulk `region` noise is gone; remaining hits (e.g. Portal teleported to
 * `<body>`) are real placement findings — flag them as component/docs decisions,
 * not harness noise.
 *
 * Nothing here is disabled. The sweep runs every rule axe-core ships and
 * reports everything it finds; this list only lets the summary separate
 * "the component is wrong" from "the harness is not a page".
 */
const PAGE_LEVEL_RULES = new Set([
  'bypass',
  'document-title',
  'html-has-lang',
  'html-lang-valid',
  'html-xml-lang-mismatch',
  'landmark-one-main',
  'page-has-heading-one',
])

/**
 * Findings that are inherent to a component's design, not defects — keyed
 * `subject:rule`. The rule still runs and still reports (it stays a real
 * finding for every other component); the note only keeps the summary from
 * presenting an expected hit as unexplained.
 *
 * Portal teleports content to `<body>` — outside every landmark — by design.
 * v0 is headless, so the teleported subtree's semantics (`role="dialog"`,
 * `role="status"`, `role="region"` + name) are the consumer's decision,
 * documented on the Portal docs page.
 * https://github.com/vuetifyjs/0/issues/742
 */
const EXPECTED = new Map([
  ['Portal:region', 'teleports outside landmarks by design — consumer supplies the subtree role, see the Portal docs Accessibility section'],
])

/**
 * Run axe-core over `element` and flatten the result.
 *
 * Deliberately passes no `rules` / `runOnly` option — an auditor configured
 * down to the rules we already pass is not an auditor.
 */
export async function audit (
  subject: string,
  element: ElementContext,
  options: RunOptions = {},
): Promise<AxeViolation[]> {
  const results: AxeResults = await axe.run(element, options)

  return results.violations.map((violation: Result) => ({
    subject,
    rule: violation.id,
    impact: (violation.impact ?? 'unknown') as AxeImpact,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map(node => node.html),
  }))
}

/**
 * Render the collected violations as a per-rule breakdown, then a per-subject
 * one. Printed by the sweep so the count lands in the CI log rather than in a
 * reviewer's head.
 */
export function summarize (violations: readonly AxeViolation[]): string {
  if (violations.length === 0) return 'axe: no violations'

  const byRule = new Map<string, AxeViolation[]>()
  const bySubject = new Map<string, AxeViolation[]>()

  for (const violation of violations) {
    byRule.set(violation.rule, [...(byRule.get(violation.rule) ?? []), violation])
    bySubject.set(violation.subject, [...(bySubject.get(violation.subject) ?? []), violation])
  }

  const lines: string[] = []
  const elements = violations.reduce((total, violation) => total + violation.nodes.length, 0)

  lines.push(
    `axe: ${violations.length} violations (${elements} elements) across ` +
    `${bySubject.size} components, ${byRule.size} distinct rules`,
    '',
    'by rule:',
  )

  const rules = [...byRule.entries()].toSorted((a, b) => b[1].length - a[1].length)

  for (const [rule, hits] of rules) {
    const nodes = hits.flatMap(hit => hit.nodes)
    const scope = PAGE_LEVEL_RULES.has(rule) ? ' [page-level — check the harness before the component]' : ''
    const subjects = [...new Set(hits.map(hit => hit.subject))].toSorted().join(', ')

    lines.push(
      `  ${rule} (${hits[0]!.impact}) — ${nodes.length} elements in ${subjects}${scope}`,
      `      ${hits[0]!.help}`,
      `      ${hits[0]!.helpUrl}`,
      ...nodes.slice(0, 3).map(node => `      > ${node.replaceAll(/\s+/g, ' ').slice(0, 160)}`),
    )
  }

  lines.push('', 'by component:')

  const subjects = [...bySubject.entries()].toSorted((a, b) => b[1].length - a[1].length)

  for (const [subject, hits] of subjects) {
    const counted = [...new Set(hits.map(hit => hit.rule))]
      .map(rule => {
        const count = hits.filter(hit => hit.rule === rule).flatMap(hit => hit.nodes).length
        const label = count > 1 ? `${rule} x${count}` : rule
        const note = EXPECTED.get(`${subject}:${rule}`)
        return note ? `${label} [expected — ${note}]` : label
      })
      .toSorted()

    lines.push(`  ${subject} — ${counted.join(', ')}`)
  }

  return lines.join('\n')
}
