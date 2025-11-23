---
title: Using AI to Generate Docs
order: 4
---

# Using AI to Generate Documentation

AI assistants like GitHub Copilot can help you create and maintain documentation for nlddoc. Here's how to set them up effectively.

## Copilot Instructions File

Create a `.github/copilot-instructions.md` file in your project to guide AI assistants:

````markdown
# Documentation Guidelines

This project uses nlddoc for documentation. Follow these conventions:

## Structure

All documentation lives in the `/docs` folder with this structure:

```
docs/
├── index.md          # Homepage
├── .nlddoc           # Configuration file
├── section-name/
│   ├── index.md      # Section landing page
│   └── topic.md      # Individual pages
└── images/           # Images and assets
```

## Frontmatter

Every markdown file should include frontmatter:

```yaml
---
title: Page Title
order: 1
description: Optional page description
---
```

- `title`: Display name in navigation (required for proper sidebar)
- `order`: Lower numbers appear first (use for custom sorting)
- `description`: Used for SEO and page metadata

## Components

Use these custom components in markdown:

**SubPages Component**
Shows all child pages in the current section. Use in section landing pages:

```markdown
# Section Name

Brief introduction to this section.

<SubPages />
```

**FullContents Component**
Shows entire site structure. Use on homepage or overview pages:

```markdown
# Welcome

Site introduction.

<FullContents />
```

## Navigation

- Sidebar is auto-generated from folder structure
- Folders become collapsible sections
- Add `index.md` to make folders clickable
- Use `order` in frontmatter to control sort order
- Files without frontmatter sort alphabetically

## Configuration

The `.nlddoc` file controls site settings:

```json
{
  "title": "Project Name",
  "description": "Project description",
  "logo": {
    "type": "lucide",
    "icon": "book-open",
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

**Logo options:**
- Lucide icon: `"lucide:icon-name"` or object with color
- Image file: `"./logo.svg"`
- Browse icons: https://lucide.dev/icons

## Commands

Preview documentation locally:
```bash
npx nlddoc serve ./docs
```

Build static site:
```bash
npx nlddoc build ./docs ./output
```

Create config file:
```bash
npx nlddoc init ./docs
```

## Writing Guidelines

- Use clear, descriptive headings
- Keep paragraphs short (2-4 sentences)
- Use code blocks with language tags
- Include examples for technical concepts
- Add links between related pages
- Use relative links: `[link](./other-page.md)`
- Place images in `images/` folder
- Reference images: `![alt](./images/pic.png)`

## Best Practices

1. **Start with structure**: Create folder structure and index.md files first
2. **Use frontmatter consistently**: Always include title and order
3. **Link related content**: Help users navigate between topics
4. **Add SubPages to sections**: Makes navigation discoverable
5. **Keep it simple**: Focus on clarity over complexity
````

## Example Prompt for AI

When asking AI to help with documentation:

> "Create documentation for [feature/topic] following our nlddoc structure. Include:
> - Frontmatter with title and order
> - Clear headings and examples
> - Links to related pages
> - SubPages component if this is a section landing page
> 
> The file should go in `docs/[section-name]/[topic-name].md`"

## Using GitHub Copilot Chat

Ask Copilot to help structure your docs:

```
@workspace Create a Getting Started guide in docs/getting-started.md 
with frontmatter, code examples, and links to other sections.
```

Or generate a whole section:

```
@workspace Create a new API Reference section in docs/api/ with 
index.md and pages for each endpoint. Include frontmatter and SubPages.
```

## AI-Friendly Patterns

### Section Landing Pages

```markdown
---
title: Section Name
order: 1
---

# Section Name

Brief overview of what this section covers.

## What You'll Learn

- Topic 1
- Topic 2
- Topic 3

<SubPages />
```

### Individual Topic Pages

```markdown
---
title: Topic Name
order: 2
---

# Topic Name

Introduction to the topic.

## Overview

Explanation...

## Example

\`\`\`bash
npx nlddoc serve ./docs
\`\`\`

## Next Steps

- [Related Topic](./related.md)
- [Another Topic](./another.md)
```

### Homepage

```markdown
---
title: Documentation
order: 1
---

# Project Name

Project tagline or description.

## Quick Start

Getting started steps...

## Documentation

<FullContents />
```

## Configuration Template

Ask AI to generate a `.nlddoc` file:

> "Create a .nlddoc configuration for a [type of project] with a 
> [color] [icon-name] icon"

Example output:

```json
{
  "title": "API Documentation",
  "description": "Complete API reference and guides",
  "logo": {
    "type": "lucide",
    "icon": "code-2",
    "color": "#3b82f6"
  },
  "favicon": {
    "type": "lucide",
    "icon": "code-2",
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

## Common AI Tasks

### Generate Table of Contents

> "Create an index.md for the docs/api/ section that introduces the 
> API and uses SubPages to show all endpoints"

### Create Migration Guide

> "Write a migration guide in docs/guides/migration.md with frontmatter, 
> before/after code examples, and step-by-step instructions"

### Build FAQ Section

> "Create a FAQ page in docs/faq.md with common questions about 
> [topic], include frontmatter with order: 99 so it appears last"

### Add Cross-References

> "Review docs/guides/ and add relevant links between related topics"

## Tips for Better AI Results

1. **Be specific about structure**: Mention folders, filenames, and frontmatter
2. **Request examples**: Ask for code blocks and real-world scenarios
3. **Specify components**: Remind AI to use SubPages or FullContents where appropriate
4. **Include context**: Reference existing pages that should be linked
5. **Request frontmatter**: Always ask for proper title and order values

## Iterating with AI

Start broad, then refine:

```
1. "Create a basic outline for API documentation"
2. "Expand the Authentication section with examples"
3. "Add error handling examples to each endpoint"
4. "Link related endpoints together"
```

## Maintaining Documentation

Use AI to keep docs fresh:

> "@workspace Find all references to version 1.0 and update them to 2.0"

> "@workspace Check for broken links in the docs folder"

> "@workspace Add missing frontmatter to files in docs/guides/"

## Example Project Structure

A complete docs folder generated with AI assistance:

```
docs/
├── .nlddoc
├── index.md                    # order: 1
├── getting-started.md          # order: 2
├── guides/
│   ├── index.md               # order: 3
│   ├── installation.md        # order: 1
│   ├── configuration.md       # order: 2
│   └── deployment.md          # order: 3
├── api/
│   ├── index.md               # order: 4
│   ├── authentication.md      # order: 1
│   ├── endpoints.md           # order: 2
│   └── errors.md              # order: 3
├── examples/
│   ├── index.md               # order: 5
│   ├── basic.md               # order: 1
│   └── advanced.md            # order: 2
├── faq.md                      # order: 99
└── images/
    └── screenshot.png
```

## Resources

- [nlddoc Guide](./index.md)
- [Configuration Reference](./configuration.md)
- [Custom Components](./custom-components.md)
- [Frontmatter Guide](./Frontmatter.md)
- [Lucide Icons](https://lucide.dev/icons)
