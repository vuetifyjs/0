// Icons
import {
  mdiBash,
  mdiDatabaseOutline,
  mdiDocker,
  mdiEslint,
  mdiFileCodeOutline,
  mdiFileCogOutline,
  mdiFileDelimitedOutline,
  mdiFileDocumentOutline,
  mdiFileExcelOutline,
  mdiFileImageOutline,
  mdiFileLockOutline,
  mdiFileMusicOutline,
  mdiFilePdfBox,
  mdiFilePowerpointOutline,
  mdiFileVideoOutline,
  mdiFileWordOutline,
  mdiFormatFont,
  mdiGit,
  mdiGraphql,
  mdiLanguageC,
  mdiLanguageCpp,
  mdiLanguageCsharp,
  mdiLanguageFortran,
  mdiLanguageGo,
  mdiLanguageHaskell,
  mdiLanguageHtml5,
  mdiLanguageJava,
  mdiLanguageKotlin,
  mdiLanguageLua,
  mdiLanguageMarkdown,
  mdiLanguagePhp,
  mdiLanguagePython,
  mdiLanguageR,
  mdiLanguageRuby,
  mdiLanguageRust,
  mdiLanguageSwift,
  mdiLanguageXaml,
  mdiLicense,
  mdiNix,
  mdiNpm,
  mdiPowershell,
  mdiSass,
  mdiSvg,
  mdiTerraform,
  mdiXml,
  mdiZipBoxOutline,
} from '@mdi/js'

export interface FileType {
  icon: string
  color: string
}

/** Icon paths registered with the playground icon plugin. */
export const FILE_TYPE_ICONS = {
  'lang-html': mdiLanguageHtml5,
  'lang-md': mdiLanguageMarkdown,
  'lang-sass': mdiSass,
  'lang-xml': mdiXml,
  'lang-svg': mdiSvg,
  'lang-sh': mdiBash,
  'lang-ps': mdiPowershell,
  'lang-py': mdiLanguagePython,
  'lang-php': mdiLanguagePhp,
  'lang-go': mdiLanguageGo,
  'lang-rust': mdiLanguageRust,
  'lang-java': mdiLanguageJava,
  'lang-kotlin': mdiLanguageKotlin,
  'lang-swift': mdiLanguageSwift,
  'lang-c': mdiLanguageC,
  'lang-cpp': mdiLanguageCpp,
  'lang-cs': mdiLanguageCsharp,
  'lang-ruby': mdiLanguageRuby,
  'lang-lua': mdiLanguageLua,
  'lang-haskell': mdiLanguageHaskell,
  'lang-fortran': mdiLanguageFortran,
  'lang-r': mdiLanguageR,
  'lang-xaml': mdiLanguageXaml,
  'lang-graphql': mdiGraphql,
  'lang-docker': mdiDocker,
  'lang-terraform': mdiTerraform,
  'lang-nix': mdiNix,
  'lang-npm': mdiNpm,
  'lang-git': mdiGit,
  'lang-eslint': mdiEslint,
  'file-image': mdiFileImageOutline,
  'file-audio': mdiFileMusicOutline,
  'file-video': mdiFileVideoOutline,
  'file-pdf': mdiFilePdfBox,
  'file-archive': mdiZipBoxOutline,
  'file-table': mdiFileDelimitedOutline,
  'file-excel': mdiFileExcelOutline,
  'file-word': mdiFileWordOutline,
  'file-slides': mdiFilePowerpointOutline,
  'file-document': mdiFileDocumentOutline,
  'file-code': mdiFileCodeOutline,
  'file-settings': mdiFileCogOutline,
  'file-lock': mdiFileLockOutline,
  'file-db': mdiDatabaseOutline,
  'file-license': mdiLicense,
  'file-font': mdiFormatFont,
} as const

interface Kind {
  icon: string
  color: string
  extensions: string[]
}

/**
 * Extension → icon. The first seven keep the colors the tree already used.
 * Later kinds share an icon and differ by color.
 */
