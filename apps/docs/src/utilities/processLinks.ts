/**
 * Process HTML string to add link decorators matching the markdown plugin behavior.
 * - External links (https://): opens in new tab, adds ↗ suffix
 * - Anchor links (#): adds # prefix
 * - Internal links: adds → suffix
 */
export function processLinks (html: string): string {
  return html.replace(/<a\s+href="([^"]+)"[^>]*>([^<]*)<\/a>/g, (_, href, text) => {
    let prefix = ''
    let suffix = ''
    let target = ''

    if (/^https?:\/\//i.test(href)) {
      suffix = '↗'
      target = ' target="_blank" rel="noopener noreferrer"'
    } else if (/#/.test(href)) {
      prefix = '#'
    } else {
      suffix = '→'
    }

    return `<a href="${href}" class="v0-link"${target}>${prefix}${text}${suffix}</a>`
  })
}
