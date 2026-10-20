// Framework
import { isString } from '@vuetify/v0/utilities'

const MCP = 'https://mcp.vuetifyjs.com/mcp'

export type CodingCli = 'claude' | 'grok' | 'codex' | 'gemini'

interface CodingCliSpec {
  /** Settings label. */
  name: string
  /** Command binary. Also the label on the command chip. */
  bin: string
  /** Arguments after the binary. */
  args: string
}

/**
 * Coding CLIs that can install the hosted Vuetify MCP server in one command.
 * Order is the picker order.
 */
export const CODING_CLIS: Record<CodingCli, CodingCliSpec> = {
  grok: {
    name: 'Grok',
    bin: 'grok',
    args: `mcp add --transport http vuetify-mcp ${MCP}`,
  },
  claude: {
    name: 'Claude',
    bin: 'claude',
    args: `mcp add --transport http vuetify-mcp ${MCP}`,
  },
  codex: {
    name: 'Codex',
    bin: 'codex',
    args: `mcp add vuetify-mcp --url ${MCP}`,
  },
  gemini: {
    name: 'Gemini',
    bin: 'gemini',
    args: `mcp add --transport http vuetify-mcp ${MCP}`,
  },
}

export const CODING_CLI_IDS: CodingCli[] = ['grok', 'claude', 'codex', 'gemini']

/** Fence titles that mean the same CLI. Keys are lowercase. */
const ALIASES: Record<string, CodingCli> = {
  'claude': 'claude',
  'claude code': 'claude',
  'grok': 'grok',
  'grok build': 'grok',
  'codex': 'codex',
  'gemini': 'gemini',
  'gemini cli': 'gemini',
}

export function isCodingCli (value: unknown): value is CodingCli {
  return isString(value) && CODING_CLI_IDS.includes(value)
}

export function codingCliOf (label: string): CodingCli | undefined {
  return ALIASES[label.toLowerCase()]
}

export function codingCliCommand (id: CodingCli): string {
  const cli = CODING_CLIS[id]
  return `${cli.bin} ${cli.args}`
}
