/**
 * @module useDate/weekinfo
 *
 * @remarks
 * Week-info derivation for the date family, authoritative from CLDR 48 data
 * baked into this module. `Intl.Locale.getWeekInfo()` is deliberately NOT
 * consulted: it is absent on Firefox entirely (https://bugzil.la/1810936),
 * Node ≤22 only ships the legacy `weekInfo` accessor, and its answers drift
 * across ICU versions (Iceland flipped between ICU 77 and 78) — deriving from
 * the live runtime therefore produces server/client and cross-browser
 * disagreements. The tables win everywhere; a version-gated freshness test in
 * `index.test.ts` diffs them against the running ICU so CLDR drift surfaces
 * in CI instead of in a user's calendar.
 *
 * An explicit `-u-fw-` keyword on the locale tag always overrides the region
 * table, matching ICU behavior.
 *
 * @internal Consumed only by the useDate family. Fully decoupled (a locale
 * string in, a plain object out — no date or adapter types), so it is a
 * latent composable: promote to a standalone composable on a consumer
 * outside useDate. See `.claude/rules/composables.md` §"Sub-modules: inline,
 * private sibling, or promote".
 */

export interface WeekInfo {
  /** 0=Sun...6=Sat (v0 convention) */
  firstDay: number
  /** Minimum days in the first week of the year (1 or 4) */
  minimalDays: number
}

// CLDR 48 supplemental week data (firstDay), keyed by region; verified
// against ICU 78 getWeekInfo output for every two-letter region (the SUN
// list includes ICU's deprecated aliases: BU JT MI NT PU PZ RH WK YD).
// Regions not listed use the world default, Monday.
const FRI_REGIONS = 'MV'
const SAT_REGIONS = 'AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'
const SUN_REGIONS = 'AG AS BD BR BS BT BU BW BZ CA CO DM DO ET GT GU HK HN ID IL IN IS JM JP JT KE KH KR LA MH MI MM MO MT MX MZ NI NP NT PA PE PH PK PR PT PU PY PZ RH SA SG SV TH TT TW UM US VE VI WK WS YD YE ZA ZW'

// CLDR 48 supplemental week data (minDays=4): ISO 8601 regions where the
// first week of the year must contain a Thursday. All other regions use 1.
const MD4_REGIONS = 'AD AN AT AX BE BG CH CZ DE DK EE ES FI FJ FO FR GB GF GG GI GP GR HU IE IM IS IT JE LI LT LU MC MQ NL NO PL PT RE RU SE SJ SK SM VA'

const FW_DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

/** language[-script]-region tag parse for runtimes without Intl.Locale */
const REGION_PATTERN = /^[a-z]{2,8}(?:-[a-z]{4})?-([a-z]{2}|\d{3})(?:-|$)/i

/** Explicit `-u-fw-` week-start keyword on the tag; always wins over region data */
function deriveFw (locale: string): number | undefined {
  const match = /-fw-(sun|mon|tue|wed|thu|fri|sat)(?:-|$)/.exec(locale.toLowerCase())
  return match ? FW_DAYS.indexOf(match[1] as typeof FW_DAYS[number]) : undefined
}

/**
 * Resolve the region governing week data. A region declared on the tag wins
 * (matching ICU, which honors even unknown declared regions like 'en-ZZ');
 * bare tags resolve their likely region via maximize ('de' → 'DE',
 * 'en' → 'US'), with the world region as the last resort.
 */
function deriveRegion (locale: string): string {
  const declared = REGION_PATTERN.exec(locale)?.[1]?.toUpperCase()
  if (declared) return declared
  try {
    return new Intl.Locale(locale).maximize().region ?? '001'
  } catch {
    return '001'
  }
}

/** CLDR firstDay lookup, already in v0's 0=Sun...6=Sat convention */
function deriveFirstDay (region: string): number {
  if (SUN_REGIONS.includes(region)) return 0
  if (SAT_REGIONS.includes(region)) return 6
  if (FRI_REGIONS.includes(region)) return 5
  return 1
}

/** CLDR minimalDays lookup */
function deriveMinimalDays (region: string): number {
  return MD4_REGIONS.includes(region) ? 4 : 1
}

/**
 * Derive week info for a locale from CLDR data.
 *
 * @param locale An Intl locale string (e.g. 'de-DE', 'en', 'ar-EG', 'en-u-fw-mon').
 * @returns firstDay in v0's 0=Sun...6=Sat convention, plus minimalDays.
 */
/* #__NO_SIDE_EFFECTS__ */
export function deriveWeekInfo (locale: string): WeekInfo {
  const region = deriveRegion(locale)
  return {
    firstDay: deriveFw(locale) ?? deriveFirstDay(region),
    minimalDays: deriveMinimalDays(region),
  }
}
