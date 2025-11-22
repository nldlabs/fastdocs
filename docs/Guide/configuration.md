---
title: Customizing Your Site
order: 3
---

# Customizing Your Site

nlddoc works great without any setup. But if you want to customize things like the title or logo, here's how.

## Creating a Settings File

In your docs folder, run:

```bash
npx nlddoc init
```

This creates a file called `.nlddoc` with these settings:

```json
{
  "title": "My Documentation",
  "description": "Documentation for my project",
  "logo": null,
  "search": true,
  "outline": {
    "enabled": true,
    "depth": [2, 3],
    "label": "On this page"
  }
}
```

## Changing Settings

Open `.nlddoc` in any text editor and change what you want:

### Change the Site Title

```json
{
  "title": "My Awesome Recipes"
}
```

This appears in the browser tab and top of your site.

### Add a Description

```json
{
  "description": "All my favorite family recipes"
}
```

This helps with Google search results.

### Add a Logo

1. Put your logo file (like `logo.png`) in your docs folder
2. Update the settings:

```json
{
  "logo": "./logo.png"
}
```

Your logo appears in the top-left corner.

### Turn Off Search

```json
{
  "search": false
}
```

### Hide the Table of Contents

The table of contents is that list of headings on the right side.

```json
{
  "outline": {
    "enabled": false
  }
}
```

## Complete Example

```json
{
  "title": "Family Recipes",
  "description": "Grandma's secret recipes and more",
  "logo": "./cookbook.png",
  "search": true,
  "outline": {
    "enabled": true,
    "depth": [2, 3],
    "label": "On this page"
  }
}
```

## Tips

### Start Simple

You don't need a settings file to start. Only create one when you want to customize something.

### Logo Guidelines

- PNG, JPG, or SVG files work
- Keep it small (around 40 pixels tall)
- Transparent background looks best

### Check Your Commas

JSON is picky about commas. Each line needs a comma EXCEPT the last one:

```json
{
  "title": "My Site",     ← comma
  "search": true          ← no comma (it's last)
}
```
