import { describe, expect, it } from 'vitest'

// Components
import { binFileExt } from '@/components/playground/open/types'

import { isCreatableFile } from './creatable-files'

/** Vuetify Bin's language picker. */
const BIN = [
  'vue',
  'javascript',
  'typescript',
  'css',
  'json',
  'html',
  'markdown',
  'sass',
  'shell',
  'python',
  'php',
  'yaml',
  'xml',
  'sql',
  'go',
  'rust',
  'java',
  'cpp',
  'text',
]

describe('isCreatableFile', () => {
  it('should accept every language Vuetify Bin can select', () => {
    for (const language of BIN) {
      expect(isCreatableFile(`src/file.${binFileExt(language)}`)).toBe(true)
    }
  })

  it('should accept close spellings of those languages', () => {
    expect(isCreatableFile('src/App.jsx')).toBe(true)
    expect(isCreatableFile('src/App.tsx')).toBe(true)
    expect(isCreatableFile('page.htm')).toBe(true)
    expect(isCreatableFile('readme.markdown')).toBe(true)
    expect(isCreatableFile('config.yml')).toBe(true)
    expect(isCreatableFile('run.bash')).toBe(true)
    expect(isCreatableFile('run.shell')).toBe(true)
    expect(isCreatableFile('run.zsh')).toBe(true)
    expect(isCreatableFile('style.scss')).toBe(true)
    expect(isCreatableFile('plain.text')).toBe(true)
    expect(isCreatableFile('src/file.test.py')).toBe(true)
    expect(isCreatableFile('NOTES.MD')).toBe(true)
  })

  it('should reject types Bin does not offer', () => {
    expect(isCreatableFile('photo.png')).toBe(false)
    expect(isCreatableFile('doc.pdf')).toBe(false)
    expect(isCreatableFile('archive.zip')).toBe(false)
    expect(isCreatableFile('Dockerfile')).toBe(false)
    expect(isCreatableFile('.gitignore')).toBe(false)
    expect(isCreatableFile('src/notes')).toBe(false)
  })
})
