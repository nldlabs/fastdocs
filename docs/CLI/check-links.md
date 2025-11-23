---
title: fastdocs check-links
order: 2
---

# fastdocs check-links

Check all local markdown links in your documentation for broken references.

## Why Check Links?

Broken links to other markdown files will cause **VitePress build errors**, preventing deployment. The link checker helps you find and fix these issues before building.

When VitePress builds your documentation, it validates all internal links. If any markdown file links to a non-existent file, the build fails with an error like:

```
[vitepress] 3 dead link(s) found.
```

The `check-links` command finds these issues early, showing you exactly which files have broken links and where they are in your code.

## Usage

```bash
fastdocs check-links [path]
```

## Arguments

### path

Path to documentation directory to check.

- **Type:** `string`
- **Default:** `.` (current directory)

## Examples

### Check Current Directory

```bash
fastdocs check-links
```

Checks all links in the current directory.

### Check Specific Directory

```bash
fastdocs check-links ./docs
```

Checks all links in the `./docs` directory.

## How It Works

The link checker:

1. **Finds** all `.md` files recursively
2. **Extracts** local markdown links: `[text](./path.md)`, `[text](../other.md)`, `[text](/absolute.md)`
3. **Skips** external links (`http://`, `https://`)
4. **Skips** links inside code blocks (fenced and inline)
5. **Validates** each link target exists
6. **Reports** broken links with file paths and line numbers

## Output

### No Broken Links

```
🔗 Link Check Results
────────────────────────────────────────────────────────────

✓ All links are valid!

────────────────────────────────────────────────────────────
```

### Broken Links Found

```
🔗 Link Check Results
────────────────────────────────────────────────────────────

✗ Found 3 broken link(s) in 2 file(s)

  guide/getting-started.md:
    Line 25: ./setup.md
    Text: "Setup Guide"

    Line 42: ../assets/logo.png
    Text: "Logo"

  api/index.md:
    Line 10: /guide/missing.md
    Text: "Missing Page"

────────────────────────────────────────────────────────────

  Fix these links to ensure proper navigation.
  Note: Broken links will cause build errors.

────────────────────────────────────────────────────────────
```

## Link Types Checked

### Relative Links

```markdown
[Same folder](./other.md)
[Parent folder](../guide.md)
[With anchor](./page.md#section)
```

### Absolute Links

```markdown
[From root](/guide/index.md)
[Absolute path](/api/reference.md)
```

### Images

```markdown
![Alt text](./images/diagram.png)
![Relative](../assets/icon.svg)
```

## What's Ignored

### External URLs

```markdown
[External](https://example.com)
[Protocol-relative](//cdn.example.com/file.js)
```

These are skipped - only local file links are checked.

### Code Blocks

````markdown
This link is checked: [Guide](./guide.md)

But these are ignored:

```markdown
[Not checked](./fake.md)
```

Inline code with single backticks: `[Also ignored](./fake.md)`

Wrapped in backticks: `[Not checked](./fake.md)` is also ignored
````

### Anchors Only

```markdown
[Jump to section](#heading)
```

Links without file paths are skipped.

## Integration with Other Commands

### serve

When running `fastdocs serve`, the link checker runs automatically:
- Checks links when server starts
- Rechecks after file changes
- Shows warnings for broken links
- Server continues running

**Example output:**

```
✓ Server ready!
────────────────────────────────────────────────────────────
  ● Local:    http://localhost:5173/

  Serving /path/to/docs
  Press Ctrl+C to stop
────────────────────────────────────────────────────────────

⚠ Warning: broken links detected
────────────────────────────────────────────────────────────
  ● guide/setup.md
    → ./missing-page.md (line 15)

────────────────────────────────────────────────────────────
  Fix these links to ensure your documentation works correctly.
  Note: Broken links will cause build errors.
  Run fastdocs check-links for the full report.
────────────────────────────────────────────────────────────
```

### build

When running `fastdocs build`, the link checker runs automatically:
- Checks links before building
- **Fails the build** if broken links found
- Shows detailed error report
- Prevents deployment of broken docs

**Example output:**

```
📖  Fastdocs build
────────────────────────────────────────────────────────────
● Loading /path/to/docs
● Output /path/to/dist
────────────────────────────────────────────────────────────

🔍 Checking links...

✗ Build failed: broken links detected
────────────────────────────────────────────────────────────
  ● guide/setup.md
    → ./missing-page.md (line 15)

  ● api/index.md
    → ../config.md (line 42)

────────────────────────────────────────────────────────────
  Fix the broken links above and try again.
  You can also run fastdocs check-links to see the full report.
────────────────────────────────────────────────────────────
```

The build will not proceed, **preventing broken documentation from being deployed**.

## Exit Codes

- **0** - All links valid
- **1** - Broken links found or error occurred

Useful in CI/CD scripts:

```bash
#!/bin/bash
fastdocs check-links ./docs
if [ $? -eq 0 ]; then
  echo "Links OK, proceeding with build"
  fastdocs build ./docs ./dist
else
  echo "Fix broken links before deploying"
  # Or skip link checking if you believe it's a false positive
  # fastdocs build ./docs ./dist --skip-link-checking
  exit 1
fi
```

## Common Issues

### False Positives

If a valid link is reported as broken:

1. Check the file actually exists
2. Verify the path is correct (case-sensitive on Linux)
3. Ensure the file has `.md` extension
4. Check the link isn't in a code block (should be auto-skipped)

**Still having issues?**

- [Report a bug](https://github.com/nldlabs/fastdocs/issues) with the false positive
- Temporary workaround for builds:
  ```bash
  fastdocs build --skip-link-checking
  ```
  ⚠️ **Warning:** This bypasses all link validation. Use only as a last resort.

### Links in Code Examples

Links in code blocks are automatically ignored. If you're documenting markdown syntax, use code blocks:

````markdown
Example link syntax:
```markdown
[Link](./path.md)
```
````

### Directory Index Links

These are all valid:

```markdown
[Folder](./guide/)          → checks for guide/index.md
[Explicit](./guide/index.md) → checks for guide/index.md
[No extension](./guide/index) → checks for guide/index.md
```

## Troubleshooting

### "Directory not found"

Ensure the path exists:

```bash
fastdocs check-links /path/to/docs
```

### "No markdown files found"

The directory must contain at least one `.md` file.

### Slow on Large Projects

The checker scans all markdown files recursively. For very large projects (1000+ files), this may take a few seconds.

## Best Practices

### Before Committing

```bash
fastdocs check-links
```

Catch broken links before they reach production.

### In CI/CD

```yaml
# GitHub Actions example
- name: Check links
  run: npx fastdocs check-links ./docs
```

Prevent broken docs from being deployed.

### After Reorganizing

Moved or renamed files? Check links:

```bash
fastdocs check-links
```

Find all references that need updating.

## Related

- [fastdocs serve](./serve.md) - Auto-checks during development
- [fastdocs build](./build.md) - Auto-checks before building
- [Folder Structure](../Guide/folder-structure.md)
