export function getCurrentInstanceName (name?: string): string | undefined {
  if (name) {
    return name
  }

  const vm = getCurrentInstance()

  return vm?.type?.__name?.replace('V0', '').toLowerCase()
}
