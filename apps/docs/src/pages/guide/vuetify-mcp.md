---
title: Vuetify MCP - AI Assistant Integration
features:
  label: Vuetify MCP
  order: 12
meta:
  - name: description
    content: Set up Vuetify MCP server to give AI assistants like Claude direct access to Vuetify and v0 APIs.
  - name: keywords
    content: MCP, Model Context Protocol, Claude, AI assistant, Vuetify API, developer tools
related:
  - /guide/ai-tools
  - /introduction/getting-started
---

# Vuetify MCP

Vuetify MCP is a [Model Context Protocol](https://modelcontextprotocol.io/) server that gives AI assistants structured access to Vuetify and v0 APIs. Unlike [llms.txt](/guide/ai-tools), MCP provides real-time, queryable documentation.

<DocsPageFeatures :frontmatter />

## Quick Start

### Hosted Server (Recommended)

The fastest way to get started. No installation required:

```bash
claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

### Local Installation

Run the server locally for offline access:

```bash
npx -y @vuetify/mcp
```

### Interactive Setup

Auto-detects your IDE and configures MCP:

```bash
# For hosted server
npx -y @vuetify/mcp config --remote

# For local server
npx -y @vuetify/mcp config
```

## IDE Configuration

Manual configuration for each IDE:

| IDE | Config File |
| - | - |
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) |
| VS Code | `~/.config/Code/User/settings.json` |
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

### Workflow: Building Components

When building components with AI assistance, use these tools in order:

| Step | Tool | Purpose |
| - | - | - |
| 1 | `get_vuetify0_composable_list` | See what primitives are available |
| 2 | `get_vuetify0_composable_guide` | Get detailed docs for chosen composable |
| 3 | `get_vuetify0_component_guide` | See reference implementation patterns |

**Example prompt flow:**

```txt
1. "List v0 composables" → get_vuetify0_composable_list
2. "Show me createSelection docs" → get_vuetify0_composable_guide(selection, createSelection)
3. "How does the Selection component use it?" → get_vuetify0_component_guide(Selection)
```

For Vuetify 3 styled components:

| Step | Tool | Purpose |
| - | - | - |
| 1 | `get_component_api_by_version` | Get props, events, slots for a component |
| 2 | `get_feature_guide` | Understand theming, i18n, or other features |

## Authentication

Some features require a Vuetify API key:

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

Run an HTTP server for team access:

```bash
npx -y @vuetify/mcp --transport=http --port=3000 --host=0.0.0.0 --stateless
```

Then configure clients to use your server URL instead of `mcp.vuetifyjs.com`.
