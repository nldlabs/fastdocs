---
title: nlddoc init
order: 2
---

# nlddoc init

Create a `.nlddoc` configuration file with default settings.

## Usage

```bash
nlddoc init [path]
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
nlddoc init
```

Creates `.nlddoc` in the current directory.

### Create in Specific Directory

```bash
nlddoc init ./docs
```

Creates `.nlddoc` in the `./docs` directory.

### Force Overwrite

```bash
nlddoc init --force
```

Overwrites existing `.nlddoc` without asking.

## Generated Config

The command creates a `.nlddoc` file with these defaults:

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

## Behavior

### Existing Config

If `.nlddoc` already exists, nlddoc will:
1. Prompt for confirmation
2. Overwrite only if you confirm "y"
3. Cancel if you answer anything else

Use `--force` to skip the prompt.

### Error Handling

If the directory doesn't exist or isn't writable, nlddoc will:
- Show an error message
- Exit with code 1

## Output

Success output:

```
📙 nlddoc init
────────────────────────────────────────────────────────────
● Loading /path/to/docs
────────────────────────────────────────────────────────────

✓ Configuration created!
────────────────────────────────────────────────────────────
  ● File: /path/to/docs/.nlddoc

  Edit .nlddoc to customize:
  • Site title and description
  • Logo and branding
  • Search and outline settings
────────────────────────────────────────────────────────────
  Next steps:
  $ nlddoc serve [path] # Preview your docs
  $ nlddoc build [path] [output] # Build static site
────────────────────────────────────────────────────────────
```

## Next Steps

After creating a config:

1. **Edit** `.nlddoc` to customize your site
2. **Serve** to preview: `nlddoc serve`
3. **Build** for deployment: `nlddoc build`

## Related

- [Configuration Guide](../Guide/configuration.md)
- [nlddoc serve](./serve.md)
- [nlddoc build](./build.md)
