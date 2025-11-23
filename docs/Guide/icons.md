---
title: Using Icons
order: 6
---

# Using Icons for Logo and Favicon

nlddoc supports both image files and [Lucide icons](https://lucide.dev) for your site's logo and favicon. Icons provide a lightweight, scalable alternative to image files.

## Quick Start with Icons

The easiest way to add a logo is using a Lucide icon name:

```json
{
  "logo": "lucide:book-open",
  "favicon": "lucide:book-open"
}
```

## Logo Options

### Using a Lucide Icon

Simple icon-only logo:

```json
{
  "logo": "lucide:book-open"
}
```

Icon with custom color:

```json
{
  "logo": {
    "type": "lucide",
    "icon": "zap",
    "color": "#fbbf24"
  }
}
```

Icon with text and color:

```json
{
  "logo": {
    "type": "lucide",
    "icon": "rocket",
    "text": "My Docs",
    "color": "#4ecdc4"
  }
}
```

### Using an Image File

You can still use traditional image files:

```json
{
  "logo": "./logo.svg"
}
```

Or with object syntax:

```json
{
  "logo": {
    "type": "file",
    "path": "./logo.png"
  }
}
```

## Favicon Options

### Using a Lucide Icon

```json
{
  "favicon": "lucide:file-text"
}
```

Or object syntax:

```json
{
  "favicon": {
    "type": "lucide",
    "icon": "file-text"
  }
}
```

With custom color:

```json
{
  "favicon": {
    "type": "lucide",
    "icon": "file-text",
    "color": "#f39c12"
  }
}
```

### Using an Image File

```json
{
  "favicon": "./favicon.ico"
}
```

For best results, use SVG or PNG format (32x32 or larger).

## Popular Icon Choices

Here are some popular Lucide icons for documentation sites:

- `book-open` - Open book
- `file-text` - Document
- `book` - Closed book
- `library` - Library/bookshelf
- `scroll-text` - Scroll
- `notebook` - Notebook
- `files` - Multiple files
- `folder-open` - Open folder
- `code` - Code brackets
- `terminal` - Terminal window

## Complete Example

```json
{
  "title": "My Project Docs",
  "description": "Complete project documentation",
  "logo": {
    "type": "lucide",
    "icon": "book-open",
    "text": "Docs",
    "color": "#3b82f6"
  },
  "favicon": {
    "type": "lucide",
    "icon": "book-open",
    "color": "#3b82f6"
  },
  "search": true,
  "outline": {
    "enabled": true,
    "depth": [2, 3],
    "label": "On this page"
  }
}
```

## Custom Colors

You can customize icon colors to match your brand:

```json
{
  "logo": {
    "type": "lucide",
    "icon": "zap",
    "color": "#fbbf24"
  }
}
```

Use any valid CSS color:
- Hex: `"#3b82f6"`, `"#ff6b6b"`
- RGB: `"rgb(59, 130, 246)"`
- Named: `"tomato"`, `"steelblue"`

If no color is specified, icons use your site's brand color.

### Popular Color Palettes

**Modern Blues:**
- `#3b82f6` - Bright blue
- `#2563eb` - Deep blue
- `#60a5fa` - Sky blue

**Vibrant Colors:**
- `#f59e0b` - Amber
- `#10b981` - Emerald
- `#8b5cf6` - Purple
- `#ec4899` - Pink

**Professional:**
- `#6366f1` - Indigo
- `#0ea5e9` - Cyan
- `#14b8a6` - Teal

## Icon Browser

To find more icons, visit [lucide.dev/icons](https://lucide.dev/icons) and search for icons that fit your project.

Icon names use kebab-case (e.g., `book-open`, `file-text`, `code-2`).

## Real-World Examples

**Tech Documentation:**
```json
{
  "logo": {
    "type": "lucide",
    "icon": "code-2",
    "text": "API Docs",
    "color": "#3b82f6"
  },
  "favicon": {
    "type": "lucide",
    "icon": "code-2",
    "color": "#3b82f6"
  }
}
```

**Recipe Book:**
```json
{
  "logo": {
    "type": "lucide",
    "icon": "chef-hat",
    "text": "Family Recipes",
    "color": "#f59e0b"
  },
  "favicon": {
    "type": "lucide",
    "icon": "chef-hat",
    "color": "#f59e0b"
  }
}
```

**Project Guide:**
```json
{
  "logo": {
    "type": "lucide",
    "icon": "rocket",
    "color": "#8b5cf6"
  },
  "favicon": {
    "type": "lucide",
    "icon": "rocket",
    "color": "#8b5cf6"
  }
}
```

## GitHub Pages and Custom Domains

When deploying to GitHub Pages with a custom domain or subdirectory, the icon system automatically handles path resolution. You don't need to worry about base URLs - they work everywhere!

## Benefits of Using Icons

- ✅ **Lightweight** - No image files to manage
- ✅ **Scalable** - Perfect at any size
- ✅ **Consistent** - Professional icon design
- ✅ **Customizable** - Set any color you want
- ✅ **Fast** - No extra HTTP requests
- ✅ **Theme-aware** - Works with dark/light mode

## Mixing Icons and Images

You can use icons for one and images for another:

```json
{
  "logo": "./custom-logo.svg",
  "favicon": "lucide:bookmark"
}
```

Choose whatever works best for your project!
