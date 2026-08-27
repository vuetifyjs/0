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

  it('should not dump page footnotes into FAQ question titles', async () => {
    const md = await createMarkdownIt()
    const html = md.render(`See the cancel chain[^drag-cancel].

[^drag-cancel]: onLeave then onCancel.

::: faq
??? Why not use HTML5 drag-and-drop?

Native HTML5 DnD has terrible mobile support.
:::
`)

    expect(html).toMatch(/<template #question>Why not use HTML5 drag-and-drop\?<\/template>/)
    expect(html).not.toMatch(/<template #question>[\s\S]*footnotes[\s\S]*<\/template>/)
    expect(html).toContain('class="footnotes"')
  })
})
