---
title: Vuetify MCP - AI Assistant Integration
features:
  label: Vuetify MCP
  order: 2
  level: 1
meta:
  - name: description
    content: Set up Vuetify MCP server to give AI assistants like Claude and Cursor direct access to Vuetify component APIs and v0 headless composable docs.
  - name: keywords
    content: MCP, Model Context Protocol, Claude, AI assistant, Vuetify API, developer tools
related:
  - /guide/tooling/ai-tools
  - /introduction/getting-started
---

# Vuetify MCP

Vuetify MCP is a [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) server that gives AI assistants structured access to Vuetify and v0 APIs. Unlike [llms.txt](/guide/tooling/ai-tools), MCP provides real-time, queryable documentation.

<DocsPageFeatures :frontmatter />

## Quick Start

### Claude Code (Recommended)

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) is Anthropic's agentic coding tool. Add the hosted MCP server directly via CLI:

```bash
claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

### Interactive Setup

Auto-detects your IDE and configures MCP automatically:

::: code-group

```bash pnpm
# Hosted server (recommended)
pnpm dlx @vuetify/mcp config --remote

# Local server
pnpm dlx @vuetify/mcp config
```

```bash npm
# Hosted server (recommended)
npx -y @vuetify/mcp config --remote

# Local server
npx -y @vuetify/mcp config
```

```bash yarn
# Hosted server (recommended)
yarn dlx @vuetify/mcp config --remote

# Local server
yarn dlx @vuetify/mcp config
```

```bash bun
# Hosted server (recommended)
bunx @vuetify/mcp config --remote

# Local server
bunx @vuetify/mcp config
```

:::

### Local Server

Run locally for offline access or custom configuration:

::: code-group

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

| IDE | Config File |
| - | - |
| Claude Code | `~/.claude.json` or project `.mcp.json` |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) |
| VS Code (Copilot) | `~/.config/Code/User/settings.json` |
| Cursor | `~/.config/Cursor/User/mcp.json` |
| Windsurf | `~/.config/Windsurf/User/mcp.json` |
| Trae | `~/.config/Trae/User/mcp.json` |

### Hosted Configuration

```json
{
  "mcpServers": {
    "vuetify-mcp": {
      "url": "https://mcp.vuetifyjs.com/mcp"
    }
  }
}
```

### Local Configuration

```json
{
  "mcpServers": {
    "vuetify-mcp": {
      "command": "npx",
      "args": ["-y", "@vuetify/mcp"]
    }
  }
}
```

## Available Tools

### Vuetify 3 API

| Tool | Purpose |
| - | - |
| `get_component_api_by_version` | Props, events, slots for any component |
| `get_directive_api_by_version` | Directive info (v-ripple, v-scroll, etc.) |
| `get_vuetify_api_by_version` | Download full API types by version |

### Documentation

| Tool | Purpose |
| - | - |
| `get_installation_guide` | Setup for Vite, Nuxt, Laravel, CDN |
| `get_feature_guide` | Theming, i18n, accessibility guides |
| `get_frequently_asked_questions` | Common questions and answers |
| `get_release_notes_by_version` | Changelog for any version |

### v0 (Headless)

| Tool | Purpose |
| - | - |
| `get_vuetify0_composable_list` | List all composables by category |
| `get_vuetify0_composable_guide` | Detailed composable documentation |
| `get_vuetify0_component_list` | List all headless components |
| `get_vuetify0_component_guide` | Component documentation and examples |

## Workflows

### Building with v0

When using AI to build headless components:

1. **Explore** — `get_vuetify0_composable_list` to see available primitives
2. **Learn** — `get_vuetify0_composable_guide` for detailed documentation
3. **Reference** — `get_vuetify0_component_guide` for implementation patterns

### Building with Vuetify 3

When using AI with styled Vuetify components:

1. **API** — `get_component_api_by_version` for props, events, and slots
2. **Features** — `get_feature_guide` for theming, i18n, or accessibility

## Authentication

[Vuetify Bins](https://vuetifyjs.com/features/bins/) require an API key from your Vuetify account:

```json
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

## Self-Hosting

Run an HTTP server for team or organization access:

::: code-group

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
