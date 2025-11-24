---
title: Customizing Your Site
order: 3
---

# Customizing Your Site

Fast Docs works great without any setup. But if you want to customize things like the title or logo, here's how.

## Creating a Settings File

In your docs folder, run:

```bash
npx fastdocs init
```

This creates a file called `.fastdocs` with these settings:

```json
{
  "title": "My Documentation",
  "description": "Documentation for my project",
  "logo": null,
  "favicon": null,
  "search": true,
  "sidebar": {
    "collapsed": false
  },
  "outline": {
    "enabled": true,
    "depth": [2, 3],
    "label": "On this page"
  }
}
```

## Changing Settings

Open `.fastdocs` in any text editor and change what you want:

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

You have several options for adding a logo:

**Option 1: Use a Lucide Icon (Easiest)**

Simple icon-only:

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

**Option 2: Use an Image File**

1. Put your logo file (like `logo.png`) in your docs folder
2. Update the settings:

```json
{
  "logo": "./logo.png"
}
```

Your logo appears in the top-left corner. For a complete list of available icons, see the [Icons Guide](./icons.md).

### Add a Favicon

Set a favicon (the small icon in browser tabs):

**Using a Lucide icon:**

```json
{
  "favicon": "lucide:book-open"
}
```

With custom color:

```json
{
  "favicon": {
    "type": "lucide",
    "icon": "bookmark",
    "color": "#8b5cf6"
  }
}
```

**Using an image file:**

```json
{
  "favicon": "./favicon.ico"
}
```

### Turn Off Search

```json
{
  "search": false
}
```

### Collapse Sidebar Folders

By default, all folders in the sidebar are expanded. To collapse them:

```json
{
  "sidebar": {
    "collapseFolders": true
  }
}
```

Users can still click to expand folders they want to see.

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
  "logo": {
    "type": "lucide",
    "icon": "chef-hat",
    "color": "#f59e0b"
  },
  "favicon": {
    "type": "lucide",
    "icon": "chef-hat",
    "color": "#f59e0b"
  },
  "search": true,
  "sidebar": {
    "collapseFolders": false
  },
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

### Icon vs Image Files

**Use Lucide icons when:**
- You want something quick and easy
- You need perfect scaling at any size
- You want to match your brand color

**Use image files when:**
- You have a custom logo design
- You need a specific graphic or wordmark

### Logo Guidelines

**For image files:**
- PNG, JPG, or SVG files work
- Keep it small (around 40 pixels tall)
- Transparent background looks best

**For icons:**
- Browse [lucide.dev/icons](https://lucide.dev/icons) for options
- Use hex colors like `#3b82f6` for custom colors
- Popular choices: `book-open`, `code`, `rocket`, `zap`

### Check Your Commas

JSON is picky about commas. Each line needs a comma EXCEPT the last one:

```json
{
  "title": "My Site",     ← comma
  "search": true          ← no comma (it's last)
}
```
