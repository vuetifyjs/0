import { describe, expect, it } from 'vitest'

import {
  buildPlaygroundFiles,
  rewritePackageMacroTypes,
  V0_MACROS_FILE,
} from './files'

const APP_BUTTON = `<script setup lang="ts">
  import { Atom } from '@vuetify/v0'
  import { computed, toRef } from 'vue'

  import type { AtomProps } from '@vuetify/v0'

  const {
    as = 'button',
    renderless,
    variant = 'solid',
  } = defineProps<AtomProps & {
    variant?: 'solid' | 'soft'
  }>()
</script>
`

describe('rewritePackageMacroTypes', () => {
  it('should rewrite AtomProps package type imports to a relative shim', () => {
    const files = rewritePackageMacroTypes({
      'src/AppButton.vue': APP_BUTTON,
    })

    expect(files['src/AppButton.vue']).toContain('import type { AtomProps } from \'./v0-macros\'')
    expect(files['src/AppButton.vue']).not.toContain('import type { AtomProps } from \'@vuetify/v0\'')
    expect(files['src/AppButton.vue']).toContain('import { Atom } from \'@vuetify/v0\'')
    expect(files[V0_MACROS_FILE]).toContain('export interface AtomProps')
    expect(files[V0_MACROS_FILE]).toContain('renderless?: boolean')
  })

  it('should split mixed value/type imports from the package', () => {
    const files = rewritePackageMacroTypes({
      'src/Button.vue': `<script setup lang="ts">
  import { Atom, type AtomProps } from '@vuetify/v0'
  defineProps<AtomProps>()
</script>
`,
    })

    expect(files['src/Button.vue']).toContain('import { Atom } from \'@vuetify/v0\'')
    expect(files['src/Button.vue']).toContain('import type { AtomProps } from \'./v0-macros\'')
  })

  it('should use a parent-relative shim specifier for nested files', () => {
    const files = rewritePackageMacroTypes({
      'src/atom/AppButton.vue': APP_BUTTON,
    })

    expect(files['src/atom/AppButton.vue']).toContain('from \'../v0-macros\'')
    expect(files[V0_MACROS_FILE]).toBeDefined()
  })

  it('should leave files without SFC macros unchanged', () => {
    const code = `<script setup lang="ts">
  import type { AtomProps } from '@vuetify/v0'
  const unused: AtomProps | undefined = undefined
</script>
`
    const files = rewritePackageMacroTypes({ 'src/types.vue': code })
    expect(files['src/types.vue']).toBe(code)
    expect(files[V0_MACROS_FILE]).toBeUndefined()
  })

  it('should be idempotent', () => {
    const once = rewritePackageMacroTypes({ 'src/AppButton.vue': APP_BUTTON })
    const twice = rewritePackageMacroTypes(once)
    expect(twice['src/AppButton.vue']).toBe(once['src/AppButton.vue'])
    expect(twice[V0_MACROS_FILE]).toBe(once[V0_MACROS_FILE])
  })
})

describe('buildPlaygroundFiles', () => {
  it('should rewrite macros when assembling a playground payload', () => {
    const files = buildPlaygroundFiles([
      { name: 'AppButton.vue', code: APP_BUTTON },
      { name: 'polymorphic.vue', code: `<script setup lang="ts">
  import AppButton from './AppButton.vue'
</script>
<template><AppButton /></template>
` },
    ])

    expect(files['src/AppButton.vue']).toContain('from \'./v0-macros\'')
    expect(files[V0_MACROS_FILE]).toContain('AtomProps')
  })
})
