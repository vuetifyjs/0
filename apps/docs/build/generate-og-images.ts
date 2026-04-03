import { readFileSync } from 'node:fs'
import { glob, mkdir, writeFile } from 'node:fs/promises'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

import { getApiNamesGrouped } from './api-names'
import { parseFrontmatter } from './frontmatter'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PAGES_DIR = resolve(__dirname, '../src/pages')
const DIST_DIR = resolve(__dirname, '../dist')

function load (path: string): ArrayBuffer {
  const buffer = readFileSync(path)
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

const logo = `data:image/png;base64,${readFileSync(resolve(__dirname, 'fonts/vuetify0-logo.png')).toString('base64')}`

const fonts = [
  {
    name: 'Inter',
    data: load(resolve(__dirname, 'fonts/Inter-Regular.ttf')),
    weight: 400 as const,
    style: 'normal' as const,
  },
  {
    name: 'Inter',
    data: load(resolve(__dirname, 'fonts/Inter-Bold.ttf')),
    weight: 700 as const,
    style: 'normal' as const,
  },
]

function getPath (file: string): string {
  return '/' + relative(PAGES_DIR, file)
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
    .replace(/^index$/, '')
}

function cleanTitle (raw: string): string {
  // Strip " - description suffix" from titles like "Dialog - Accessible modal dialogs"
  return raw.includes(' - ') ? raw.split(' - ')[0] : raw
}

function template (title: string, description: string, category?: string) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '60px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white',
        fontFamily: 'Inter',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '40px',
            },
            children: [
              {
                type: 'img',
                props: {
                  src: logo,
                  width: 260,
                  height: 84,
                  style: {},
                },
              },
              ...(category
                ? [{
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '22px',
                        color: 'rgba(255, 255, 255, 0.4)',
                        marginLeft: '4px',
                      },
                      children: `/ ${category}`,
                    },
                  }]
                : []),
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: '1',
              justifyContent: 'center',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: '56px',
                    fontWeight: 700,
                    lineHeight: '1.2',
                    marginBottom: '24px',
                    color: 'white',
                  },
                  children: title,
                },
              },
              ...(description
                ? [{
                    type: 'div',
                    props: {
                      style: {
                        fontSize: '26px',
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: '1.5',
                      },
                      children: description,
                    },
                  }]
                : []),
            ],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              fontSize: '22px',
              color: 'rgba(255, 255, 255, 0.5)',
            },
            children: '0.vuetifyjs.com',
          },
        },
      ],
    },
  }
}

async function render (title: string, description: string, category?: string): Promise<Buffer> {
  const svg = await satori(template(title, description, category) as any, {
    width: 1200,
    height: 630,
    fonts,
  })

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  })

  return resvg.render().asPng()
}

export async function generateOgImages (): Promise<void> {
  const start = performance.now()
  let count = 0

  const files: Array<{ path: string, title: string, description: string, category?: string }> = [{
    path: '/',
    title: 'The AI-native headless framework for Vue',
    description: '',
  }]

  // Generate for markdown pages
  for await (const file of glob(`${PAGES_DIR}/**/*.md`)) {
    const raw = readFileSync(file, 'utf8')
    const { frontmatter } = parseFrontmatter(raw)

    if (!frontmatter.title) continue

    files.push({
      path: getPath(file),
      title: cleanTitle(frontmatter.title),
      description: frontmatter.description ?? '',
      category: frontmatter.features?.category,
    })
  }

  // Generate for API pages
  const grouped = await getApiNamesGrouped()
  for (const info of grouped.components) {
    files.push({
      path: `/api/${info.slug}`,
      title: `${info.name} API`,
      description: `API reference for the ${info.name} component.`,
      category: 'API Reference',
    })
  }
  for (const info of grouped.composables) {
    files.push({
      path: `/api/${info.slug}`,
      title: `${info.name} API`,
      description: `API reference for the ${info.name} composable.`,
      category: 'API Reference',
    })
  }

  // Render in batches of 20 for concurrency
  const batch = 20
  for (let i = 0; i < files.length; i += batch) {
    const chunk = files.slice(i, i + batch)
    await Promise.all(chunk.map(async ({ path, title, description, category }) => {
      const png = await render(title, description, category)
      const outPath = path === '' || path === '/' ? '/index' : path
      const outFile = resolve(DIST_DIR, `og${outPath}.png`)
      await mkdir(dirname(outFile), { recursive: true })
      await writeFile(outFile, png)
      count++
    }))
  }

  const elapsed = ((performance.now() - start) / 1000).toFixed(1)
  console.log(`[og-images] Generated ${count} images in ${elapsed}s`)
}
