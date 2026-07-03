import type { MatchRange } from '@vuetify/v0'

export interface Message {
  id: number
  from: string
  subject: string
  body: string
  time: string
}

export const messages: Message[] = [
  {
    id: 1,
    from: 'Lina Park',
    subject: 'Q3 budget review',
    body: 'The marketing line item is 18% over forecast. Can we walk through the spend before Friday? I have a draft proposal that trims paid ads without touching the events budget.',
    time: '9:42 AM',
  },
  {
    id: 2,
    from: 'Marcus Chen',
    subject: 'Re: design review for the search experience',
    body: 'Loved the new typeahead — the highlight on each result row reads much faster than the underlined variant. One nit: the empty-state copy still says "no matches" instead of "no results".',
    time: '8:15 AM',
  },
  {
    id: 3,
    from: 'Priya Shah',
    subject: 'Weekly product sync notes',
    body: 'Recap: launched the new search bar, started the onboarding redesign, paused the budget dashboard work pending review. Open questions on the search ranking tweak are tracked in the planning doc.',
    time: 'Yesterday',
  },
  {
    id: 4,
    from: 'GitHub',
    subject: 'New review request on vuetifyjs/0#222',
    body: 'J-Sek requested your review on the toHighlight transformer PR. The branch adds a pure splitter and updates the create-filter live-search example to drop the v-html highlight path.',
    time: 'Yesterday',
  },
]

function escape (term: string) {
  return term.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`)
}

export function snippets (body: string, terms: string[]): MatchRange[] {
  const safe = terms.filter(Boolean)
  if (safe.length === 0) return []
  const pattern = safe.map(t => String.raw`\b${escape(t)}\w*`).join('|')
  const ranges: MatchRange[] = []
  for (const m of body.matchAll(new RegExp(pattern, 'gi'))) {
    ranges.push([m.index, m.index + m[0].length])
  }
  return ranges
}
