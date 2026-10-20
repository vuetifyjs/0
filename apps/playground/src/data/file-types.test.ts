import { describe, expect, it } from 'vitest'

// Local
import { context } from '@/plugins/icons'

import { FILE_TYPE_ICONS, FILE_TYPES, fileType } from './file-types'

const BUILTIN = new Set(['lang-vue', 'lang-js', 'lang-ts', 'lang-css', 'lang-json'])

function known (icon: string) {
  return BUILTIN.has(icon) || icon in FILE_TYPE_ICONS
}

describe('fileType', () => {
  it('should cover at least 50 extensions', () => {
    expect(Object.keys(FILE_TYPES).length).toBeGreaterThanOrEqual(50)
  })

  it('should keep the colors the tree already used', () => {
    expect(fileType('src/App.vue')).toEqual({ icon: 'lang-vue', color: '#4FC08D' })
    expect(fileType('src/main.ts')).toEqual({ icon: 'lang-ts', color: '#3179c7' })
    expect(fileType('src/Widget.tsx')).toEqual({ icon: 'lang-ts', color: '#3179c7' })
    expect(fileType('src/app.js')).toEqual({ icon: 'lang-js', color: '#d3b62a' })
    expect(fileType('src/app.jsx')).toEqual({ icon: 'lang-js', color: '#d3b62a' })
    expect(fileType('src/style.css')).toEqual({ icon: 'lang-css', color: '#1572B6' })
    expect(fileType('import-map.json')).toEqual({ icon: 'lang-json', color: '#a57b39' })
  })

  it('should map languages, media, and dotfiles', () => {
    expect(fileType('src/notes.md')?.icon).toBe('lang-md')
    expect(fileType('src/app.py')?.icon).toBe('lang-py')
    expect(fileType('src/index.html')?.icon).toBe('lang-html')
    expect(fileType('config.yml')?.icon).toBe('file-code')
    expect(fileType('script.sh')?.icon).toBe('lang-sh')
    expect(fileType('Dockerfile')?.icon).toBe('lang-docker')
    expect(fileType('.env.local')?.icon).toBe('file-settings')
    expect(fileType('.gitignore')?.icon).toBe('lang-git')
    expect(fileType('src/archive.tar.gz')?.icon).toBe('file-archive')
    expect(fileType('src/file.test.ts')?.icon).toBe('lang-ts')
    expect(fileType('LICENSE')).toEqual({ icon: 'file-license', color: '#6D8086' })
  })

  it('should leave unknown types unset', () => {
    expect(fileType('src/notes.zzz')).toBeUndefined()
    expect(fileType('')).toBeUndefined()
  })

  it('should register every mapped icon', () => {
    for (const type of Object.values(FILE_TYPES)) {
      expect(known(type.icon)).toBe(true)
      expect(context.resolve(type.icon)).toEqual(expect.any(String))
    }
    expect(context.resolve('lang-md')).toBe(FILE_TYPE_ICONS['lang-md'])
    expect(context.resolve('lang-vue')).toEqual(expect.any(String))
  })
})
