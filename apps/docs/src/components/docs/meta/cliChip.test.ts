import { describe, expect, it } from 'vitest'

// Utilities
import { cliChip } from './cliChip'

// Types
import type { RegistryChipItem } from './cliChip'

function item (over: Partial<RegistryChipItem> = {}): RegistryChipItem {
  return {
    name: 'dialog',
    path: '/components/disclosure/dialog',
    category: 'disclosure',
    exampleIds: ['basic'],
    ...over,
  }
}

describe('cliChip', () => {
  it('should build the pnpm command', () => {
    expect(cliChip(item(), 'pnpm').command).toBe('pnpm dlx @vuetify/cli add dialog')
  })

  it('should build the npm command', () => {
    expect(cliChip(item(), 'npm').command).toBe('npx @vuetify/cli add dialog')
  })

  it('should build the yarn command', () => {
    expect(cliChip(item(), 'yarn').command).toBe('yarn dlx @vuetify/cli add dialog')
  })

  it('should build the bun command', () => {
    expect(cliChip(item(), 'bun').command).toBe('bunx @vuetify/cli add dialog')
  })

  it('should describe a single example as a seed', () => {
    const { tooltip } = cliChip(item(), 'pnpm')
    expect(tooltip).toBe('pnpm dlx @vuetify/cli add dialog. Seeds a working example into your project.')
  })

  it('should say the CLI asks when several examples exist', () => {
    const { tooltip, command } = cliChip(item({
      name: 'create-data-table',
      exampleIds: ['basic', 'features'],
    }), 'pnpm')
    expect(command).toBe('pnpm dlx @vuetify/cli add create-data-table')
    expect(tooltip).toBe(
      'pnpm dlx @vuetify/cli add create-data-table. Seeds a working example into your project. The CLI asks which one.',
    )
    expect(command).not.toContain('--example')
  })

  it('should describe a plugin with no examples as wiring the factory', () => {
    const { tooltip } = cliChip(item({
      name: 'use-theme',
      path: '/composables/plugins/use-theme',
      category: 'plugins',
      exampleIds: [],
      install: { factory: 'createThemePlugin' },
    }), 'pnpm')
    expect(tooltip).toBe('pnpm dlx @vuetify/cli add use-theme. Wires createThemePlugin into your app.')
  })

  it('should mention the usage-example prompt when a plugin has examples', () => {
    const { tooltip } = cliChip(item({
      name: 'use-theme',
      exampleIds: ['basic'],
      install: { factory: 'createThemePlugin' },
    }), 'npm')
    expect(tooltip).toBe(
      'npx @vuetify/cli add use-theme. Wires createThemePlugin into your app. The CLI asks before copying a usage example.',
    )
  })

  it('should use the seed tooltip when a plugin has no install recipe', () => {
    const { tooltip } = cliChip(item({
      name: 'use-theme',
      category: 'plugins',
      exampleIds: ['basic'],
    }), 'pnpm')
    expect(tooltip).toBe('pnpm dlx @vuetify/cli add use-theme. Seeds a working example into your project.')
  })
})
