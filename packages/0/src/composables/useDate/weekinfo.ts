/**
 * @module useDate/weekinfo
 *
 * @internal
 * Shared week-info derivation for the date family. Prefers
 * `Intl.Locale.getWeekInfo()` (with the legacy `weekInfo` accessor as a
 * secondary), then falls back to CLDR week data. Firefox ships neither
 * `getWeekInfo` nor `weekInfo` (https://bugzil.la/1810936), so without the
 * fallback table every locale there renders a Sunday-start week.
 */

// Utilities
import { isFunction, isNumber } from '#v0/utilities'

interface IntlLocaleWeekInfo {
  firstDay?: number
  minimalDays?: number
}

interface IntlLocaleWithWeekInfo {
  maximize?: () => { region?: string }
  getWeekInfo?: () => IntlLocaleWeekInfo
  weekInfo?: IntlLocaleWeekInfo
}

export interface WeekInfo {
  /** 0=Sun...6=Sat (v0 convention) */
  firstDay: number
  /** Minimum days in the first week of the year (1 or 4) */
  minimalDays: number
}

// CLDR supplemental week data (firstDay), keyed by region — generated from
// ICU getWeekInfo output (Node 22 / CLDR 46) so runtimes with and without
// Intl week info agree; includes ICU's deprecated region aliases (BU, RH, …).
// Regions not listed use the world default, Monday.
const FRI_REGIONS = 'MV'
const SAT_REGIONS = 'AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY'
const SUN_REGIONS = 'AG AS BD BR BS BT BU BW BZ CA CO DM DO ET GT GU HK HN ID IL IN IS JM JP JT KE KH KR LA MH MI MM MO MT MX MZ NI NP NT PA PE PH PK PR PT PU PY PZ RH SA SG SV TH TT TW UM US VE VI WK WS YD YE ZA ZW'

// ISO 8601 regions using minimalDays=4 (first week must contain Thursday)
const MD4_REGIONS = 'AD AN AT AX BE BG CH CZ DE DK EE ES FI FJ FO FR GB GF GP GR HU IE IS IT LI LT LU MC MQ NL NO PL PT RE RU SE SK SM VA'

/** Resolve the likely region for a locale ('de' → 'DE', 'en' → 'US') */
function deriveRegion (loc: IntlLocaleWithWeekInfo, locale: string): string {
  const maximized = isFunction(loc.maximize) ? loc.maximize().region : undefined
  return maximized ?? locale.slice(-2).toUpperCase()
}

/** CLDR firstDay fallback, already in v0's 0=Sun...6=Sat convention */
function deriveFirstDay (region: string): number {
  if (SUN_REGIONS.includes(region)) return 0
  if (SAT_REGIONS.includes(region)) return 6
  if (FRI_REGIONS === region) return 5
  return 1
}

/** CLDR minimalDays fallback */
function deriveMinimalDays (region: string): number {
  return MD4_REGIONS.includes(region) ? 4 : 1
}

/**
 * Derive week info for a locale.
 *
 * @param locale An Intl locale string (e.g. 'de-DE', 'en', 'ar-EG').
 * @returns firstDay in v0's 0=Sun...6=Sat convention, plus minimalDays.
 */
export function deriveWeekInfo (locale: string): WeekInfo {
  try {
    const loc: IntlLocaleWithWeekInfo = new Intl.Locale(locale)
    const info = isFunction(loc.getWeekInfo) ? loc.getWeekInfo() : loc.weekInfo
    const region = deriveRegion(loc, locale)
    // Intl firstDay: 1=Mon...7=Sun → v0 0=Sun...6=Sat
    const firstDay = isNumber(info?.firstDay) ? info.firstDay % 7 : deriveFirstDay(region)
    const minimalDays = info?.minimalDays ?? deriveMinimalDays(region)
    return { firstDay, minimalDays }
  } catch {
    return { firstDay: 0, minimalDays: 1 }
  }
}
