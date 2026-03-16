// Icons
import {
  mdiBookOpenBlankVariant,
  mdiBookOutline,
  mdiChevronDown,
  mdiChevronLeft,
  mdiChevronUp,
  mdiClose,
  mdiCodeJson,
  mdiCodeTags,
  mdiCog,
  mdiDragHorizontal,
  mdiDragVertical,
  mdiEye,
  mdiFilePlusOutline,
  mdiFolderOpenOutline,
  mdiFolderOutline,
  mdiFolderPlusOutline,
  mdiLanguageCss3,
  mdiLanguageJavascript,
  mdiLanguageTypescript,
  mdiViewSplitHorizontal,
  mdiViewSplitVertical,
  mdiVuejs,
  mdiWeatherNight,
  mdiWeatherSunny,
} from '@mdi/js'

// Framework
import { createPlugin, createTokensContext } from '@vuetify/v0'

// Types
import type { App } from 'vue'

export const [useIconContext, provideIconContext, context] = createTokensContext({
  namespace: 'v0:icons',
  tokens: {
    'left': mdiChevronLeft,
    'book-open': mdiBookOpenBlankVariant,
    'book-closed': mdiBookOutline,
    'folder': mdiFolderOutline,
    'folder-open': mdiFolderOpenOutline,
    'folder-plus': mdiFolderPlusOutline,
    'file-plus': mdiFilePlusOutline,
    'cog': mdiCog,
    'close': mdiClose,
    'editor': mdiCodeTags,
    'eye': mdiEye,
    'layout-horizontal': mdiViewSplitVertical,
    'layout-vertical': mdiViewSplitHorizontal,
    'chevron-up': mdiChevronUp,
    'chevron-down': mdiChevronDown,
    'drag-horizontal': mdiDragHorizontal,
    'drag-vertical': mdiDragVertical,
    'lang-ts': mdiLanguageTypescript,
    'lang-tsx': mdiLanguageTypescript,
    'lang-js': mdiLanguageJavascript,
    'lang-jsx': mdiLanguageJavascript,
    'lang-css': mdiLanguageCss3,
    'lang-vue': mdiVuejs,
    'lang-json': mdiCodeJson,
    'theme-light': mdiWeatherSunny,
    'theme-dark': mdiWeatherNight,
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
