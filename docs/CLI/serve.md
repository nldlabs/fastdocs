---
title: nlddoc serve
order: 1
---

# nlddoc serve

Start a local development server to view your documentation with hot reload.

## Usage

```bash
nlddoc serve [path] [options]
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
nlddoc serve
```

Serves docs from current directory on `http://localhost:5173`.

### Serve Specific Directory

```bash
nlddoc serve ./docs
```

Serves docs from `./docs` directory.

### Custom Port

```bash
nlddoc serve --port 3000
```

Runs server on port 3000.

### Allow Network Access

```bash
nlddoc serve --host
```

Makes server accessible from other devices on your network.

### Combine Options

```bash
nlddoc serve ./docs --port 8080 --host
```

## How It Works

When you run `serve`, nlddoc:

1. **Validates** the docs directory exists and contains `.md` files
2. **Loads** configuration from `.nlddoc` (if it exists)
3. **Creates** a temporary VitePress project in system temp directory
4. **Installs** dependencies (vitepress, etc.)
5. **Starts** VitePress dev server with hot reload
6. **Watches** for file changes

Your docs directory stays clean - no `node_modules`, no build artifacts.

## Output

```
📙 nlddoc
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
  $ nlddoc build [docs-path] [output-path]

  Powered by VitePress - advanced Markdown support
  https://vitepress.dev/guide/markdown
────────────────────────────────────────────────────────────
```

## Hot Reload

Changes to your markdown files are reflected instantly:

- **Edit** a `.md` file → Browser refreshes automatically
- **Add** a new file → Navigation updates immediately
- **Delete** a file → Removed from navigation
- **Rename** a folder → Navigation restructures

## Cleanup

Press `Ctrl+C` to stop the server. nlddoc automatically:
- Stops the VitePress dev server
- Cleans up the temporary project directory

## Troubleshooting

### Port Already in Use

If port 5173 is busy:

```bash
nlddoc serve --port 3000
```

### No Markdown Files

If you see "No markdown files found":
- Check the path is correct
- Ensure `.md` files exist in the directory or subdirectories

### Config Parse Error

If `.nlddoc` has syntax errors:
- nlddoc shows a warning
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

Edit `.nlddoc` while the server is running:
- Some changes require restart
- File structure changes update automatically

### Network Preview

Use `--host` to preview on mobile devices:

```bash
nlddoc serve --host
```

Then open the Network URL on your phone/tablet.

## Related

- [nlddoc build](./build.md)
- [Configuration](../Guide/configuration.md)
- [Folder Structure](../Guide/folder-structure.md)
