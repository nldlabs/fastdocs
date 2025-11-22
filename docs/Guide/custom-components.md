---
title: Custom Components
order: 5
---

# Custom Components

nlddoc includes custom Vue components you can use in your markdown files.

## SubPages

Display all child pages of the current section.

### Usage

```markdown
# My Section

<SubPages />
```

### When to Use

Perfect for section overview pages:

```markdown
# API Reference

This section covers all available APIs.

<SubPages />
```

This automatically lists all pages in the same directory or section.

### Example Output

If you have:
```
api/
├── index.md
├── authentication.md
├── users.md
└── posts.md
```

`<SubPages />` in `api/index.md` will show:
- Authentication
- Users
- Posts

## FullContents

Display the entire site structure.

### Usage

```markdown
# Welcome

<FullContents />
```

### When to Use

Ideal for homepage or overview pages:

```markdown
# Documentation

Welcome to our documentation. Browse all sections below:

<FullContents />
```

### Example Output

Shows the complete navigation tree:
- Guide
  - Getting Started
  - Folder Structure
  - Configuration
- API
  - Authentication
  - Reference
- Deployment
  - GitHub Pages
  - Netlify

## Styling

Both components use VitePress theme colors and adapt to dark/light mode automatically.

## Tips

### Combine with Content

```markdown
# Welcome

Get started quickly with our comprehensive guides.

## All Documentation

<FullContents />

## Need Help?

Check our [FAQ](./faq) or open an issue.
```

### Section Overviews

```markdown
# Deployment

Choose your hosting platform:

<SubPages />

All options support automatic deployments from Git.
```

### Multi-level Navigation

```markdown
# Complete Guide

## Quick Links

<SubPages />

## All Documentation

<FullContents />
```
