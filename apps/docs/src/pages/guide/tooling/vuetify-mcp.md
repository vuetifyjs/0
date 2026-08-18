---
title: Vuetify MCP - AI Assistant Integration
features:
  label: Vuetify MCP
  order: 3
  level: 1
meta:
  - name: description
    content: Connect Claude, Cursor, and other AI assistants to Vuetify 3/4 and v0 APIs, install and upgrade docs, plus Vuetify One bins, playgrounds, and links.
  - name: keywords
    content: MCP, Model Context Protocol, Claude, Cursor, Grok, Codex, Kimi, AI assistant, Vuetify API, Vuetify One, OAuth, bins, playgrounds, developer tools
related:
  - /guide/tooling/ai-tools
  - /guide/tooling/vuetify-cli
  - /introduction/getting-started
logo: vmcp
---

# Vuetify MCP

Vuetify MCP is a [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) server that gives AI assistants structured access to Vuetify 3/4 and v0 APIs, install/upgrade/breaking-change docs, and — with [Vuetify One](https://one.vuetifyjs.com) — bins, playgrounds, and links. Unlike [llms.txt](/guide/tooling/ai-tools), MCP is real-time and queryable.

The hosted server is [https://mcp.vuetifyjs.com/mcp](https://mcp.vuetifyjs.com/mcp) (streamable HTTP). Documentation and API tools need no account; bins, playgrounds, and links prompt Vuetify One OAuth.

<DocsPageFeatures :frontmatter />

## Quick Start

### Interactive Setup (Recommended)

Auto-detects your IDE and configures the hosted MCP server automatically:

::: code-group no-filename

```bash pnpm
pnpm dlx @vuetify/mcp config --remote
```

```bash npm
npx -y @vuetify/mcp config --remote
```

```bash yarn
yarn dlx @vuetify/mcp config --remote
```

```bash bun
bunx @vuetify/mcp config --remote
```

:::

### Cursor

[Cursor](https://cursor.com/docs/mcp.md) is an AI IDE. Add the hosted server from **Customize → MCPs** in the sidebar, or write it to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "vuetify-mcp": {
      "url": "https://mcp.vuetifyjs.com/mcp"
    }
  }
}
```

You can also load the plugin from [vuetifyjs/mcp](https://github.com/vuetifyjs/mcp).

### Claude Code

[Claude Code](https://code.claude.com/docs/en/overview) is Anthropic's agentic coding tool. Add the hosted MCP server directly via CLI:

```bash
claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

### Grok / Grok Build

