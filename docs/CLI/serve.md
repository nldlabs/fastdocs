---
title: fastdocs serve
order: 1
---

# fastdocs serve

Start a local development server to view your documentation with hot reload.

## Usage

```bash
fastdocs serve [path] [options]
```

## Arguments

### path

Path to documentation directory.

- **Type:** `string`
- **Default:** `.` (current directory)

## Options

### --port, -p

Port number for the dev server.

- **Type:** `number`
- **Default:** `5173`

### --host

Allow external network access.

- **Type:** `boolean`
- **Default:** `false`

### --no-open

Don't open browser automatically.

- **Type:** `boolean`
- **Default:** `false`

## Examples

### Serve Current Directory

```bash
fastdocs serve
```

Serves docs from current directory on `http://localhost:5173`.

### Serve Specific Directory

```bash
fastdocs serve ./docs
```

Serves docs from `./docs` directory.

### Custom Port

```bash
fastdocs serve --port 3000
```

Runs server on port 3000.

### Allow Network Access

```bash
fastdocs serve --host
```

Makes server accessible from other devices on your network.

### Combine Options

```bash
fastdocs serve ./docs --port 8080 --host
```

## How It Works

When you run `serve`, fastdocs:

1. **Validates** the docs directory exists and contains `.md` files
2. **Loads** configuration from `.fastdocs` (if it exists)
3. **Creates** a temporary VitePress project in system temp directory
4. **Installs** dependencies (vitepress, etc.)
5. **Starts** VitePress dev server with hot reload
6. **Watches** for file changes

Your docs directory stays clean - no `node_modules`, no build artifacts.

## Output

```
📖  Fastdocs
────────────────────────────────────────────────────────────
● Loading /path/to/docs
────────────────────────────────────────────────────────────

✓ Server ready!
────────────────────────────────────────────────────────────
  ● Local:    http://localhost:5173
  ● Network:  http://192.168.1.5:5173

  Serving /path/to/docs
  Press Ctrl+C to stop
────────────────────────────────────────────────────────────
  Tip: Generate static site for deployment:
  $ fastdocs build [docs-path] [output-path]

  Powered by VitePress - advanced Markdown support
  https://vitepress.dev/guide/markdown
────────────────────────────────────────────────────────────
```

## Link Checking

The serve command automatically checks for broken links:

- **On startup** - Validates all local markdown links
- **After changes** - Rechecks when files are modified
- **Shows warnings** - Displays broken links without stopping server

If broken links are found, you'll see:

```
⚠ Warning: broken links detected
────────────────────────────────────────────────────────────
  ● guide/index.md:
    → ./missing.md (line 42)
────────────────────────────────────────────────────────────
  Fix these links to ensure your documentation works correctly.
  Note: Broken links will cause build errors.
  Run fastdocs check-links for the full report.
────────────────────────────────────────────────────────────
```

Fix broken links during development to avoid build failures.

## Hot Reload

Changes to your markdown files are reflected instantly:

- **Edit** a `.md` file → Browser refreshes automatically
- **Add** a new file → Navigation updates immediately
- **Delete** a file → Removed from navigation
- **Rename** a folder → Navigation restructures

## Cleanup

Press `Ctrl+C` to stop the server. fastdocs automatically:
- Stops the VitePress dev server
- Cleans up the temporary project directory

## Troubleshooting

### Port Already in Use

If port 5173 is busy:

```bash
fastdocs serve --port 3000
```

### No Markdown Files

If you see "No markdown files found":
- Check the path is correct
- Ensure `.md` files exist in the directory or subdirectories

### Config Parse Error

If `.fastdocs` has syntax errors:
- fastdocs shows a warning
- Falls back to default configuration
- Server continues running

## Development Tips

### Watch Multiple Sections

Keep the dev server running while you:
- Edit multiple files
- Reorganize folders
- Update frontmatter

All changes reflect instantly.

### Preview Configuration

Edit `.fastdocs` while the server is running:
- Some changes require restart
- File structure changes update automatically

### Network Preview

Use `--host` to preview on mobile devices:

```bash
fastdocs serve --host
```

Then open the Network URL on your phone/tablet.

## Related

- [fastdocs check-links](./check-links.md)
- [fastdocs build](./build.md)
- [Configuration](../Guide/configuration.md)
- [Folder Structure](../Guide/folder-structure.md)
