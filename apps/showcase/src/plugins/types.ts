export interface AnalysisResult {
  components: string[]
  composables: string[]
  plugins: string[]
  constants: string[]
  types: string[]
  utils: string[]
}

export interface CoverageReport {
  documented: string[]
  stubs: string[]
  missing: string[]
  score: number
}

export interface PaperAnalyzerTarget {
  slug: string
  package: string
  importMap?: string
  manifestComponents?: string[]
  manifestComposables?: string[]
}

export interface PaperAnalyzerOptions {
  targets: PaperAnalyzerTarget[]
}