[Grok](https://docs.x.ai/grok/connectors) users add a BYO Custom connector. There is no official Grok catalog listing. This is grok.com + the Grok Build CLI, not [Grok Bot](/guide/tooling/agents).

1. Go to [https://grok.com/connectors](https://grok.com/connectors)
2. Click **New Connector**, then select **Custom**
3. Enter the MCP server URL `https://mcp.vuetifyjs.com/mcp` (streamable HTTP) and complete any required authentication

Documentation and API tools are public; bins, playgrounds, and links prompt Vuetify One OAuth on demand. Do not paste an API key.

Grok Build / CLI:

```bash
grok mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

Or edit `~/.grok/config.toml` (user) or `.grok/config.toml` (project):

```toml
[mcp_servers.vuetify-mcp]
url = "https://mcp.vuetifyjs.com/mcp"
```

### Codex

[OpenAI Codex](https://developers.openai.com/codex/mcp) CLI, ChatGPT desktop, and the IDE extension share `~/.codex/config.toml` (project: `.codex/config.toml`, trusted projects only):

```toml
[mcp_servers.vuetify-mcp]
url = "https://mcp.vuetifyjs.com/mcp"
```

Or in ChatGPT / the IDE: **Settings → MCP servers → Add server → Streamable HTTP** and the URL above.

Documentation and API tools need no login. When One tools are used, Codex can prompt `codex mcp login vuetify-mcp`.

### Kimi CLI

[Kimi Code](https://www.kimi.com/code/docs/en/kimi-code-cli/customization/mcp.html) reads `~/.kimi-code/mcp.json` (or `$KIMI_CODE_HOME/mcp.json`) and `.kimi-code/mcp.json` (project):

```json
{
  "mcpServers": {
    "vuetify-mcp": {
      "url": "https://mcp.vuetifyjs.com/mcp"
    }
  }
}
```

Or run `/mcp-config` in the Kimi TUI to add the server interactively. `/mcp-config login vuetify-mcp` if One OAuth is needed.

### Claude Desktop

[Claude Desktop](https://claude.com/download) is Anthropic's GUI app. **Direct HTTP transport (`url:`) is not supported in `claude_desktop_config.json`** — Claude Desktop only accepts stdio servers. Use one of the two stdio configurations below.

::: code-group no-filename

```json Local
{
  "mcpServers": {
    "vuetify-mcp": {
      "command": "npx",
      "args": ["-y", "@vuetify/mcp"]
    }
  }
}
```

```json Hosted via mcp-remote
{
  "mcpServers": {
    "vuetify-mcp": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.vuetifyjs.com/mcp"]
    }
  }
}
```

```json Hosted via mcp-remote (Windows + WSL2)
{
  "mcpServers": {
    "vuetify-mcp": {
      "command": "wsl",
      "args": ["npx", "-y", "mcp-remote", "https://mcp.vuetifyjs.com/mcp"]
    }
  }
}
```

:::

The first config runs the package locally over stdio. The second and third use the [mcp-remote](https://www.npmjs.com/package/mcp-remote) bridge to consume the hosted server through stdio, which is the only transport Claude Desktop accepts. After editing `claude_desktop_config.json`, fully quit and relaunch Claude Desktop to pick up changes.

### Vuetify CLI

Add Vuetify AI rules and context to your project with the [Vuetify CLI](/guide/tooling/vuetify-cli):

::: code-group no-filename

```bash pnpm
pnpm dlx @vuetify/cli add mcp
```

```bash npm
npx @vuetify/cli add mcp
```

```bash yarn
yarn dlx @vuetify/cli add mcp
```

```bash bun
bunx @vuetify/cli add mcp
```

:::

> [!NOTE]
> The CLI `add mcp` command sets up [Ruler](https://github.com/intellectronica/ruler) project rules for AI context — it does not configure the MCP server connection. Use the interactive setup above to connect your IDE to the Vuetify MCP server.

### Local Server

Run locally for offline access or custom configuration:

::: code-group no-filename

```bash pnpm
pnpm dlx @vuetify/mcp
```

```bash npm
npx -y @vuetify/mcp
```

```bash yarn
yarn dlx @vuetify/mcp
```

```bash bun
bunx @vuetify/mcp
```

:::

## IDE Configuration

Manual configuration for each IDE. Use the interactive setup above for automatic configuration.

| IDE | Config File (Linux) | Config File (macOS) |
| - | - | - |
| Claude Code | `~/.claude.json` or `.mcp.json` | `~/.claude.json` or `.mcp.json` |
| Claude Desktop[^cd] | N/A | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| VS Code | `~/.config/Code/User/mcp.json` | `~/Library/Application Support/Code/User/mcp.json` |
| Cursor | `.cursor/mcp.json` or `~/.cursor/mcp.json` | `.cursor/mcp.json` or `~/.cursor/mcp.json` |
| Windsurf | `~/.config/Windsurf/User/mcp.json` | `~/Library/Application Support/Windsurf/User/mcp.json` |
| Trae | `~/.config/Trae/User/mcp.json` | `~/Library/Application Support/Trae/User/mcp.json` |

[^cd]: Claude Desktop does not support direct HTTP transport. Use the stdio configs in the [Claude Desktop](#claude-desktop) section above instead of the hosted JSON below.

::: code-group no-filename

```json Hosted (Recommended)
{
  "mcpServers": {
    "vuetify-mcp": {
      "url": "https://mcp.vuetifyjs.com/mcp"
    }
  }
}
```

```json Local
{
  "mcpServers": {
    "vuetify-mcp": {
      "command": "npx",
      "args": ["-y", "@vuetify/mcp"]
    }
  }
}
```

:::

## Available Tools

31 tools on the hosted server. Documentation and API tools are public. Bins, playgrounds, and links prompt Vuetify One OAuth.

### Documentation and API

No account required.

| Tool | Purpose |
| - | - |
| `get_vuetify_api_by_version` | Download/cache Vuetify API types by version |
| `get_component_api_by_version` | Component API (props/slots/events) |
| `get_directive_api_by_version` | Directive API |
| `get_installation_guide` | Install guides (vite, nuxt, nuxt-module, laravel, cdn, cdn-esm, vitepress, vuetify0) |
| `get_feature_guides` | List available feature docs |
| `get_feature_guide` | A specific feature guide |
| `get_exposed_exports` | Package exports |
| `get_frequently_asked_questions` | FAQ |
| `get_release_notes_by_version` | Release notes |
| `get_vuetify_one_installation_guide` | `@vuetify/one` README |
| `get_upgrade_guide` | Major-version upgrade guides |
| `get_v4_breaking_changes` | Vuetify 4 breaking changes |
| `get_vuetify0_installation_guide` | `@vuetify/v0` install guide |
| `get_vuetify0_package_guide` | Package-specific v0 documentation |
| `get_vuetify0_composable_list` | List all composables by category |
| `get_vuetify0_composable_guide` | Detailed composable documentation |
| `get_vuetify0_component_list` | List all headless components |
| `get_vuetify0_component_guide` | Component documentation and examples |
| `get_vuetify0_exports_list` | Package subpath exports |
| `get_vuetify0_skill` | `SKILL.md` patterns and anti-patterns |
| `create_bug_report` | Prefill a GitHub issue link |

### Vuetify One

These prompt [Vuetify One](https://one.vuetifyjs.com) OAuth when the assistant needs them. They are not configured with a pasted API key.

| Tool | Purpose |
| - | - |
| `create_vuetify_bin` | Create a [Play bin](https://bin.vuetifyjs.com) |
| `get_all_bins` | List your bins |
| `update_vuetify_bin` | Update a bin |
| `get_bin` | Fetch a bin by ID |
| `create_vuetify_link` | Create a [vtfy.link](https://vtfy.link) short URL |
| `get_all_links` | List your links |
| `create_vuetify_playground` | Create a playground (Vue SFC) |
| `get_all_playgrounds` | List your playgrounds |
| `update_vuetify_playground` | Update a playground |
| `get_playground` | Fetch a playground by ID |

## Example Prompts

- Install Vuetify 4 in a fresh Vite + Vue project the documented way
- What's the current VBtn API (props, slots, events)?
- Scan this repo for Vuetify 3 patterns that break in v4
- List Vuetify0 selection composables and when to use each
- Create a Play bin with a VDataTable example (needs One)
- Make a vtfy.link for this playground (needs One)

## Workflow

When using AI to build headless v0 components:

1. **Explore** — `get_vuetify0_composable_list` to see available primitives
2. **Learn** — `get_vuetify0_composable_guide` for detailed documentation
3. **Reference** — `get_vuetify0_component_guide` for implementation patterns

For Vuetify 3/4 work, start with `get_installation_guide`, `get_component_api_by_version`, `get_upgrade_guide`, or `get_v4_breaking_changes` instead.

## Authentication

Connect at [https://mcp.vuetifyjs.com/mcp](https://mcp.vuetifyjs.com/mcp) (streamable HTTP).

- **Public** — documentation and API tools need no login.
- **Vuetify One OAuth** — bins, playgrounds, and links prompt a Vuetify One sign-in when used. Do not paste an API key to use them on the hosted server.

### Advanced: API key

Local or self-hosted setups can still send a Vuetify API key. This is not the hosted happy path.

::: code-group no-filename

```json Hosted header
{
  "mcpServers": {
    "vuetify-mcp": {
      "url": "https://mcp.vuetifyjs.com/mcp",
      "headers": {
        "Authorization": "Bearer your-api-key"
      }
    }
  }
}
```

```json Local env
{
  "mcpServers": {
    "vuetify-mcp": {
      "command": "npx",
      "args": ["-y", "@vuetify/mcp"],
      "env": {
        "VUETIFY_API_KEY": "your-api-key"
      }
    }
  }
}
```

:::

```bash
claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp \
  -e VUETIFY_API_KEY=your-api-key
```

## Self-Hosting

Run an HTTP server for team or organization access:

::: code-group no-filename

```bash pnpm
pnpm dlx @vuetify/mcp --transport=http --port=3000 --host=0.0.0.0 --stateless
```

```bash npm
npx -y @vuetify/mcp --transport=http --port=3000 --host=0.0.0.0 --stateless
```

```bash yarn
yarn dlx @vuetify/mcp --transport=http --port=3000 --host=0.0.0.0 --stateless
```

```bash bun
bunx @vuetify/mcp --transport=http --port=3000 --host=0.0.0.0 --stateless
```

:::

Configure clients to use your server URL instead of `mcp.vuetifyjs.com`.
