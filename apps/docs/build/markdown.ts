import { fromHighlighter } from '@shikijs/markdown-it/core'
import Anchor from 'markdown-it-anchor'
import Attrs from 'markdown-it-attrs'
import Container from 'markdown-it-container'
import { createHighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import Markdown from 'unplugin-vue-markdown/vite'

// Types
import type { BundledLanguage, BundledTheme, HighlighterGeneric } from 'shiki'

// Local
import { createApiTransformer, renderVueApiInlineCode } from './shiki-api-transformer'

interface MarkdownToken {
  nesting: number
  info?: string
  type?: string
  content?: string
  children?: MarkdownToken[]
}

// Constants
import { EXTERNAL_LINK_SUFFIX } from '../src/constants/links'
import { SHIKI_THEME_IMPORTS, SHIKI_THEMES } from '../src/constants/shiki'

export default async function MarkdownPlugin () {
  const highlighter = await createHighlighterCore({
    themes: SHIKI_THEME_IMPORTS,
    langs: [
      import('@shikijs/langs/javascript'),
      import('@shikijs/langs/typescript'),
      import('@shikijs/langs/bash'),
      import('@shikijs/langs/vue'),
      import('@shikijs/langs/html'),
      import('@shikijs/langs/markdown'),
    ],
    engine: createJavaScriptRegexEngine(),
  })

  return Markdown({
    headEnabled: true,
    exposeFrontmatter: true,
    markdownItOptions: {
      html: true,
      linkify: true,
      typographer: true,
    },
    markdownItSetup (md) {
      md.use(Attrs)
      md.use(Anchor, {
        permalink: Anchor.permalink.headerLink({ symbol: '' }),
        slugify: (s: string) => s
          .toLowerCase()
          .trim()
          .replace(/[\s-]+/g, '-')
          .replace(/[^\w-]/g, '')
          .replace(/^-+|-+$/g, ''),
      })
      md.use(Container, 'code-group', {
        render (tokens: MarkdownToken[], index: number) {
          if (tokens[index].nesting === 1) {
            const info = (tokens[index] as MarkdownToken & { info?: string }).info?.trim() || ''
            const noFilename = info.includes('no-filename')
            return noFilename ? '<DocsCodeGroup no-filename>\n' : '<DocsCodeGroup>\n'
          }
          return '</DocsCodeGroup>\n'
        },
      })

      // Example container: ::: example ... :::
      // Lines starting with / are file paths, rest is markdown description
      // Single file without description: renders with peek, no description slot
      // Multiple files or with description: renders with description slot
      md.use(Container, 'example', {
        render (tokens: MarkdownToken[], index: number, _options: unknown, env: Record<string, unknown>) {
          if (tokens[index].nesting === 1) {
            // Mark that we're entering an example container
            env._inExample = true
            env._exampleFilePaths = [] as string[]
            return '' // Defer opening tag until we know the file path(s)
          }

          // Closing tag
          const wasOpened = env._exampleOpened
          const paths = env._exampleFilePaths as string[]

          delete env._inExample
          delete env._exampleFilePaths
          delete env._exampleOpened
          delete env._examplePathPara

          // If opened with description, close the description template
          if (wasOpened) {
            return `</template>\n</DocsExample>\n`
          }

          // If we have paths but no description content, emit simple peek version
          if (paths?.length === 1) {
            return `<DocsExample file-path="${paths[0]}" peek />\n`
          } else if (paths?.length > 1) {
            const pathsJson = JSON.stringify(paths).replace(/"/g, '\'')
            return `<DocsExample :file-paths="${pathsJson}" />\n`
          }

          return ''
        },
      })

      // FAQ container: ::: faq ... ::: or ::: faq single ... :::
      // Questions marked with ??? Question text
      md.use(Container, 'faq', {
        render (tokens: MarkdownToken[], index: number, _options: unknown, env: Record<string, unknown>) {
          if (tokens[index].nesting === 1) {
            const info = (tokens[index] as MarkdownToken & { info?: string }).info?.trim() || ''
            const isSingle = info.includes('single')
            return `<DocsFaq :multiple="${!isSingle}">\n`
          }
          // Close final FAQ item when container closes
          const closeItem = env._inFaqItem ? '</DocsFaqItem>\n' : ''
          delete env._inFaqItem
          return `${closeItem}</DocsFaq>\n`
        },
      })

      // Handle headings inside example containers - emit opening tag before first content
      const defaultHeadingOpen = md.renderer.rules.heading_open

      md.renderer.rules.heading_open = (tokens, index, options, env, self) => {
        // Inside example container, emit opening tag before first content (heading or paragraph)
        if (env._inExample && (env._exampleFilePaths as string[])?.length > 0 && !env._exampleOpened) {
          env._exampleOpened = true
          const paths = env._exampleFilePaths as string[]
          const defaultRender = defaultHeadingOpen
            ? defaultHeadingOpen(tokens, index, options, env, self)
            : self.renderToken(tokens, index, options)

          if (paths.length === 1) {
            return `<DocsExample file-path="${paths[0]}">\n<template #description>\n${defaultRender}`
          } else {
            const pathsJson = JSON.stringify(paths).replace(/"/g, '\'')
            return `<DocsExample :file-paths="${pathsJson}">\n<template #description>\n${defaultRender}`
          }
        }

        return defaultHeadingOpen
          ? defaultHeadingOpen(tokens, index, options, env, self)
          : self.renderToken(tokens, index, options)
      }

      // Transform ??? lines into DocsFaqItem components
      const defaultParagraphOpen = md.renderer.rules.paragraph_open
      const defaultParagraphClose = md.renderer.rules.paragraph_close

      md.renderer.rules.paragraph_open = (tokens, index, options, env, self) => {
        const inlineToken = tokens[index + 1]

        // Handle example container: lines starting with / are file paths
        // Multiple paths may be in one paragraph separated by newlines
        if (env._inExample && inlineToken?.type === 'inline' && inlineToken.content?.startsWith('/')) {
          const lines = inlineToken.content.split('\n')
          for (const line of lines) {
            const trimmed = line.trim()
            if (trimmed.startsWith('/') && trimmed.length > 1) {
              ;(env._exampleFilePaths as string[]).push(trimmed.slice(1))
            }
          }
          env._examplePathPara = true
          inlineToken.content = ''
          inlineToken.children = []
          return '' // Don't emit anything yet, wait for all paths
        }

        // Handle example container: first non-path content, emit opening tag
        if (env._inExample && (env._exampleFilePaths as string[]).length > 0 && !env._exampleOpened) {
          env._exampleOpened = true
          const paths = env._exampleFilePaths as string[]
          if (paths.length === 1) {
            return `<DocsExample file-path="${paths[0]}">\n<template #description>\n` + (defaultParagraphOpen ? defaultParagraphOpen(tokens, index, options, env, self) : '<p>')
          } else {
            const pathsJson = JSON.stringify(paths).replace(/"/g, '\'')
            return `<DocsExample :file-paths="${pathsJson}">\n<template #description>\n` + (defaultParagraphOpen ? defaultParagraphOpen(tokens, index, options, env, self) : '<p>')
          }
        }

        // Handle FAQ questions
        if (inlineToken?.type === 'inline' && inlineToken.content?.startsWith('??? ')) {
          const question = inlineToken.content.slice(4).trim()
          // Close previous FAQ item if one is open
          const closeTag = env._inFaqItem ? '</DocsFaqItem>\n' : ''
          env._inFaqItem = true
          env._faqQuestionPara = true
          inlineToken.content = ''
          inlineToken.children = []
          return `${closeTag}<DocsFaqItem question="${md.utils.escapeHtml(question)}">\n`
        }
        return defaultParagraphOpen
          ? defaultParagraphOpen(tokens, index, options, env, self)
          : '<p>'
      }

      md.renderer.rules.paragraph_close = (tokens, index, options, env, self) => {
        // Skip closing tag for example file path paragraph
        if (env._examplePathPara) {
          delete env._examplePathPara
          return ''
        }

        // Skip closing tag for FAQ question paragraph
        if (env._faqQuestionPara) {
          delete env._faqQuestionPara
          return ''
        }

        return defaultParagraphClose
          ? defaultParagraphClose(tokens, index, options, env, self)
          : '</p>'
      }

      // GitHub-style callouts: > [!TIP], > [!INFO], > [!WARNING], > [!ERROR], > [!ASKAI], > [!DISCORD], > [!TOUR]
      const defaultBlockquoteOpen = md.renderer.rules.blockquote_open
      const defaultBlockquoteClose = md.renderer.rules.blockquote_close

      md.renderer.rules.blockquote_open = (tokens, index, options, env, self) => {
        // Look ahead: blockquote_open -> paragraph_open -> inline
        const inlineToken = tokens[index + 2]
        if (inlineToken?.type === 'inline' && inlineToken.content) {
          const match = inlineToken.content.match(/^\[!(TIP|INFO|WARNING|ERROR|ASKAI|DISCORD|TOUR)\]\s*(.*)/)
          if (match) {
            const type = match[1].toLowerCase()
            env._calloutType = type

            if (type === 'askai') {
              // For ask callouts, the rest of the line is the question
              const question = match[2].trim()
              inlineToken.content = ''
              inlineToken.children = []
              return `<DocsCallout type="${type}" question="${Buffer.from(question).toString('base64')}">`
            }

            if (type === 'discord') {
              // Discord callouts have auto-generated content
              inlineToken.content = ''
              inlineToken.children = []
              return `<DocsCallout type="${type}">`
            }

            if (type === 'tour') {
              // For tour callouts, the rest of the line is the tour ID
              const tourId = match[2].trim()
              inlineToken.content = ''
              inlineToken.children = []
              return `<DocsCallout type="${type}" tour-id="${tourId}">`
            }

            // For other types, strip the marker and keep content
            const remainder = match[2]
            inlineToken.content = remainder

            // Also update the children array - find and update the first text token
            if (inlineToken.children?.length) {
              const firstChild = inlineToken.children[0]
              if (firstChild?.type === 'text') {
                // Only TIP|INFO|WARNING|ERROR reach here - ASKAI, DISCORD, TOUR return early with cleared content
                firstChild.content = firstChild.content.replace(/^\[!(TIP|INFO|WARNING|ERROR)\]\s*/, '')
              }
            }

            return `<DocsCallout type="${type}">`
          }
        }

        return defaultBlockquoteOpen
          ? defaultBlockquoteOpen(tokens, index, options, env, self)
          : '<blockquote>'
      }

      md.renderer.rules.blockquote_close = (tokens, index, options, env, self) => {
        if (env._calloutType) {
          delete env._calloutType
          return '</DocsCallout>'
        }

        return defaultBlockquoteClose
          ? defaultBlockquoteClose(tokens, index, options, env, self)
          : '</blockquote>'
      }

      // Inline code: mark Vue API references for hover popovers
      const defaultCodeInline = md.renderer.rules.code_inline
      md.renderer.rules.code_inline = (tokens, index, options, env, self) => {
        const token = tokens[index]
        const content = token.content

        // Check if content is a Vue API
        const vueCode = renderVueApiInlineCode(content, md.utils.escapeHtml)
        if (vueCode) return vueCode

        // Default rendering for non-Vue inline code
        return defaultCodeInline
          ? defaultCodeInline(tokens, index, options, env, self)
          : `<code>${md.utils.escapeHtml(content)}</code>`
      }

      md.use(
        fromHighlighter(highlighter as HighlighterGeneric<BundledLanguage, BundledTheme>, {
          themes: SHIKI_THEMES,
          defaultColor: false,
          transformers: [createApiTransformer()],
        }),
      )

      // Wrap code blocks with DocsMarkup component
      const defaultFence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, index, options, env, self) => {
        const token = tokens[index]
        const code = token.content.trim()
        // Parse fence info - can be "lang", "lang playground", or "lang filename"
        const info = token.info?.trim() || ''
        const [lang, ...rest] = info.split(/\s+/)

        const encodedCode = Buffer.from(code).toString('base64')

        if (lang === 'mermaid') {
          // Parse quoted caption: ```mermaid "Caption text"
          const captionMatch = info.match(/^mermaid\s+"([^"]+)"/)
          const caption = captionMatch?.[1]
          const captionAttr = caption ? ` caption="${Buffer.from(caption).toString('base64')}"` : ''
          return `<DocsMermaid code="${encodedCode}"${captionAttr} />`
        }

        const playgroundIndex = rest.indexOf('playground')
        const playground = playgroundIndex !== -1
        if (playground) rest.splice(playgroundIndex, 1)

        // Parse bin title modifier: bin:"Custom Title"
        const binTitleMatch = info.match(/bin:"([^"]+)"/)
        const binTitle = binTitleMatch?.[1]
        if (binTitleMatch) {
          // Remove the bin:"..." from rest array
          const binTitleIndex = rest.findIndex(r => r.startsWith('bin:"') || r === binTitleMatch[0])
          if (binTitleIndex !== -1) {
            // The quoted string may have been split across multiple array items, rebuild and remove
            let toRemove = 0
            let combined = ''
            for (let i = binTitleIndex; i < rest.length; i++) {
              combined += (combined ? ' ' : '') + rest[i]
              toRemove++
              if (combined.includes('"') && combined.lastIndexOf('"') > combined.indexOf('"')) break
            }
            rest.splice(binTitleIndex, toRemove)
          }
        }

        // Parse collapse modifier: "collapse" or "collapse:15"
        const collapseIndex = rest.findIndex(r => r === 'collapse' || r.startsWith('collapse:'))
        let collapse = false
        let collapseLines: number | undefined
        if (collapseIndex !== -1) {
          const collapseToken = rest[collapseIndex]
          collapse = true
          if (collapseToken.includes(':')) {
            const parsed = Number.parseInt(collapseToken.split(':')[1])
            if (!Number.isNaN(parsed) && parsed > 0) {
              collapseLines = parsed
            }
          }
          rest.splice(collapseIndex, 1)
        }

        // Parse no-filename modifier to hide the filename/language label
        const noFilenameIndex = rest.indexOf('no-filename')
        const hideFilename = noFilenameIndex !== -1
        if (hideFilename) rest.splice(noFilenameIndex, 1)

        const title = rest.join(' ')
        const highlighted = defaultFence(tokens, index, options, env, self)
        // Base64 encode to avoid escaping issues
        const titleAttr = title ? ` title="${title}"` : ''
        const binTitleAttr = binTitle ? ` bin-title="${binTitle}"` : ''
        const playgroundAttr = playground ? ' playground' : ''
        const collapseAttr = collapse ? ' collapse' : ''
        const collapseLinesAttr = collapseLines ? ` :collapse-lines="${collapseLines}"` : ''
        const hideFilenameAttr = hideFilename ? ' hide-filename' : ''
        return `<DocsMarkup code="${encodedCode}" language="${lang || 'text'}"${titleAttr}${binTitleAttr}${playgroundAttr}${collapseAttr}${collapseLinesAttr}${hideFilenameAttr}>${highlighted}</DocsMarkup>`
      }
      // Wrap tables in scrollable container for mobile
      md.renderer.rules.table_open = () => '<div class="overflow-x-auto mb-4"><table>'
      md.renderer.rules.table_close = () => '</table></div>'

      md.renderer.rules.link_open = (tokens, index, options, env, self) => {
        const t = tokens[index]
        const classes = t.attrGet('class') || ''
        const isHeaderAnchor = /\bheader-anchor\b/.test(classes)

        // Don't add v0-link class to header anchors
        if (!isHeaderAnchor) {
          const ci = t.attrIndex('class')
          if (ci < 0) t.attrPush(['class', 'v0-link'])
          else if (t.attrs && !/\bv0-link\b/.test(t.attrs[ci][1])) t.attrs[ci][1] += ' v0-link'
        }

        const href = t.attrGet('href') || ''
        if (/^https?:\/\//i.test(href)) {
          t.attrSet('target', '_blank')
          t.attrSet('rel', 'noopener noreferrer')
          t.attrSet('data-sfx', EXTERNAL_LINK_SUFFIX)
        }
        return self.renderToken(tokens, index, options)
      }
      md.renderer.rules.link_close = (tokens, index, options, env, self) => {
        for (let i = index - 1; i >= 0; i--) {
          const open = tokens[i]
          if (open.type === 'link_open') {
            const sfx = open.attrGet && open.attrGet('data-sfx')
            const close = self.renderToken(tokens, index, options)
            return (sfx || '') + close
          }
        }
        return self.renderToken(tokens, index, options)
      }
    },
  })
}

export type MarkdownPluginFactory = typeof MarkdownPlugin
