# Hyper-Minimalist Implementation Guide

## Quick Start: Using the Design System

### 1. Theme Integration

Every page/component must be wrapped with `ThemeProvider`:

```tsx
import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### 2. Accessing Theme State

```tsx
import { useTheme } from './components/ThemeProvider';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  // theme === 'light' or 'dark'
}
```

---

## Color Class Patterns

### Background Colors

| Context | Class |
|---------|-------|
| Page background | `bg-white dark:bg-black` |
| Card/Section | `bg-white dark:bg-black` |
| Hover state | `hover:bg-black/5 dark:hover:bg-white/5` |
| Active/Selected | `bg-black/10 dark:bg-white/10` |

### Text Colors

| Type | Class |
|------|-------|
| Primary text | `text-black dark:text-white` |
| Secondary text | `text-black/60 dark:text-white/60` |
| Tertiary text | `text-black/40 dark:text-white/40` |
| Disabled text | `text-black/20 dark:text-white/20` |

### Borders

| Style | Class |
|-------|-------|
| Standard border | `border-black/10 dark:border-white/10` |
| Thicker border | `border-black/20 dark:border-white/20` |
| Ring (focus) | `ring-blue-500 dark:ring-blue-400` |

---

## Component Templates

### Ghost Button

```tsx
<button className="px-4 py-2 border border-black/20 dark:border-white/20 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black dark:text-white">
  Button Text
</button>
```

### Primary Button

```tsx
<button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-black/80 dark:hover:bg-white/80 transition-colors">
  Button Text
</button>
```

### Input Field

```tsx
<input
  type="text"
  className="w-full px-4 py-3 border border-black/20 dark:border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-black text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40"
  placeholder="Enter text..."
/>
```

### Card Container

```tsx
<div className="bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl p-6">
  {/* Card content */}
</div>
```

---

## Role-Based Colors

### Doctor Elements

```tsx
// Background
className="bg-blue-500/10 dark:bg-blue-400/10"

// Border
className="border-blue-500/20 dark:border-blue-400/20"

// Text
className="text-blue-600 dark:text-blue-400"

// Solid Button
className="bg-blue-600 dark:bg-blue-500"
```

### Patient Elements

```tsx
// Background
className="bg-green-500/10 dark:bg-green-400/10"

// Border
className="border-green-500/20 dark:border-green-400/20"

// Text
className="text-green-600 dark:text-green-400"

// Solid Button
className="bg-green-600 dark:bg-green-500"
```

---

## Icon Usage

### Import from Lucide

```tsx
import { IconName } from 'lucide-react';
```

### Standard Sizes

| Context | Size Class |
|---------|-----------|
| Button icons | `w-4 h-4` |
| Section headers | `w-5 h-5` |
| Large icons | `w-6 h-6` |
| Avatar icons | `w-5 h-5` |

### Color Application

```tsx
// Adaptive to theme
<Icon className="w-5 h-5 text-black dark:text-white" />

// Role-based
<Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
```

---

## Spacing System

### Padding/Margin Scale

| Token | Size | Usage |
|-------|------|-------|
| `p-2` | 0.5rem (8px) | Icon padding |
| `p-4` | 1rem (16px) | Button padding |
| `p-6` | 1.5rem (24px) | Card padding |
| `p-8` | 2rem (32px) | Section padding |

### Gap (Flexbox/Grid)

| Token | Size | Usage |
|-------|------|-------|
| `gap-2` | 0.5rem | Tight spacing |
| `gap-3` | 0.75rem | Standard spacing |
| `gap-4` | 1rem | Loose spacing |

---

## Responsive Utilities

### Show/Hide by Breakpoint

```tsx
// Hide on mobile, show on tablet+
className="hidden sm:block"

// Show on mobile, hide on tablet+
className="block sm:hidden"

// Inline on desktop, stacked on mobile
className="flex flex-col md:flex-row"
```

---

## Animation Classes

### Transitions

```tsx
// Color transitions
className="transition-colors duration-150"

// All properties
className="transition-all duration-300"

// Transform only
className="transition-transform duration-300"
```

### Built-in Animations

```tsx
// Spinner
className="animate-spin"

// Pulse (recording indicator)
className="animate-pulse"
```

---

## Accessibility Checklist

### Every Interactive Element Must Have:

- [ ] `aria-label` (if no visible text)
- [ ] `title` attribute (for icons)
- [ ] `disabled` state handling
- [ ] Keyboard navigation support
- [ ] Focus indicator (default or custom ring)

### Example

```tsx
<button
  onClick={handleClick}
  disabled={isLoading}
  className="..."
  aria-label="Close menu"
  title="Close menu"
>
  <X className="w-5 h-5" />
