import { defineConfig } from 'bumpp'

// The substrate (@vuetify/v0 + @vuetify/paper) versions in lockstep; design
// systems (@paper/*) are versioned independently and must NOT ride this train.
// Listing `files` explicitly disables bumpp's recursive workspace discovery, so
// only these package.json files are bumped by `pnpm release`.
export default defineConfig({
  files: [
    'package.json',
    'packages/0/package.json',
    'packages/paper/package.json',
  ],
})
