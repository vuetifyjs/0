export interface PrimarySponsor {
  name: string
  logo: string
  logoDark?: string
  url: string
}

export interface SpecialSponsor {
  name: string
  logo: string
  logoDark?: string
  url: string
}

export const PRIMARY_SPONSOR: PrimarySponsor | null = null

export const PRIMARY_SPONSOR_PRICE = 2000

export const PRIMARY_SPONSOR_TIER_URL = 'https://github.com/sponsors/johnleider/sponsorships?tier_id=621941'

export const SPECIAL_SPONSOR: SpecialSponsor | null = null

export const SPECIAL_SPONSOR_PRICE = 2000

// TODO(john): paste real $2,000 tier_id from github.com/sponsors dashboard
const SPECIAL_SPONSOR_TIER_ID = ''

// Deep link to the dedicated $2,000 tier once the tier_id is set above;
// falls back to the general sponsors page until then.
export const SPECIAL_SPONSOR_TIER_URL = SPECIAL_SPONSOR_TIER_ID
  ? `https://github.com/sponsors/johnleider/sponsorships?tier_id=${SPECIAL_SPONSOR_TIER_ID}`
  : 'https://github.com/sponsors/johnleider'