</button>
```

---

## Common Patterns

### Loading State

```tsx
{isLoading ? (
  <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
) : (
  <Content />
)}
```

### Empty State

```tsx
<div className="text-center py-12">
  <Icon className="w-16 h-16 text-black/40 dark:text-white/40 mx-auto mb-4" />
  <p className="text-black/60 dark:text-white/60 text-lg">No items yet</p>
  <p className="text-black/40 dark:text-white/40 text-sm mt-2">Get started by...</p>
</div>
```

### Conditional Styling

```tsx
className={`base-classes ${
  isActive 
    ? "bg-blue-600 dark:bg-blue-500 text-white" 
    : "bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60"
}`}
```

---

## Typography Classes

### Headings

```tsx
<h1 className="text-4xl font-bold text-black dark:text-white">
<h2 className="text-3xl font-bold text-black dark:text-white">
<h3 className="text-2xl font-semibold text-black dark:text-white">
<h4 className="text-xl font-semibold text-black dark:text-white">
```

### Body Text

```tsx
<p className="text-base text-black dark:text-white">
<p className="text-sm text-black/60 dark:text-white/60">
<p className="text-xs text-black/50 dark:text-white/50">
```

---

## Form Validation

### Error State

```tsx
<input
  className={`w-full px-4 py-3 border rounded-lg ${
    hasError 
      ? 'border-red-500 dark:border-red-400 ring-2 ring-red-500/20' 
      : 'border-black/20 dark:border-white/20'
  }`}
/>
{hasError && (
  <p className="text-red-600 dark:text-red-400 text-sm mt-1">Error message</p>
)}
```

---

## Z-Index Layers

| Layer | Value | Usage |
|-------|-------|-------|
| Dropdown | `z-50` | Profile menu, tooltips |
| Backdrop | `z-40` | Modal overlay |
| Header | `z-30` | Sticky navigation |
| Notification | `z-50` | Toast, alerts |

---

## Print Styles (Future)

```css
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white !important;
    color: black !important;
  }
}
```

---

## Performance Tips

### 1. Avoid Inline Styles

❌ **Bad**:
```tsx
<div style={{ backgroundColor: theme === 'dark' ? '#000' : '#fff' }}>
```

✅ **Good**:
```tsx
<div className="bg-white dark:bg-black">
```

### 2. Use CSS Variables for Dynamic Values

```tsx
// In theme.css
:root { --custom-spacing: 1rem; }

// In component
<div style={{ padding: 'var(--custom-spacing)' }}>
```

### 3. Lazy Load Non-Critical Components

```tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

---

## Testing Dark Mode

### Manual Testing

1. Toggle theme button
2. Refresh page (should persist)
3. Check localStorage: `localStorage.getItem('theme')`
4. Inspect element: `<html class="dark">`

### Automated Testing

```typescript
// Check if class is applied
expect(document.documentElement.classList.contains('dark')).toBe(true);

// Check localStorage
expect(localStorage.getItem('theme')).toBe('dark');
```

---

## Common Mistakes to Avoid

### ❌ Forgetting Dark Mode Variant

```tsx
// Missing dark: prefix
className="bg-white text-black"
```

### ✅ Correct Implementation

```tsx
className="bg-white dark:bg-black text-black dark:text-white"
```

### ❌ Using Absolute Colors

```tsx
// Hard to maintain
className="text-gray-600"
```

### ✅ Using Opacity

```tsx
// Adapts to theme automatically
className="text-black/60 dark:text-white/60"
```

---

## Quick Reference Card

### Essential Classes

```
Backgrounds:    bg-white dark:bg-black
Text:           text-black dark:text-white
Text Secondary: text-black/60 dark:text-white/60
Borders:        border-black/10 dark:border-white/10
Hover:          hover:bg-black/5 dark:hover:bg-white/5
Focus Ring:     focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
```

---

## File Structure

```
/src/app/
  components/
    ThemeProvider.tsx      # Theme context
    HamburgerMenu.tsx      # Mobile nav
    ProfileAvatar.tsx      # User menu
    ThemeToggle.tsx        # Light/dark switch
    CurrentTime.tsx        # Clock display
    MessageBubble.tsx      # Chat messages
    AudioRecorder.tsx      # Voice input
    AISummary.tsx          # Summary generator
    ApiKeyNotice.tsx       # Warning banner
  pages/
    Root.tsx               # Layout wrapper
    Home.tsx               # Landing page
    Conversation.tsx       # Chat interface
    ConversationHistory.tsx # Past chats
    
/src/styles/
  fonts.css                # Noto Sans imports
  theme.css                # Color tokens
  index.css                # Global styles
```

---

*Implementation Guide Version: 1.0.0*  
*For: MediTranslate Hyper-Minimalist Design System*
