export interface RoundedProps {
  borderRadius?: string
}

export function useRounded (
  props: RoundedProps,
  name?: string,
) {
  name = getCurrentInstanceName(name)

  const roundedStyles = toRef(() => {
    return {
      [`--v0-${name}-border-radius`]: props.borderRadius,
    }
  })

  return {
    roundedStyles,
  }
}
