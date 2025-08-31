<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-dark.png">
  <img alt="Vuetify One Logo" src="https://vuetifyjs.b-cdn.net/docs/images/logos/vzero-logo-light.png" height="150">
</picture>
</div>

# @vuetify/paper

Styling and layout primitives. `@vuetify/paper` extends the foundational components from `@vuetify/v0` with styling capabilities, providing a complete system for managing colors, spacing, borders, shadows, and layout. It's designed to be the styling layer that transforms headless components into visually appealing interfaces.

## 🚀 Installation

```bash
npm install @vuetify/paper
# or
pnpm add @vuetify/paper
# or
yarn add @vuetify/paper
```

## 📦 What's Included

### Components

- **`V0Paper`** - Base layout component with comprehensive styling props including:
  - Color and background management
  - Border and border radius controls
  - Elevation and shadow effects
  - Spacing (margin and padding)
  - Dimensions (width and height)
  - Layout utilities

### Composables

- **`useBorder`** - Border styling utilities
  - Border width, style, and color management
  - Individual side border controls
  - Border radius utilities

- **`useColor`** - Color system management
  - Theme-aware color utilities
  - Color contrast calculations
  - Dynamic color generation

- **`useContrast`** - Color contrast calculations
  - WCAG compliance checking
  - Automatic text color selection
  - Accessibility-focused color utilities

- **`useDimensions`** - Size and spacing utilities
  - Responsive width and height
  - Aspect ratio management
  - Min/max dimension controls

- **`useElevation`** - Shadow and elevation effects
  - Material Design elevation system
  - Custom shadow utilities
  - Depth and layering management

- **`useRounded`** - Border radius utilities
  - Consistent border radius system
  - Individual corner controls
  - Responsive radius values

- **`useSpacing`** - Margin and padding utilities
  - Consistent spacing scale
  - Individual side controls
  - Responsive spacing values

## 📖 Basic Usage

### V0Paper Component

The `V0Paper` component is the primary building block, offering comprehensive styling props:

```vue
<script setup>
import { V0Paper } from '@vuetify/paper'
</script>

<template>
  <!-- Basic paper with elevation -->
  <V0Paper elevation="2" class="p-4">
    <h2>Card Title</h2>
    <p>Card content goes here.</p>
  </V0Paper>

  <!-- Colored paper with custom styling -->
  <V0Paper 
    color="primary"
    rounded="lg"
    :padding="{ x: 6, y: 4 }"
    elevation="4"
  >
    <h3>Primary Card</h3>
    <p>This card uses the primary theme color.</p>
  </V0Paper>

  <!-- Responsive paper -->
  <V0Paper 
    :width="{ xs: '100%', md: '50%', lg: '33%' }"
    :padding="{ xs: 4, md: 6 }"
    rounded="md"
    border
  >
    <p>Responsive card that adapts to screen size.</p>
  </V0Paper>

  <!-- Custom border and spacing -->
  <V0Paper
    border="2px solid"
    border-color="secondary"
    :margin="{ bottom: 4 }"
    :padding="8"
    rounded="xl"
  >
    <p>Card with custom border styling.</p>
  </V0Paper>
</template>
```

### Using Styling Composables

```vue
<script setup>
import { 
  useColor, 
  useSpacing, 
  useElevation, 
  useRounded,
  useBorder 
} from '@vuetify/paper'
import { ref } from 'vue'

// Color management
const { getColor, getContrastText, isLight } = useColor()

// Spacing utilities
const { getSpacing, getPadding, getMargin } = useSpacing()

// Elevation system
const { getElevation, getShadow } = useElevation()

// Border radius
const { getRounded, getBorderRadius } = useRounded()

// Border utilities
const { getBorder, getBorderColor } = useBorder()

const primaryColor = getColor('primary')
const textColor = getContrastText(primaryColor)
const cardElevation = getElevation(3)
</script>

<template>
  <div 
    :style="{
      backgroundColor: primaryColor,
      color: textColor,
      padding: getSpacing(4),
      borderRadius: getRounded('lg'),
      boxShadow: cardElevation,
      border: getBorder('1px', 'solid', 'secondary')
    }"
  >
    <h3>Styled with Composables</h3>
    <p>This element uses styling composables for consistent theming.</p>
  </div>
</template>
```

### Advanced Styling Patterns

