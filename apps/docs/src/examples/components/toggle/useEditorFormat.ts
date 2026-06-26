import { ref, shallowRef, toRef } from 'vue'

export interface FormatTool {
  value: string
  label: string
  tip: string
  class: string
}

export interface AlignTool {
  value: string
  label: string
  class: string
}

export function useEditorFormat () {
  // Orthogonal marks — any combination can be active at once.
  const formatTools: FormatTool[] = [
    { value: 'bold', label: 'B', tip: 'Bold', class: 'font-bold' },
    { value: 'italic', label: 'I', tip: 'Italic', class: 'italic' },
    { value: 'underline', label: 'U', tip: 'Underline', class: 'underline' },
  ]

  // Mutually exclusive alignment — exactly one is always active.
  const alignTools: AlignTool[] = [
    { value: 'left', label: 'Left', class: 'text-left' },
    { value: 'center', label: 'Center', class: 'text-center' },
    { value: 'right', label: 'Right', class: 'text-right' },
  ]

  // Multi-select group holds an array; start with bold pressed.
  const marks = ref<string[]>(['bold'])
  // Single-select mandatory group holds one string value.
  const align = shallowRef('left')

  const previewClass = toRef(() => [
    ...formatTools.filter(tool => marks.value.includes(tool.value)).map(tool => tool.class),
    alignTools.find(tool => tool.value === align.value)?.class,
  ])

  const summary = toRef(() => {
    const active = formatTools
      .filter(tool => marks.value.includes(tool.value))
      .map(tool => tool.tip)

    return active.length > 0 ? active.join(', ') : 'None'
  })

  function reset () {
    marks.value = []
    align.value = 'left'
  }

  return { formatTools, alignTools, marks, align, previewClass, summary, reset }
}
