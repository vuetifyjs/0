export interface SpecialSponsor {
  name: string
  logo: string
  logoDark?: string
  url: string
}

export const SPECIAL_SPONSOR: SpecialSponsor | null = null

export const SPECIAL_SPONSOR_PRICE = 2000

// Update once the dedicated $2,000 tier exists on github.com/sponsors/johnleider;
// the deep link will be .../sponsorships?tier_id=XXX
export const SPECIAL_SPONSOR_TIER_URL = 'https://github.com/sponsors/johnleider'