const KINDS: Kind[] = [
  { icon: 'lang-vue', color: '#4FC08D', extensions: ['vue'] },
  { icon: 'lang-js', color: '#d3b62a', extensions: ['js', 'mjs', 'cjs', 'jsx'] },
  { icon: 'lang-ts', color: '#3179c7', extensions: ['ts', 'mts', 'cts', 'tsx'] },
  { icon: 'lang-css', color: '#1572B6', extensions: ['css', 'pcss', 'postcss'] },
  { icon: 'lang-json', color: '#a57b39', extensions: ['json', 'jsonc', 'json5', 'webmanifest'] },

  { icon: 'lang-html', color: '#E34F26', extensions: ['html', 'htm'] },
  { icon: 'lang-md', color: '#083FA1', extensions: ['md', 'mdx', 'mdc', 'markdown'] },
  { icon: 'lang-sass', color: '#CF649A', extensions: ['scss', 'sass'] },
  { icon: 'lang-css', color: '#4A6FA5', extensions: ['less'] },
  { icon: 'lang-css', color: '#C75B39', extensions: ['styl', 'stylus'] },
  { icon: 'lang-xml', color: '#E37933', extensions: ['xml', 'plist', 'xsl', 'xslt', 'xsd'] },
  { icon: 'lang-svg', color: '#FFB13B', extensions: ['svg'] },
  { icon: 'file-code', color: '#CB171E', extensions: ['yml', 'yaml'] },
  { icon: 'file-code', color: '#9C4221', extensions: ['toml'] },
  { icon: 'lang-graphql', color: '#E10098', extensions: ['graphql', 'gql'] },

  { icon: 'lang-sh', color: '#4EAA25', extensions: ['sh', 'bash', 'zsh', 'fish', 'ksh'] },
  { icon: 'lang-ps', color: '#2671BE', extensions: ['ps1', 'psm1', 'psd1'] },
  { icon: 'lang-sh', color: '#4EAA25', extensions: ['bat', 'cmd'] },

  { icon: 'lang-py', color: '#3776AB', extensions: ['py', 'pyi', 'pyw'] },
  { icon: 'lang-php', color: '#777BB4', extensions: ['php', 'phtml'] },
  { icon: 'lang-go', color: '#00ADD8', extensions: ['go'] },
  { icon: 'lang-rust', color: '#DEA584', extensions: ['rs'] },
  { icon: 'lang-java', color: '#B07219', extensions: ['java'] },
  { icon: 'lang-kotlin', color: '#7F52FF', extensions: ['kt', 'kts'] },
  { icon: 'lang-swift', color: '#F05138', extensions: ['swift'] },
  { icon: 'lang-c', color: '#6E8A9A', extensions: ['c', 'h'] },
  { icon: 'lang-cpp', color: '#F34B7D', extensions: ['cpp', 'cc', 'cxx', 'hpp', 'hh', 'hxx'] },
  { icon: 'lang-cs', color: '#178600', extensions: ['cs'] },
  { icon: 'lang-ruby', color: '#CC342D', extensions: ['rb', 'erb', 'rake'] },
  { icon: 'lang-lua', color: '#5B6EE1', extensions: ['lua'] },
  { icon: 'lang-haskell', color: '#5E5086', extensions: ['hs', 'lhs'] },
  { icon: 'lang-fortran', color: '#4D41B1', extensions: ['f', 'f90', 'f95', 'for'] },
  { icon: 'lang-r', color: '#276DC3', extensions: ['r'] },
  { icon: 'lang-xaml', color: '#5C2D91', extensions: ['xaml'] },

  { icon: 'file-code', color: '#00B4AB', extensions: ['dart'] },
  { icon: 'file-code', color: '#6E4A7E', extensions: ['ex', 'exs'] },
  { icon: 'file-code', color: '#DB5855', extensions: ['clj', 'cljs', 'cljc', 'edn'] },
  { icon: 'file-code', color: '#C22D40', extensions: ['scala', 'sc'] },
  { icon: 'file-code', color: '#0298C3', extensions: ['pl', 'pm'] },
  { icon: 'file-code', color: '#C9A227', extensions: ['nim', 'nims'] },
  { icon: 'file-code', color: '#F7A41D', extensions: ['zig'] },
  { icon: 'file-code', color: '#AA6746', extensions: ['sol'] },
  { icon: 'file-code', color: '#654FF0', extensions: ['wasm', 'wat'] },
  { icon: 'file-code', color: '#776791', extensions: ['cr'] },
  { icon: 'file-code', color: '#B845FC', extensions: ['fs', 'fsx', 'fsi'] },
  { icon: 'file-code', color: '#60B5CC', extensions: ['elm'] },
  { icon: 'file-code', color: '#B83998', extensions: ['erl', 'hrl'] },
  { icon: 'file-code', color: '#244776', extensions: ['coffee', 'litcoffee'] },
  { icon: 'file-code', color: '#FF3E00', extensions: ['svelte'] },
  { icon: 'file-code', color: '#BC52EE', extensions: ['astro'] },
  { icon: 'file-code', color: '#C75B39', extensions: ['ml', 'mli'] },
  { icon: 'file-code', color: '#8B5CF6', extensions: ['proto'] },
  { icon: 'file-code', color: '#F7B93E', extensions: ['prettierrc'] },
  { icon: 'lang-eslint', color: '#4B32C3', extensions: ['eslintrc'] },

  { icon: 'file-db', color: '#E38C00', extensions: ['sql', 'sqlite', 'db'] },
  { icon: 'file-db', color: '#5A67D8', extensions: ['prisma'] },
  { icon: 'file-table', color: '#217346', extensions: ['csv', 'tsv'] },
  { icon: 'file-settings', color: '#C5A017', extensions: ['env'] },
  { icon: 'file-settings', color: '#6D8086', extensions: ['ini', 'conf', 'cfg', 'editorconfig', 'properties', 'babelrc'] },
  { icon: 'file-lock', color: '#6B7280', extensions: ['lock'] },
  { icon: 'file-document', color: '#6B7280', extensions: ['txt', 'text', 'log', 'rst', 'adoc', 'org'] },
  { icon: 'file-document', color: '#3D6117', extensions: ['tex', 'latex', 'bib'] },
  { icon: 'file-pdf', color: '#F40F02', extensions: ['pdf'] },
  { icon: 'file-image', color: '#26A69A', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'avif', 'ico', 'bmp', 'heic', 'tif', 'tiff'] },
  { icon: 'file-audio', color: '#F59E0B', extensions: ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'] },
  { icon: 'file-video', color: '#EF4444', extensions: ['mp4', 'webm', 'mov', 'avi', 'mkv'] },
  { icon: 'file-archive', color: '#8D6E63', extensions: ['zip', 'gz', 'tgz', 'bz2', 'xz', '7z', 'rar', 'tar', 'zst'] },
  { icon: 'file-word', color: '#2B579A', extensions: ['doc', 'docx'] },
  { icon: 'file-excel', color: '#217346', extensions: ['xls', 'xlsx'] },
  { icon: 'file-slides', color: '#D24726', extensions: ['ppt', 'pptx'] },
  { icon: 'file-font', color: '#7C3AED', extensions: ['woff', 'woff2', 'ttf', 'otf', 'eot'] },

  { icon: 'lang-docker', color: '#2496ED', extensions: ['dockerfile'] },
  { icon: 'lang-terraform', color: '#844FBA', extensions: ['tf', 'tfvars', 'hcl'] },
  { icon: 'lang-nix', color: '#5277C3', extensions: ['nix'] },
  { icon: 'lang-npm', color: '#CB3837', extensions: ['npmrc', 'nvmrc'] },
  { icon: 'lang-git', color: '#F05032', extensions: ['gitignore', 'gitattributes', 'gitmodules'] },
]

