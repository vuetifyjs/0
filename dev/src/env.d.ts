// The editor surface: tsconfig.app.json includes src only, which leaves the
// root vite-env.d.ts — and its vite/client reference that declares image
// modules — out of bare TS servers. The typecheck config includes both.
/// <reference types="vite/client" />
