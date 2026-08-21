import { copyFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { glob } from 'node:fs/promises'
import { dirname, join, relative } from 'node:path'

// Types
import type { Plugin } from 'vite'

export default function copyMarkdownPlugin (): Plugin {
  return {
    name: 'copy-markdown',
    apply: (config, { command }) => command === 'build' && !config.build?.ssr,
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
      const skillBase = '../../skills/vuetify0'
      const skillSrc = join(skillBase, 'SKILL.md')
      const refsDir = join(skillBase, 'references')
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
