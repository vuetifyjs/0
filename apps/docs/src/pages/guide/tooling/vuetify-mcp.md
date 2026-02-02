---
title: Vuetify MCP - AI Assistant Integration
features:
  label: Vuetify MCP
  order: 3
  level: 1
meta:
  - name: description
    content: Set up Vuetify MCP server to give AI assistants like Claude and Cursor direct access to Vuetify component APIs and v0 headless composable docs.
  - name: keywords
    content: MCP, Model Context Protocol, Claude, AI assistant, Vuetify API, developer tools
related:
  - /guide/tooling/ai-tools
  - /guide/tooling/vuetify-cli
  - /introduction/getting-started
logo: vmcp
---

# Vuetify MCP

Vuetify MCP is a [Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro) server that gives AI assistants structured access to Vuetify and v0 APIs. Unlike [llms.txt](/guide/tooling/ai-tools), MCP provides real-time, queryable documentation.

<DocsPageFeatures :frontmatter />

## Quick Start

### Vuetify CLI (Recommended)

Add MCP to existing projects with the [Vuetify CLI](/guide/tooling/vuetify-cli):

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

### Claude Code

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) is Anthropic's agentic coding tool. Add the hosted MCP server directly via CLI:

```bash
claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

### Interactive Setup

Auto-detects your IDE and configures MCP automatically:

::: code-group no-filename

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
| Claude Desktop | N/A | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| VS Code | `~/.config/Code/User/mcp.json` | `~/Library/Application Support/Code/User/mcp.json` |
| Cursor | `~/.config/Cursor/User/mcp.json` | `~/Library/Application Support/Cursor/User/mcp.json` |
| Windsurf | `~/.config/Windsurf/User/mcp.json` | `~/Library/Application Support/Windsurf/User/mcp.json` |
| Trae | `~/.config/Trae/User/mcp.json` | `~/Library/Application Support/Trae/User/mcp.json` |

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

| Tool | Purpose |
| - | - |
| `get_vuetify0_composable_list` | List all composables by category |
| `get_vuetify0_composable_guide` | Detailed composable documentation |
| `get_vuetify0_component_list` | List all headless components |
| `get_vuetify0_component_guide` | Component documentation and examples |
| `get_vuetify0_exports_list` | Package subpath exports |
| `get_vuetify0_installation_guide` | Setup instructions |
| `get_vuetify0_package_guide` | Package-specific documentation |

> [!TIP]
> The MCP server also includes tools for Vuetify 3/4 APIs, installation guides, and [Vuetify Bins](https://bin.vuetifyjs.com). Run `tools/list` to see all available tools.

## Workflow

When using AI to build headless components:

1. **Explore** — `get_vuetify0_composable_list` to see available primitives
2. **Learn** — `get_vuetify0_composable_guide` for detailed documentation
3. **Reference** — `get_vuetify0_component_guide` for implementation patterns

## Authentication

[Vuetify Bins](https://vuetifyjs.com/features/bins/) require an API key from your Vuetify account.

### Vuetify CLI

::: code-group no-filename

```bash pnpm
pnpm dlx @vuetify/cli add mcp --api-key your-api-key
```

```bash npm
npx @vuetify/cli add mcp --api-key your-api-key
```

```bash yarn
yarn dlx @vuetify/cli add mcp --api-key your-api-key
```

```bash bun
bunx @vuetify/cli add mcp --api-key your-api-key
```

:::

### Claude Code

```bash
claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp \
  -e VUETIFY_API_KEY=your-api-key
```

### Manual Configuration

::: code-group no-filename

```json Hosted (recommended)
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

```json Local
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
