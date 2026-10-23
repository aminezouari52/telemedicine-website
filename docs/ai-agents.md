# AI coding agents

The repo comes set up for Claude Code, Cursor and OpenCode. Other agents that read `AGENTS.md` (Codex, GitHub Copilot, Windsurf and others) get the project instructions too, but not the MCP server.

## What's included

| File                                | Used by                    | What it does                                                                                                        |
| ----------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `AGENTS.md`                         | All three, and most others | Commands, architecture notes and project rules                                                                      |
| `.cursor/mcp.json`, `opencode.json` | Cursor, OpenCode           | Adds the [shadcn MCP server](https://ui.shadcn.com/docs/mcp), so the agent can look up and add shadcn/ui components |

## Adding to it

- **Project rules:** add them to `AGENTS.md`. Don't create `CLAUDE.md`, `.cursorrules` or other copies; they drift apart.
- **Skills:** put one copy in `.claude/skills/<name>/SKILL.md` and add a line to `AGENTS.md` saying when to use it. Claude Code and OpenCode load `.claude/skills/` on their own; other agents find the skill through that line.
- **MCP servers:** add the server to both `.cursor/mcp.json` and `opencode.json`. The two files use different formats (`mcpServers` with `command` and `args` in Cursor, `mcp` with a `command` array in OpenCode), so copy the existing shadcn entry in each.

## Personal settings

Keep personal settings out of the repo. `.claude/settings.local.json` (Claude Code permissions) is local, and `.opencode/` is gitignored, so you can install your own skills and plugins there.
