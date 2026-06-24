// PR nudge: when a PR changes packages/* source but has no changeset, post — and
// keep updated — a single sticky comment reminding the author to run
// `pnpm changeset`, so the change isn't dropped from the next release.
//
// Driven by the changeset-reminder workflow (pull_request_target). Reads only the
// PR's file LIST and comments via `gh`; it never checks out or runs PR code.
import { execFileSync } from 'node:child_process'

const repo = process.env.REPO
const pr = process.env.PR
const MARKER = '<!-- changeset-reminder -->'

function gh (args, input) {
  return execFileSync('gh', args, { encoding: 'utf8', input })
}

const files = JSON.parse(gh(['api', '--paginate', `repos/${repo}/pulls/${pr}/files`]))

// A real changeset is a newly added .changeset/*.md that isn't the README.
const hasChangeset = files.some(file => file.status === 'added' && /^\.changeset\/.+\.md$/.test(file.filename) && !file.filename.endsWith('/README.md'))
const touchesSource = files.some(file => /^packages\/[^/]+\/src\//.test(file.filename))

const found = `${MARKER}\n✅ **Changeset found** — this change will be included in the next release. Thanks!`
const missing = `${MARKER}
### ⚠️ No changeset found

This PR changes \`packages/*\` source but has no changeset, so it won't be in the next release's version bump or notes. Add one:

\`\`\`bash
pnpm changeset
\`\`\`

Pick the affected package(s) (\`@vuetify/v0\` carries \`@vuetify/paper\` automatically), a bump type, and a short summary, then commit the generated \`.changeset/*.md\`. Docs-only, chore, or CI PRs can ignore this.`
const skip = `${MARKER}\nℹ️ No \`packages/*\` source changes detected — a changeset isn't required for this PR.`

const body = hasChangeset ? found : (touchesSource ? missing : skip)

const comments = JSON.parse(gh(['api', '--paginate', `repos/${repo}/issues/${pr}/comments`]))
const existing = comments.find(comment => comment.body.includes(MARKER))

if (existing) {
  // Keep the existing comment in sync (e.g. ⚠️ -> ✅ once a changeset is added).
  gh(['api', '-X', 'PATCH', `repos/${repo}/issues/comments/${existing.id}`, '-F', 'body=@-'], body)
} else if (touchesSource && !hasChangeset) {
  // Only open a fresh thread when there's actually something to nudge about.
  gh(['api', `repos/${repo}/issues/${pr}/comments`, '-F', 'body=@-'], body)
}