const NAMED: Record<string, FileType> = {
  dockerfile: { icon: 'lang-docker', color: '#2496ED' },
  containerfile: { icon: 'lang-docker', color: '#2496ED' },
  makefile: { icon: 'file-settings', color: '#6D8086' },
  gemfile: { icon: 'lang-ruby', color: '#CC342D' },
  rakefile: { icon: 'lang-ruby', color: '#CC342D' },
  jenkinsfile: { icon: 'file-code', color: '#D33833' },
  vagrantfile: { icon: 'file-code', color: '#1868F2' },
  procfile: { icon: 'file-settings', color: '#6D8086' },
  license: { icon: 'file-license', color: '#6D8086' },
  copying: { icon: 'file-license', color: '#6D8086' },
}

function indexKinds (): Record<string, FileType> {
  const types: Record<string, FileType> = {}
  for (const kind of KINDS) {
    for (const extension of kind.extensions) {
      if (extension in types) throw new Error(`[playground] duplicate file type "${extension}"`)
      types[extension] = { icon: kind.icon, color: kind.color }
    }
  }
  return types
}

export const FILE_TYPES: Record<string, FileType> = indexKinds()

/** Icon and color for a playground path. Unknown types return undefined. */
export function fileType (filename: string): FileType | undefined {
  const base = filename.split('/').pop()?.toLowerCase()
  if (!base) return undefined
  if (base === '.env' || base.startsWith('.env.')) return FILE_TYPES.env
  const named = NAMED[base]
  if (named) return named
  const dot = base.lastIndexOf('.')
  if (dot <= 0) return base.startsWith('.') ? FILE_TYPES[base.slice(1)] : undefined
  return FILE_TYPES[base.slice(dot + 1)]
}
