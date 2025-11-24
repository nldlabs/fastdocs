---
title: Organizing Your Files
order: 2
---

# How to Organize Your Files

fastdocs automatically creates a menu from your folders and files. Here's how it works.

## The Basics

Imagine you have this:

```
My Docs/
├── Welcome.md
├── Getting Started.md
└── Recipes.md
```

Your menu will show:
- Welcome
- Getting Started  
- Recipes

Simple!

## Using Folders

Want to group related pages? Use folders:

```
My Docs/
├── Welcome.md
├── Recipes/
│   ├── Breakfast.md
│   ├── Lunch.md
│   └── Dinner.md
└── Tips/
    ├── Shopping.md
    └── Storage.md
```

Your menu shows:
- Welcome
- Recipes
  - Breakfast
  - Lunch
  - Dinner
- Tips
  - Shopping
  - Storage

## Making Folders Clickable

Want a folder to have its own page? Create a file called `index.md` inside it:

```
Recipes/
├── index.md        ← This makes "Recipes" clickable
├── Breakfast.md
└── Lunch.md
```

Now when someone clicks "Recipes" in the menu, they see the `index.md` page.

### Controlling Folder Collapse State

You can control whether a specific folder is collapsed or expanded in the sidebar using frontmatter in its `index.md`:

```markdown
---
title: Advanced Topics
collapsed: true
---

# Advanced Topics

These topics are for experienced users.

<SubPages />
```

This overrides the global `sidebar.collapseFolders` setting for just this folder.

## Controlling the Order

By default, everything is sorted alphabetically. Want a specific order?

Add this to the top of any `.md` file:

```markdown
---
order: 1
---

# Your Page Title
```

Lower numbers appear first:
- `order: 1` appears before `order: 2`
- `order: 2` appears before `order: 3`
- Files without `order` appear last (alphabetically)

## Example: A Complete Site

```
Docs/
├── index.md              (order: 1)  - Homepage
├── Quick Start.md        (order: 2)  - Getting started
├── Guides/
│   ├── index.md         (order: 1)  - Guides overview
│   ├── Beginner.md      (order: 2)
│   └── Advanced.md      (order: 3)
└── FAQ.md               (order: 99) - Always last
```

Menu shows:
1. Home (from index.md)
2. Quick Start
3. Guides
   - Overview (from Guides/index.md)
   - Beginner
   - Advanced
4. FAQ

## Tips

### Give Files Clear Names

✅ Good:
- `Getting Started.md`
- `Installation Guide.md`
- `Troubleshooting.md`

❌ Harder to read:
- `doc1.md`
- `stuff.md`
- `readme.md`

### One Topic Per File

Instead of one huge file, split topics:

❌ One giant file:
```
Everything.md (50 pages long)
```

✅ Organized:
```
Introduction.md
Getting Started.md
Basics.md
Advanced Topics.md
```

### Hidden Files

Files starting with `.` or `_` won't appear in the menu:

```
Docs/
├── Public.md        ✓ Shows in menu
├── .draft.md        ✗ Hidden
└── _template.md     ✗ Hidden
```

Great for drafts and templates!
