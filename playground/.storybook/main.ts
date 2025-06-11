import type { StorybookConfig } from '@storybook/vue3-vite'
import unocss from 'unocss/vite'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
  async viteFinal (config) {
    config.plugins?.push(unocss())
    return config
  },
}
export default config