```vue
<script setup>
import { V0Paper } from '@vuetify/paper'
import { useBreakpoints } from '@vuetify/v0'
import { computed } from 'vue'

const { isMobile, mdAndUp } = useBreakpoints()

// Responsive styling
const cardProps = computed(() => ({
  elevation: isMobile.value ? '1' : '3',
  padding: isMobile.value ? 4 : 6,
  rounded: isMobile.value ? 'md' : 'lg',
  width: isMobile.value ? '100%' : '400px'
}))
</script>

<template>
  <!-- Responsive card -->
  <V0Paper v-bind="cardProps">
    <h3>Responsive Design</h3>
    <p>This card adapts its styling based on screen size.</p>
  </V0Paper>

  <!-- Grid layout with papers -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <V0Paper 
      v-for="item in items" 
      :key="item.id"
      elevation="2"
      rounded="lg"
      :padding="4"
      hover-elevation="4"
      class="transition-shadow duration-200"
    >
      <h4>{{ item.title }}</h4>
      <p>{{ item.description }}</p>
    </V0Paper>
  </div>

  <!-- Nested papers for complex layouts -->
  <V0Paper elevation="3" rounded="xl" :padding="6">
    <h2>Main Container</h2>
    
    <V0Paper 
      color="surface-variant"
      rounded="lg"
      :padding="4"
      :margin="{ top: 4 }"
    >
      <h3>Nested Content</h3>
      <p>Papers can be nested for complex layouts.</p>
    </V0Paper>
    
    <V0Paper 
      border
      border-color="outline"
      rounded="md"
      :padding="3"
      :margin="{ top: 3 }"
    >
      <p>Another nested section with border styling.</p>
    </V0Paper>
  </V0Paper>
</template>
```

## 🎨 Styling System

### Color System

The color system integrates with `@vuetify/v0`'s theme system:

- **Theme Colors**: `primary`, `secondary`, `surface`, `background`, etc.
- **Semantic Colors**: `success`, `warning`, `error`, `info`
- **Surface Variants**: `surface-variant`, `surface-container`, etc.
- **Automatic Contrast**: Text colors automatically adjust for accessibility

### Spacing Scale

Consistent spacing using a standardized scale:

- **Scale**: `0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64`
- **Units**: Each unit represents 0.25rem (4px at default font size)
- **Responsive**: All spacing props support responsive objects

### Elevation System

Material Design-inspired elevation system:

- **Levels**: `0-24` with predefined shadow values
- **Hover States**: Automatic hover elevation increases
- **Performance**: Optimized shadow rendering

### Border Radius

Consistent border radius system:

- **Sizes**: `none`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `full`
- **Custom Values**: Support for custom radius values
- **Individual Corners**: Control each corner independently

## 🏗️ Design Principles

- **Consistent Theming**: All styling respects the global theme system
- **Responsive First**: Built-in responsive design capabilities
- **Accessibility**: WCAG-compliant color contrast and focus management
- **Performance**: Optimized CSS generation and minimal runtime overhead
- **Customizable**: Extensive customization through CSS variables and props
- **Composable**: Styling logic available as reusable composables

## 🔧 Configuration

### CSS Variables

All styling can be customized through CSS variables:

```css
:root {
  /* Spacing scale */
  --v0-spacing-unit: 0.25rem;
  
  /* Border radius */
  --v0-rounded-sm: 0.125rem;
  --v0-rounded-md: 0.375rem;
  --v0-rounded-lg: 0.5rem;
  
  /* Elevation shadows */
  --v0-elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12);
  --v0-elevation-2: 0 1px 5px rgba(0, 0, 0, 0.2);
  
  /* Border widths */
  --v0-border-thin: 1px;
  --v0-border-medium: 2px;
  --v0-border-thick: 4px;
}
```

## 📚 API Reference

For detailed API documentation, prop definitions, and advanced examples, visit our [documentation site](https://0.vuetifyjs.com/paper) or explore the TypeScript definitions included in this package.

## 🔗 Related Packages

- **[@vuetify/v0](https://npmjs.com/package/@vuetify/v0)** - Core foundational components and composables
- **[Vuetify 3](https://vuetifyjs.com)** - Full-featured Material Design component library

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and ensure all tests pass before submitting a pull request.

## 📄 License

MIT License

---

Built with ❤️ for the Vue ecosystem. Part of the Vuetify family.