---
title: Frontmatter
order: 4
---

# Frontmatter Support

Add YAML frontmatter to any markdown file for ordering and metadata.

## What is Frontmatter?

Frontmatter is YAML metadata at the top of a markdown file, enclosed by `---`:

```markdown
---
title: My Page
order: 1
description: A great page
---

# My Page Content

Your markdown content here...
```

## Available Fields

### title

Override the page title in navigation.

**Without frontmatter:**
```markdown
# Getting Started
```
Navigation shows: "getting-started" (from filename)

**With frontmatter:**
```markdown
---
title: Getting Started
---

# Getting Started
```
Navigation shows: "Getting Started"

### order

Control sort order in navigation.

```markdown
---
order: 1
---
```

- Lower numbers appear first
- Files without `order` appear last (sorted alphabetically)
- Great for creating a specific reading order

**Example:**
```
guide/
├── index.md (order: 1)
├── installation.md (order: 2)
└── configuration.md (order: 3)
```

### description

Page description for SEO.

```markdown
---
description: Learn how to install and configure the application
---
```

Used in:
- `<meta name="description">` tag
- Search engine results
- Social media previews

## Complete Example

```markdown
---
title: Advanced Configuration
order: 10
description: Deep dive into configuration options for power users
---

# Advanced Configuration

This guide covers advanced configuration scenarios...
```

## Best Practices

### Keep It Simple

Only use frontmatter when you need it. nlddoc works great without any frontmatter.

### Consistent Ordering

Choose an ordering strategy:

**Option 1: Numeric prefixes**
```
01-first.md
02-second.md
03-third.md
```

**Option 2: Frontmatter (cleaner)**
```markdown
---
order: 1
---
```

**Don't mix both** - pick one approach per project.

### Meaningful Titles

Use frontmatter titles to make navigation clearer:

```markdown
---
title: Getting Started
---

# Getting Started with nlddoc
```

Navigation shows the short title, page shows the full title.

## Common Patterns

### Guide Structure

```markdown
---
title: Installation
order: 1
description: How to install the application
---

# Installation Guide
```

### API Reference

```markdown
---
title: API Reference
order: 100
description: Complete API documentation
---

# API Reference
```
High `order` value pushes reference docs to the end.

### Changelog

```markdown
---
title: Changelog
order: 999
---

# Changelog
```

Very high order ensures changelog appears last.
