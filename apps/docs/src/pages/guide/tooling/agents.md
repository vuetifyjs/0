---
title: Agents - Grok Bot and AI agent setup
features:
  label: Agents
  order: 1.5
  level: 1
meta:
- name: description
  content: Paste-ready agent setup prompts that connect GitHub, dry-run a v0 task, and save a Vuetify0 or Vuetify Engineer — plus identity fields for Claude and Cursor.
- name: keywords
  content: Agents, Grok Bot, AI agent, Vuetify0, setup prompt, Cursor, Claude, SKILL.md, MCP
related:
  - /guide/tooling/ai-tools
  - /guide/tooling/vuetify-mcp
  - /introduction/getting-started
  - /introduction/security
---

<script setup lang="ts">
  import { jacek, john } from '@/constants/identities'
</script>

# Agents

<DocsPageFeatures :frontmatter />

Paste a prompt into [Grok Bot](https://x.ai/bot). It walks GitHub, dry-runs one task, and saves itself. Use John for v0, Jacek for Vuetify 3/4.

## Usage

Use this when you don't know yet whether the bot is for an app or the monorepo — it will ask. Connect GitHub when it asks. It fetches [SKILL.md](/SKILL.md) and the matching page on [0.vuetifyjs.com](https://0.vuetifyjs.com) itself.

```text
Set up a new bot for me dedicated to Vuetify0 work, in its own dedicated chat. Walk me through connecting GitHub, then configure it: default to @vuetify/v0 headless primitives — never Vuetify 3/4 (VBtn, vuetify/components) unless I ask. Before inventing an API, fetch https://0.vuetifyjs.com/SKILL.md and the matching page on https://0.vuetifyjs.com; use Vuetify MCP at https://mcp.vuetifyjs.com/mcp when it's available. If a named primitive covers the need, use it. Ask me whether this bot is for a consumer app (import from @vuetify/v0) or the vuetifyjs/0 monorepo (use the #v0/ alias and follow AGENTS.md), which repositories it may touch, and whether it may open pull requests or must hand me a diff. Do a supervised dry run on a small real task I name, cite the v0 primitive it chose, then save it as "Vuetify0 Engineer".
```

After the dry run, paste the matching identity below onto the saved bot so later sessions keep the same rules.

## Identity

What the create-bot form asks for. John defaults to v0. Jacek defaults to Vuetify 3/4.

<DocsIdentity v-bind="john" />

<DocsIdentity v-bind="jacek" />

## Recipes

Skip these if you used Usage — it already interviews for the mode. Reach for a variant when the job is decided.

### Consumer app

A Vue 3 app that consumes `@vuetify/v0`. No `#v0/` alias, no `vuetify` package.

```text
Set up a new bot for me I can trigger for Vue 3 app work on @vuetify/v0, in its own dedicated chat. Walk me through connecting GitHub if the app lives in a repo, then configure it: import only from @vuetify/v0 — never the #v0/ monorepo alias, never the vuetify package. Treat https://0.vuetifyjs.com/SKILL.md as the decision table; if a named primitive covers the need, use it. Compound components for markup, create* factories for logic. Don't invent a design system. Ask me which package manager, which v0 plugins are already installed, and what the first screen or component is. Show me the first implementation in a dry run and wait for my approval before opening a pull request or editing files I did not name, then save it as "Vuetify0 App Engineer".
```

### Monorepo contributor

Work inside [vuetifyjs/0](https://github.com/vuetifyjs/0). Uses the `#v0/` alias and the repo rules.

```text
Set up a new bot for me dedicated to contributing to vuetifyjs/0, in its own dedicated chat. Walk me through connecting GitHub on https://github.com/vuetifyjs/0, then configure it: use the #v0/ path alias, never deep relative imports. Read AGENTS.md and the matching file under .claude/rules before writing. Docs-only changes target master; new public API targets dev; breaking changes target next. Ask me whether the change is a feature, a docs fix, or a rules sync, which branch it should land on, and whether it may open the pull request or must hand me a diff. Do a dry run on a small real task I name, then save it as "Vuetify0 Contributor".
```

## Other agents

Claude Code, Cursor, and Grok Build are editor/CLI agents, not Grok Bot. They need the files installed in the workspace; they will not walk a GitHub connection for you.

```bash
npx skills add vuetifyjs/0
```

::: code-group no-filename

```bash Claude Code
claude mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

```bash Grok Build
grok mcp add --transport http vuetify-mcp https://mcp.vuetifyjs.com/mcp
```

:::

Paste the identity **Description** into the agent's persona / system prompt. For harness tips (surface map in always-loaded context, reminder hooks, typecheck gate), see [Making Agents Actually Use v0](/guide/tooling/ai-tools#making-agents-actually-use-v0). Add [Vuetify MCP](/guide/tooling/vuetify-mcp) so the agent can call `get_vuetify0_*` tools.

## FAQ

::: faq
??? Grok Bot vs Grok Build — which page is this?

[Grok Bot](https://x.ai/bot) is the desktop/iOS teammate with its own computer, scheduled routines, and tool sign-in. Grok Build is the coding CLI. This page's Usage prompt is for Grok Bot. Other agents is for Grok Build, Claude Code, and Cursor. See [AI Tools](/guide/tooling/ai-tools) for the CLI path.

??? Who can run Grok Bot today?

Early beta for SuperGrok Heavy, Cursor Ultra, and Cursor Premium Teams. Details and downloads live on [x.ai/bot](https://x.ai/bot).
:::
