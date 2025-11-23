# Fast Docs

An ultralight, zero-config markdown documentation viewer and static site generator.

📚 **[Full Documentation](https://nldlabs.github.io/fastdocs/)**

## Quick Start

View your markdown docs instantly:

```bash
npx fastdocs serve ./docs
```

Build a static site for deployment:

```bash
npx fastdocs build ./docs ./output
```

Customize with a config file:

```bash
npx fastdocs init ./docs
# Edit .fastdocs, then serve or build
```

## Features

- 🚀 **Zero Setup** - No installation, no configuration required
- 📁 **Auto-Discovery** - Automatically builds navigation from your folder structure
- 🔍 **Built-in Search** - Full-text search out of the box
- 📖 **Table of Contents** - Automatic TOC from headings
- 🎨 **Custom Components** - SubPages and FullContents components
- 🎯 **Icon Support** - Use Lucide icons for logo and favicon
- ⚡ **Hot Reload** - Instant updates during development
- 🎯 **Frontmatter Support** - Optional YAML frontmatter for ordering and metadata
- 🏗️ **Static Site Generation** - Deploy anywhere static hosting works

## Installation

No installation needed! Use with `npx`:

```bash
npx fastdocs serve
```

Or install globally:

```bash
npm install -g fastdocs
fastdocs serve ./docs
```

## Documentation

For complete documentation, guides, and examples, visit **[nldlabs.github.io/fastdocs](https://nldlabs.github.io/fastdocs/)**.

## Commands

### init

Create a `.fastdocs` configuration file with default settings in your documentation directory.

```bash
fastdocs init [path]
```

**Arguments:**
- `path` - Directory to create config in (default: current directory)

**Options:**
- `-f, --force` - Overwrite existing config without confirmation

**Examples:**
```bash
# Create config in current directory
fastdocs init

# Create config in specific directory
fastdocs init ./docs

# Overwrite existing config
fastdocs init --force
```

The generated `.fastdocs` file includes all available options with sensible defaults. Edit it to customize your documentation site.

### serve

Start a local development server to view your documentation.

```bash
fastdocs serve [path] [options]
```

**Arguments:**
- `path` - Path to documentation directory (default: current directory)

**Options:**
- `-p, --port <number>` - Port number (default: 5173)
- `--no-open` - Don't open browser automatically
- `--host` - Allow external access

**Examples:**
```bash
# Serve current directory
fastdocs serve

# Serve specific directory
fastdocs serve ./my-docs

# Use custom port
fastdocs serve ./docs --port 3000

# Allow external access
fastdocs serve ./docs --host
```

### build

Build a static site from your documentation.

```bash
fastdocs build [input] [output] [options]
```

**Arguments:**
- `input` - Source directory (default: current directory)
- `output` - Output directory (default: ./dist)

**Options:**
- `--base <path>` - Base URL path for deployment (default: /)
- `--clean` - Clean output without confirmation

**Examples:**
```bash
# Build with defaults
fastdocs build

# Specify input and output
fastdocs build ./docs ./public

# Deploy to subdirectory
fastdocs build ./docs ./dist --base /my-project/

# Skip confirmation prompt
fastdocs build ./docs ./dist --clean
```

## Configuration

fastdocs works great with zero configuration, but you can customize it by creating a `.fastdocs` file in your documentation directory.

**Quick start:**
```bash
# Generate a config file with defaults
fastdocs init
```

**Example `.fastdocs`:**
```json
{
  "title": "My Documentation",
  "description": "Comprehensive project documentation",
  "logo": "lucide:book-open",
  "favicon": "lucide:book-open",
  "search": true,
  "outline": {
    "enabled": true,
    "depth": [2, 3],
    "label": "On this page"
  }
}
```

**Configuration Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | Folder name | Site title |
| `description` | string | "Documentation" | Site description |
| `logo` | string/object | null | Path to logo file or Lucide icon (e.g., "lucide:book-open", or `{"type": "lucide", "icon": "book-open", "color": "#3b82f6"}`) |
| `favicon` | string/object | null | Path to favicon or Lucide icon with optional color |
| `search` | boolean | true | Enable search |
| `outline.enabled` | boolean | true | Show table of contents |
| `outline.depth` | array | [2, 3] | Heading levels to show |
| `outline.label` | string | "On this page" | TOC heading |

## Frontmatter

Add YAML frontmatter to any markdown file for ordering and metadata:

```markdown
---
title: Getting Started
order: 1
description: Introduction to the project
---

# Getting Started

Your content here...
```

**Frontmatter Fields:**

- `title` - Override page title in navigation
- `order` - Numeric sort order (lower numbers appear first)
- `description` - Page description for SEO

## Custom Components

fastdocs includes custom Vue components you can use in your markdown:

### SubPages

Show all child pages of the current section:

```markdown
# My Section

<SubPages />
```

### FullContents

Show the entire site structure (great for index pages):

```markdown
# Welcome

<FullContents />
```

## Folder Structure

fastdocs automatically generates navigation from your folder structure:

```
docs/
├── index.md              # Home page
├── guide/
│   ├── index.md         # Guide overview (makes folder clickable)
│   ├── getting-started.md
│   └── advanced.md
└── api/
    ├── index.md
    └── reference.md
```

**Tips:**
- Use `index.md` files as folder landing pages
- Add `order` in frontmatter to control sort order
- Folders without markdown files are hidden
- Nested folders create nested navigation

## Deployment

The build command generates a static site ready for any hosting platform:

### GitHub Pages

```bash
fastdocs build ./docs ./dist --base /repo-name/
# Deploy ./dist to gh-pages branch
```

### Netlify

```bash
fastdocs build ./docs ./dist
# Deploy ./dist directory
```

### Vercel

```bash
fastdocs build ./docs ./dist
# Deploy ./dist directory
```

## How It Works

fastdocs creates a temporary VitePress project outside your documentation directory, keeping your docs folder clean. When you run serve or build:

1. Scans your documentation directory
2. Generates VitePress configuration
3. Creates temporary project in system temp directory
4. Runs VitePress with `srcDir` pointing to your docs
5. Cleans up on exit

Your documentation folder stays pristine - no `node_modules`, no `.vitepress` folder, just your markdown files.

## Requirements

- Node.js 18 or higher

## License

MIT

## Credits

Built on [VitePress](https://vitepress.dev) - the Vite & Vue powered static site generator.
