---
title: Getting Started
order: 1
---

# Getting Started

This guide will walk you through using nlddoc for the first time. No prior experience needed.

## What You'll Need

Just Node.js 18 or higher. Check if you have it:

```bash
node --version
```

If you see `v18.0.0` or higher, you're ready. If not, download it from [nodejs.org](https://nodejs.org).

## Your First Documentation Site

Let's say you have a folder of markdown files:

```
my-project/
├── README.md
├── guide.md
└── api.md
```

### Step 1: View Your Docs

Open a terminal in that folder and run:

```bash
npx nlddoc serve .
```

That's it! Your browser opens showing your documentation with:
- Navigation built from your files
- Search working automatically
- Hot reload when you edit

The `.` means "current directory". You can also specify a path:

```bash
npx nlddoc serve ./docs
```

### Step 2: Try Editing

With the server running, open any markdown file and make a change. Save it. Your browser updates instantly. No refresh needed.

### Step 3: Build a Website

When you're ready to deploy, build a static site:

```bash
npx nlddoc build . ./website
```

This creates a `website` folder with HTML files you can upload anywhere. The first argument is your docs folder, the second is where to put the output.

## Customizing Your Site

By default, nlddoc just works. But you can customize things.

### Create a Config File

In your docs folder:

```bash
npx nlddoc init
```

This creates `.nlddoc` with settings you can edit:

```json
{
  "title": "My Documentation",
  "description": "Documentation for my project",
  "logo": {
    "type": "lucide",
    "icon": "snowflake",
    "color": "#fd9a00"
  },
  "favicon": {
    "type": "lucide",
    "icon": "snowflake",
    "color": "#fd9a00"
  },
  "search": true,
  "outline": {
    "enabled": true,
    "depth": [2, 3],
    "label": "On this page"
  }
}
```

Open `.nlddoc` in any text editor and change what you want. The server picks up changes automatically.

### Common Customizations

**Change the title:**
```json
{
  "title": "My Project Docs"
}
```

**Add a logo icon:**
```json
{
  "logo": {
    "type": "lucide",
    "icon": "rocket",
    "color": "#3b82f6"
  }
}
```

Browse icons at [lucide.dev/icons](https://lucide.dev/icons).

**Use your own logo image:**
```json
{
  "logo": "./logo.svg"
}
```

**Turn off search:**
```json
{
  "search": false
}
```

See the [Configuration Guide](../Guide/configuration.md) for all options.

## Organizing Your Docs

nlddoc automatically creates navigation from your folder structure:

```
docs/
├── index.md          # Home page
├── getting-started.md
├── guide/
│   ├── index.md      # Guide landing page
│   ├── basics.md
│   └── advanced.md
└── api/
    ├── index.md
    └── reference.md
```

This becomes:
- Getting Started
- Guide
  - Basics
  - Advanced
- API
  - Reference

### Controlling Order

By default, files are alphabetically sorted. Control order with frontmatter:

```markdown
---
order: 1
---

# Getting Started

This appears first because order: 1
```

Lower numbers appear first.

### Making Sections Clickable

Add an `index.md` file to any folder to make it clickable in navigation:

```markdown
# Guide

Welcome to the guide!

<SubPages />
```

The `<SubPages />` component shows links to child pages.

## Next Steps

Now that you've got the basics:

- Read the [Configuration Guide](../Guide/configuration.md) to customize your site
- Learn about [Frontmatter](../Guide/Frontmatter.md) for page metadata
- Check out [Deployment](../Deployment/index.md) to publish your docs

Or just start writing markdown and let nlddoc handle the rest.

## Quick Reference

**Serve docs locally:**
```bash
npx nlddoc serve ./docs
```

**Build static site:**
```bash
npx nlddoc build ./docs ./output
```

**Create config file:**
```bash
npx nlddoc init ./docs
```

**Use custom port:**
```bash
npx nlddoc serve ./docs --port 3000
```

**Build for subdirectory deployment:**
```bash
npx nlddoc build ./docs ./output --base /my-project/
```

Need help? Check the [FAQ](./faq.md) or [CLI Reference](../CLI/index.md).
