import { defineBuildConfig } from 'obuild/config'

// Build waits for https://github.com/unjs/obuild/pull/34 to be merged
export default defineBuildConfig({
  entries: [
    './src/index',
    './src/composables',
  ],
})
