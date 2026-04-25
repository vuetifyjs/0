import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parentPort } from 'node:worker_threads'

import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'

interface WorkerJob {
  id: number
  title: string
  description: string
  category?: string
}

interface WorkerResponse {
  id: number
  png?: Uint8Array
  error?: string
}

const __dirname = dirname(fileURLToPath(import.meta.url))

function load (path: string): ArrayBuffer {
  const buffer = readFileSync(path)
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
}

const logo = `data:image/png;base64,${readFileSync(resolve(__dirname, 'fonts/vuetify0-logo.png')).toString('base64')}`
const icon = `data:image/png;base64,${readFileSync(resolve(__dirname, 'fonts/vzero-icon-white.png')).toString('base64')}`

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

function template (title: string, description: string, category?: string) {
  return {
    type: 'div',
    props: {
      style: {
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundImage: [
          'radial-gradient(at 40% 20%, rgba(124, 92, 246, 0.4) 0px, transparent 70%)',
          'radial-gradient(at 90% -10%, rgba(24, 103, 192, 0.35) 0px, transparent 70%)',
          'radial-gradient(at -10% 60%, rgba(239, 68, 68, 0.25) 0px, transparent 70%)',
          'radial-gradient(at 90% 60%, rgba(34, 197, 94, 0.3) 0px, transparent 70%)',
          'radial-gradient(at 20% 110%, rgba(245, 158, 11, 0.2) 0px, transparent 70%)',
        ].join(', '),
        backgroundColor: '#121212',
        color: 'white',
        fontFamily: 'Inter',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              position: 'absolute',
              top: '80px',
              right: '40px',
              opacity: 0.08,
            },
            children: [{
              type: 'img',
              props: {
                src: icon,
                width: 345,
                height: 300,
                style: {},
              },
            }],
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              flex: '1',
              padding: '60px',
              backgroundImage: 'radial-gradient(ellipse at 0% 0%, rgba(24, 103, 192, 0.15) 0%, transparent 60%)',
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
                          fontSize: '76px',
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
                              fontSize: '34px',
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
        },
      ],
    },
  }
}

async function render (title: string, description: string, category?: string): Promise<Buffer> {
  const svg = await satori(template(title, description, category) as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts,
  })

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  })

  return resvg.render().asPng()
}

parentPort!.on('message', async (job: WorkerJob) => {
  const response: WorkerResponse = { id: job.id }
  try {
    response.png = await render(job.title, job.description, job.category)
  } catch (error) {
    response.error = error instanceof Error ? error.message : String(error)
  }
  parentPort!.postMessage(response)
})
