/* eslint-disable unicorn/no-process-exit -- CLI entry for the changeset CI check */
import { execFileSync } from 'node:child_process'

// Decides whether a PR that touches published source forgot its changeset.
// The changeset-reminder workflow comments; pr-checks.yml fails the PR.
// Status letters match `git diff --name-status` (A added, M modified, D deleted, R rename).

/**
 * @param {{ status: string, filename: string }[]} files
 * @returns {string | null} A failure message, or null when the PR is fine.
 */
export function missingChangeset (files) {
  const hasChangeset = files.some(file =>
    file.status.startsWith('A')
    && /^\.changeset\/.+\.md$/.test(file.filename)
    && !file.filename.endsWith('/README.md'),
  )
  const touchesSource = files.some(file => /^packages\/[^/]+\/src\//.test(file.filename))

  if (touchesSource && !hasChangeset) {
    return 'This PR changes packages/*/src but does not add a .changeset/*.md file. Run `pnpm changeset`.'
  }

  return null
}

function filesFromDiff (diff) {
  return diff.split('\n').filter(Boolean).map(line => {
    const [status, ...rest] = line.split('\t')
    return { status, filename: rest.at(-1) }
  })
}

const isDirectRun = process.argv[1] && process.argv[1].endsWith('changeset-required.js')

if (isDirectRun) {
  const spec = process.env.BASE_SHA
    ? `${process.env.BASE_SHA}...HEAD`
    : (process.env.BASE ? `origin/${process.env.BASE}...HEAD` : '')

  if (!spec) {
    console.error('BASE_SHA or BASE is required (the pull request base).')
    process.exit(1)
  }

  const diff = execFileSync('git', ['diff', '--name-status', spec], { encoding: 'utf8' })
  const message = missingChangeset(filesFromDiff(diff))

  if (message) {
    console.error(message)
    process.exit(1)
  }
}
