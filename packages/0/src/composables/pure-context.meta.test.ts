/// <reference types="node" />
/**
 * Meta-test: every module-level `createContext()` and `createPluginContext()`
 * under `packages/0/src` must be marked @__PURE__.
 *
 * Rolldown (Vite 8) keeps an unannotated top-level `const [a, b] = fn()` and
 * everything `fn` reaches. One miss in a shared dist chunk retains
 * `import * as Vue from 'vue'` (`utilities/instance.ts`) and, on Vue 3.6, the
 * Vapor runtime. esbuild does not drop the destructure either way, so
 * `pnpm size` stays green if the marker is forgotten. This scan is the lock.
 *
 * Calls inside functions are exempt. Vue `<script setup>` is compiled into
 * setup(), so it is exempt too. Only the non-setup `<script>` is module scope.
 */
import * as fs from 'node:fs'
import * as path from 'node:path'

import * as ts from 'typescript'
import { describe, expect, it } from 'vitest'

const SRC = path.resolve(import.meta.dirname, '../..')

const FACTORIES = new Set(['createContext', 'createPluginContext'])

const PURE = /\/\*\s*@__PURE__\s*\*\/\s*$/

interface PureHit {
  file: string
  line: number
  name: string
}

function isInsideFunction (node: ts.Node): boolean {
  let parent = node.parent
  while (parent) {
    if (ts.isFunctionLike(parent)) return true
    parent = parent.parent
  }
  return false
}

function calleeName (expression: ts.Expression): string | undefined {
  if (!ts.isIdentifier(expression)) return undefined
  return expression.text
}

function hasPureAnnotation (text: string, position: number): boolean {
  const start = Math.max(0, position - 48)
  return PURE.test(text.slice(start, position))
}

function findInScript (source: string, file: string, lineOffset: number): PureHit[] {
  const script = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const hits: PureHit[] = []

  function visit (node: ts.Node) {
    if (ts.isCallExpression(node) && !isInsideFunction(node)) {
      const name = calleeName(node.expression)
      if (name && FACTORIES.has(name)) {
        const position = node.expression.getStart(script, false)
        if (!hasPureAnnotation(source, position)) {
          const { line } = script.getLineAndCharacterOfPosition(position)
          hits.push({ file, line: line + 1 + lineOffset, name })
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(script)
  return hits
}

function findInVue (source: string, file: string): PureHit[] {
  const hits: PureHit[] = []
  const pattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/g

  for (const match of source.matchAll(pattern)) {
    const attrs = match[1] ?? ''
    if (/\bsetup\b/.test(attrs)) continue

    const openEnd = match[0].indexOf('>') + 1
    const body = source.slice((match.index ?? 0) + openEnd, (match.index ?? 0) + match[0].length - '</script>'.length)
    const lineOffset = source.slice(0, (match.index ?? 0) + openEnd).split('\n').length - 1
    hits.push(...findInScript(body, file, lineOffset))
  }

  return hits
}

function findUnannotated (source: string, file: string): PureHit[] {
  if (file.endsWith('.vue')) return findInVue(source, file)
  return findInScript(source, file, 0)
}

function isSkippedFile (name: string): boolean {
  return name.endsWith('.test.ts')
    || name.endsWith('.bench.ts')
    || name.endsWith('.d.ts')
}

function collectSources (dir: string, out: string[]) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      collectSources(full, out)
      continue
    }
    if (!entry.isFile() || isSkippedFile(entry.name)) continue
    if (entry.name.endsWith('.ts') || entry.name.endsWith('.vue')) out.push(full)
  }
}

function scanPackage (): PureHit[] {
  const files: string[] = []
  collectSources(SRC, files)
  const hits: PureHit[] = []

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8')
    const relative = path.relative(SRC, file)
    for (const hit of findUnannotated(source, file)) {
      hits.push({ ...hit, file: relative })
    }
  }

  return hits
}

describe('module-level context purity', () => {
  it('should flag an unannotated module-level createContext call', () => {
    const hits = findUnannotated(
      'export const [useFoo, provideFoo] = createContext<Foo>()\n',
      'fixture.ts',
    )

    expect(hits.map(hit => hit.name)).toEqual(['createContext'])
    expect(hits[0]?.line).toBe(1)
  })

  it('should allow an annotated module-level call', () => {
    const source = 'export const [useFoo, provideFoo] = /* @__PURE__ */ createContext<Foo>()\n'
    expect(findUnannotated(source, 'fixture.ts')).toEqual([])
  })

  it('should allow a multiline annotated createPluginContext call', () => {
    const source = [
      'export const [createFooContext, createFooPlugin, useFoo] =',
      '  /* @__PURE__ */ createPluginContext<FooOptions, FooContext>(',
      '    \'v0:foo\',',
      '    options => options,',
      '  )',
      '',
    ].join('\n')

    expect(findUnannotated(source, 'fixture.ts')).toEqual([])
  })

  it('should allow a call inside a function', () => {
    const source = [
      'export function createFoo () {',
      '  const [useFoo, provideFoo] = createContext()',
      '  return [useFoo, provideFoo]',
      '}',
      '',
    ].join('\n')

    expect(findUnannotated(source, 'fixture.ts')).toEqual([])
  })

  it('should ignore a call that appears only in a comment', () => {
    const source = [
      '/**',
      ' * const [useFoo, provideFoo] = createContext(\'v0:foo\')',
      ' */',
      'export function createFoo () {}',
      '',
    ].join('\n')

    expect(findUnannotated(source, 'fixture.ts')).toEqual([])
  })

  it('should ignore a script-setup call and flag a module script call', () => {
    const source = [
      '<script setup lang="ts">',
      'const [useLocal, provideLocal] = createContext()',
      '</script>',
      '',
      '<script lang="ts">',
      'export const [useFoo, provideFoo] = createContext<Foo>()',
      '</script>',
      '',
    ].join('\n')

    const hits = findUnannotated(source, 'Fixture.vue')

    expect(hits).toHaveLength(1)
    expect(hits[0]?.name).toBe('createContext')
    expect(hits[0]?.line).toBe(6)
  })

  it('should find no unannotated module-level context factory in packages/0/src', () => {
    const hits = scanPackage()

    expect(hits.map(hit => `${hit.file}:${hit.line} ${hit.name}`)).toEqual([])
  })
})
