import { EXTERNAL_LINK_SUFFIX } from '@/constants/links'

/**
 * Process HTML string to add link decorators matching the markdown plugin behavior.
 * - External links (https://): opens in new tab, adds ↗ suffix
 */
export function processLinks (html: string): string {
  return html.replace(/<a\s+href="([^"]+)"[^>]*>([^<]*)<\/a>/g, (_, href, text) => {
    let suffix = ''
    let target = ''

    if (/^https?:\/\//i.test(href)) {
      suffix = EXTERNAL_LINK_SUFFIX
      target = ' target="_blank" rel="noopener noreferrer"'
    }

    return `<a href="${href}" class="v0-link"${target}>${text}${suffix}</a>`
  })
}
