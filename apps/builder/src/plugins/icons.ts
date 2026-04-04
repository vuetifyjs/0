import { mdiArrowLeft, mdiArrowRight, mdiCheck, mdiChevronDown, mdiClose, mdiCog, mdiLock, mdiMagnify, mdiRobot } from '@mdi/js'

// Framework
import { createPlugin, createTokensContext } from '@vuetify/v0'

// Types
import type { App } from 'vue'

export const [useIconContext, provideIconContext, context] = createTokensContext({
  namespace: 'v0:icons',
  tokens: {
    back: mdiArrowLeft,
    forward: mdiArrowRight,
    check: mdiCheck,
    close: mdiClose,
    down: mdiChevronDown,
    search: mdiMagnify,
    settings: mdiCog,
    lock: mdiLock,
    ai: mdiRobot,
  },
})

export function createIconPlugin () {
  return createPlugin({
    namespace: 'v0:icons',
    provide: (app: App) => {
      provideIconContext(context, app)
    },
  })
}
