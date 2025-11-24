---
title: fastdocs init
order: 2
---

# fastdocs init

Create a `.fastdocs` configuration file with default settings.

## Usage

```bash
fastdocs init [path]
```

## Arguments

### path

Directory to create config in.

- **Type:** `string`
- **Default:** `.` (current directory)

## Options

### --force, -f

Overwrite existing configuration without confirmation.

- **Type:** `boolean`
- **Default:** `false`

## Examples

### Create in Current Directory

```bash
fastdocs init
```

Creates `.fastdocs` in the current directory.

### Create in Specific Directory

```bash
fastdocs init ./docs
```

Creates `.fastdocs` in the `./docs` directory.

### Force Overwrite

```bash
fastdocs init --force
```

Overwrites existing `.fastdocs` without asking.

## Generated Config

The command creates a `.fastdocs` file with these defaults:

```json
{
  "title": "My Documentation",
  "description": "Documentation for my project",
  "logo": {
    "type": "lucide",
    "icon": "book-open",
    "color": "#62d144"
  },
  "favicon": {
    "type": "lucide",
    "icon": "book-open",
    "color": "#62d144"
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

## Behavior

### Existing Config

If `.fastdocs` already exists, fastdocs will:
1. Prompt for confirmation
2. Overwrite only if you confirm "y"
3. Cancel if you answer anything else

Use `--force` to skip the prompt.

### Error Handling

If the directory doesn't exist or isn't writable, fastdocs will:
- Show an error message
- Exit with code 1

## Output

Success output:

```
📖  Fastdocs init
────────────────────────────────────────────────────────────
● Loading /path/to/docs
────────────────────────────────────────────────────────────

✓ Configuration created!
────────────────────────────────────────────────────────────
  ● File: /path/to/docs/.fastdocs

  Edit .fastdocs to customize:
  • Site title and description
  • Logo and branding
  • Search and outline settings
────────────────────────────────────────────────────────────
  Next steps:
  $ fastdocs serve [path] # Preview your docs
  $ fastdocs build [path] [output] # Build static site
────────────────────────────────────────────────────────────
```

## Next Steps

After creating a config:

1. **Edit** `.fastdocs` to customize your site
2. **Serve** to preview: `fastdocs serve`
3. **Build** for deployment: `fastdocs build`

## Related

- [Configuration Guide](../Guide/configuration.md)
- [fastdocs serve](./serve.md)
- [fastdocs build](./build.md)
