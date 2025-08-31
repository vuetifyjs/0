export default {
  // primitives
  boolean: true,
  number: 42,
  string: 'hello',

  // nested plain values
  baz: {
    qux: 'quux',
    corge: {
      grault: 'garply',
      deep: {
        plugh: 'xyzzy',
        thud: 'wibble',
      },
    },
  },

  // tokens with metadata
  grault: {
    $value: 'waldo',
    $type: 'string',
    $description: 'A token with metadata',
  },

  fred: {
    $value: '1',
    $type: 'number',
    $description: 'Another token with metadata',
  },

  // nested references
  nested: {
    fizz: '{foo}',
    buzz: {
      $value: '{baz.qux}',
      $type: 'string',
      $description: 'A nested token referencing another token',
    },
    bang: {
      $value: '{fred}',
      $type: 'number',
      $description: 'Coerces numeric token from metadata',
    },
  },

  // theme-like structure (no arrays)
  theme: {
    color: {
      brand: {
        primary: {
          base: '#4f46e5',
          soft: '#6366f1',
          strong: '#4338ca',
        },
        secondary: {
          base: '#0ea5e9',
          soft: '#38bdf8',
          strong: '#0284c7',
        },
      },
      semantic: {
        info: '{theme.color.brand.secondary.base}',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      surface: {
        background: '#0b0b10',
        card: '#111827',
        overlay: 'rgba(0,0,0,0.5)',
        text: {
          primary: '#e5e7eb',
          secondary: '#9ca3af',
          muted: '#6b7280',
          inverse: '#111827',
        },
      },
    },

    spacing: {
      // keep numeric values as numbers or string tokens
      'none': 0,
      'xs': 4,
      'sm': 8,
      'md': 12,
      'lg': 16,
      'xl': 24,
      '2xl': 32,
      '3xl': 48,
      'gutter': {
        tight: '{theme.spacing.sm}',
        normal: '{theme.spacing.lg}',
        loose: '{theme.spacing.xl}',
      },
    },

    radius: {
      none: 0,
      sm: 2,
      md: 4,
      lg: 8,
      xl: 12,
      pill: 9999,
    },

    shadow: {
      x: 0,
      y: 1,
      blur: 2,
      spread: 0,
      base: '0 1px 2px rgba(0,0,0,0.24)',
      sm: '{theme.shadow.base}',
      md: '0 4px 12px rgba(0,0,0,0.24)',
      lg: '0 10px 24px rgba(0,0,0,0.28)',
    },

    typography: {
      family: {
        sans: '\'Inter\', system-ui, -apple-system, Segoe UI, Roboto, \'Helvetica Neue\', Arial',
        mono: '\'JetBrains Mono\', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas',
      },
      size: {
        'xs': 12,
        'sm': 14,
        'md': 16,
        'lg': 18,
        'xl': 20,
        '2xl': 24,
        '3xl': 30,
      },
      weight: {
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        snug: 1.35,
        normal: 1.5,
        relaxed: 1.65,
      },
    },
  },

  // component-style tokens (still objects only)
  components: {
    Button: {
      height: 40,
      radius: '{theme.radius.lg}',
      paddingX: '{theme.spacing.lg}',
      text: {
        color: '{theme.color.surface.text.primary}',
        weight: '{theme.typography.weight.semibold}',
        size: '{theme.typography.size.md}',
        lineHeight: '{theme.typography.lineHeight.snug}',
      },
      variant: {
        solid: {
          background: '{theme.color.brand.primary.base}',
          backgroundHover: '{theme.color.brand.primary.soft}',
          color: '{theme.color.surface.text.inverse}',
          shadow: '{theme.shadow.sm}',
        },
        outline: {
          background: 'transparent',
          borderColor: '{theme.color.brand.primary.base}',
          color: '{theme.color.brand.primary.base}',
        },
        ghost: {
          background: 'transparent',
          color: '{theme.color.brand.primary.base}',
          backgroundHover: 'rgba(79,70,229,0.12)',
        },
      },
      states: {
        focus: {
          ringWidth: 2,
          ringColor: '{theme.color.brand.secondary.soft}',
        },
        disabled: {
          opacity: 0.5,
          cursor: 'not-allowed',
        },
      },
    },

    Card: {
      background: '{theme.color.surface.card}',
      radius: '{theme.radius.xl}',
      padding: '{theme.spacing.xl}',
      shadow: '{theme.shadow.md}',
      header: {
        paddingBottom: '{theme.spacing.md}',
        titleColor: '{theme.color.surface.text.primary}',
        subtitleColor: '{theme.color.surface.text.secondary}',
      },
      body: {
        color: '{theme.color.surface.text.primary}',
        lineHeight: '{theme.typography.lineHeight.normal}',
      },
    },

    Input: {
      height: 40,
      radius: '{theme.radius.md}',
      paddingX: '{theme.spacing.md}',
      background: '#0f172a',
      borderColor: '#1f2937',
      color: '{theme.color.surface.text.primary}',
      placeholderColor: '{theme.color.surface.text.muted}',
      focus: {
        borderColor: '{theme.color.brand.secondary.base}',
        ringWidth: 2,
        ringColor: '{theme.color.brand.secondary.soft}',
      },
      invalid: {
        borderColor: '{theme.color.semantic.danger}',
        helperColor: '{theme.color.semantic.danger}',
      },
    },
  },

  // computed “design tokens” with metadata and references
  tokens: {
    heading: {
      h1: {
        $value: '{theme.typography.size.3xl}',
        $type: 'number',
        $description: 'Main heading font size',
      },
      h2: {
        $value: '{theme.typography.size.2xl}',
        $type: 'number',
        $description: 'Section heading font size',
      },
    },
    link: {
      color: {
        $value: '{theme.color.brand.secondary.base}',
        $type: 'string',
        $description: 'Default link color',
      },
      colorHover: {
        $value: '{theme.color.brand.secondary.soft}',
        $type: 'string',
        $description: 'Hover link color',
      },
      underlineOffset: {
        $value: '2',
        $type: 'number',
        $description: 'Underline offset in pixels',
      },
    },
  },
}
