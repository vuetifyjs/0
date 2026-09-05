import { generateApiWhitelist } from './apps/docs/build/generate-api-whitelist.ts'
import './scripts/init-dev.js'

await generateApiWhitelist()
