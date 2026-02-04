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

      // Copy SKILL.md from skills/vuetify0 to dist root
      const skillSrc = '../../skills/vuetify0/SKILL.md'
      const skillDest = join(outDir, 'SKILL.md')
      if (existsSync(skillSrc)) {
        copyFileSync(skillSrc, skillDest)
        console.log(`[copy-markdown] Copied ${files.length} markdown files + SKILL.md`)
      } else {
        console.log(`[copy-markdown] Copied ${files.length} markdown files (SKILL.md not found)`)
      }
    },
  }
}
