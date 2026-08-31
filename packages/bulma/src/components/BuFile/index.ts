export type { BuFileColor, BuFileContext, BuFileExpose, BuFileProps, BuFileSize, BuFileSlotProps } from './BuFile.vue'

// Context
import Root from './BuFile.vue'

import Cta from '../BuFileCta/BuFileCta.vue'
import Icon from '../BuFileIcon/BuFileIcon.vue'
import Name from '../BuFileName/BuFileName.vue'

/**
 * File input. Renders `.file`; CTA, icon, and name are composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuFileCta`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuFile } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuFile>
 *     <BuFile.Cta>
 *       <BuFile.Icon />
 *     </BuFile.Cta>
 *
 *     <BuFile.Name />
 *   </BuFile>
 * </template>
 * ```
 */
export const BuFile = Object.assign(Root, {
  /** `.file-cta` choose-file control. */
  Cta,
  /** `.file-icon` inside the CTA. */
  Icon,
  /** `.file-name` selected-file label. */
  Name,
})
