import { createReadStream, copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { glob } from 'node:fs/promises'
import { basename, dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

// Types
import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)))
const PAGES_DIR = join(ROOT, 'src/pages')
const SKILL_DIR = resolve(ROOT, '../../skills/vuetify0')

function resolveMarkdown (urlPath: string): string | undefined {
  const url = (urlPath.split('?')[0] ?? '').replace(/\/+$/, '') || '/'
  if (!url.endsWith('.md')) return undefined
  if (url.includes('..')) return undefined

  if (url === '/SKILL.md') return join(SKILL_DIR, 'SKILL.md')
  if (url === '/REFERENCE.md') return join(SKILL_DIR, 'references', 'REFERENCE.md')

  if (url.startsWith('/references/')) {
    const name = basename(url)
    if (name !== url.slice('/references/'.length)) return undefined
    return join(SKILL_DIR, 'references', name)
  }

  return join(PAGES_DIR, url.slice(1))
}

function sendMarkdown (file: string, res: ServerResponse, next: (err?: unknown) => void) {
  if (!existsSync(file)) return next()
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
  createReadStream(file).pipe(res)
}

export default function copyMarkdownPlugin (): Plugin {
  return {
    name: 'copy-markdown',
    configureServer (server) {
      server.middlewares.use((req: IncomingMessage, res: ServerResponse, next) => {
        const file = resolveMarkdown(req.url ?? '')
        if (!file) return next()
        sendMarkdown(file, res, next)
      })
    },
    apply: (config, { command }) => command === 'serve' || (command === 'build' && !config.build?.ssr),
    async writeBundle (options) {
      const outDir = options.dir || 'dist'
      const files: string[] = []

      for await (const file of glob('src/pages/**/*.md')) {
        files.push(file)
        const relativePath = relative('src/pages', file)
        const destPath = join(outDir, relativePath)
        mkdirSync(dirname(destPath), { recursive: true })
        copyFileSync(file, destPath)
      }

      // Copy SKILL.md and every reference it links from skills/vuetify0.
      // REFERENCE.md is also aliased at dist root so /REFERENCE.md matches /SKILL.md.
      // A partial copy ships a skill with dead relative links.
      const skillSrc = join(SKILL_DIR, 'SKILL.md')
      const refsDir = join(SKILL_DIR, 'references')
      const skillDest = join(outDir, 'SKILL.md')
      if (existsSync(skillSrc)) {
        copyFileSync(skillSrc, skillDest)
        if (existsSync(refsDir)) {
          mkdirSync(join(outDir, 'references'), { recursive: true })
          for (const ref of readdirSync(refsDir)) {
            if (!ref.endsWith('.md')) continue
            copyFileSync(join(refsDir, ref), join(outDir, 'references', ref))
            // Agents fetch /REFERENCE.md as a sibling of /SKILL.md
            if (ref === 'REFERENCE.md') {
              copyFileSync(join(refsDir, ref), join(outDir, 'REFERENCE.md'))
            }
          }
        }
        console.log(`[copy-markdown] Copied ${files.length} markdown files + SKILL.md + REFERENCE.md`)
      } else {
        console.log(`[copy-markdown] Copied ${files.length} markdown files (SKILL.md not found)`)
      }
    },
  }
}
