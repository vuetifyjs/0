import { copyFileSync, existsSync, mkdirSync } from 'node:fs'
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

      // Copy SKILL.md and references from skills/vuetify0 to dist root
      const skillBase = '../../skills/vuetify0'
      const skillSrc = join(skillBase, 'SKILL.md')
      const refSrc = join(skillBase, 'references/REFERENCE.md')
      const skillDest = join(outDir, 'SKILL.md')
      const refDest = join(outDir, 'references/REFERENCE.md')
      if (existsSync(skillSrc)) {
        copyFileSync(skillSrc, skillDest)
        if (existsSync(refSrc)) {
          mkdirSync(join(outDir, 'references'), { recursive: true })
          copyFileSync(refSrc, refDest)
        }
        console.log(`[copy-markdown] Copied ${files.length} markdown files + SKILL.md`)
      } else {
        console.log(`[copy-markdown] Copied ${files.length} markdown files (SKILL.md not found)`)
      }
    },
  }
}
