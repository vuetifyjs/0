import { describe, expect, it } from 'vitest'

import { createMarkdownIt } from './markdown'

describe('faq container', () => {
  it('should compile inline code in FAQ question titles', async () => {
    const md = await createMarkdownIt()
    const html = md.render(`::: faq
??? What's the difference between \`foo\` and \`bar\`?

Answer with \`baz\`.
:::`)

    expect(html).toContain('<template #question>')
    expect(html).toMatch(/<template #question>[\s\S]*<code[^>]*>foo<\/code>[\s\S]*<code[^>]*>bar<\/code>/)
    expect(html).not.toMatch(/<template #question>[^<]*`foo`/)
  })
})
