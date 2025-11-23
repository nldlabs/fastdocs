---
title: fastdocs build
order: 3
---

# fastdocs build

Build a static site from your documentation, ready for deployment.

## Usage

```bash
fastdocs build [input] [output] [options]
```

## Arguments

### input

Source documentation directory.

- **Type:** `string`
- **Default:** `.` (current directory)

### output

Output directory for built site.

- **Type:** `string`
- **Default:** `./dist`

## Options

### --base

Base URL path for deployment.

- **Type:** `string`
- **Default:** `/`

### --clean

Clean output directory without confirmation.

- **Type:** `boolean`
- **Default:** `false`

### --skip-link-checking

Skip link validation before building.

- **Type:** `boolean`
- **Default:** `false`
- **Warning:** Not recommended - may result in broken links in deployed documentation

## Examples

### Build with Defaults

```bash
fastdocs build
```

Builds current directory to `./dist`.

### Specify Input and Output

```bash
fastdocs build ./docs ./public
```

Builds `./docs` to `./public`.

### Deploy to Subdirectory

```bash
fastdocs build ./docs ./dist --base /my-project/
```

For deploying to `https://example.com/my-project/`.

### Skip Confirmation

```bash
fastdocs build ./docs ./dist --clean
```

### Skip Link Checking

**Not recommended** - only use if link checker has a bug:

```bash
fastdocs build ./docs ./dist --skip-link-checking
```

This bypasses link validation and may result in broken links in your deployed documentation.

Overwrites output without asking.

## How It Works

When you run `build`, fastdocs:

1. **Validates** input directory exists and contains `.md` files
2. **Prompts** if output directory exists (unless `--clean`)
3. **Checks links** - validates all local markdown links
4. **Fails** if broken links found (prevents broken deployments)
5. **Loads** configuration from `.fastdocs`
6. **Creates** temporary VitePress project
7. **Copies** markdown files to temp directory
8. **Installs** dependencies
9. **Builds** static site with VitePress
10. **Copies** built files to output directory
11. **Cleans** up temporary directory

## Output

### Successful Build

```
📖  Fastdocs build
────────────────────────────────────────────────────────────
● Loading /path/to/docs
● Output /path/to/dist
────────────────────────────────────────────────────────────
🔍 Checking links...

✓ All links valid
────────────────────────────────────────────────────────────

✓ Build complete!
────────────────────────────────────────────────────────────
  ● Output: /path/to/dist

  Ready to deploy! Upload the output directory to any static host.
────────────────────────────────────────────────────────────
```

### Build Failed (Broken Links)

```
📖  Fastdocs build
────────────────────────────────────────────────────────────
● Loading /path/to/docs
● Output /path/to/dist
────────────────────────────────────────────────────────────
🔍 Checking links...

✗ Build failed: broken links detected
────────────────────────────────────────────────────────────
  ● guide/index.md
    → ./missing.md (line 25)

  ● api/reference.md
    → ../config.md (line 10)
────────────────────────────────────────────────────────────
  Fix the broken links above and try again.
  You can also run fastdocs check-links to see the full report.
────────────────────────────────────────────────────────────
```

The build will not proceed if broken links are found.

## Base URL

The `--base` option is crucial for subdirectory deployments.

### Root Deployment

Deploying to `https://example.com/`:

```bash
fastdocs build ./docs ./dist
```

No `--base` needed (defaults to `/`).

### Subdirectory Deployment

Deploying to `https://example.com/docs/`:

```bash
fastdocs build ./docs ./dist --base /docs/
```

**Important:** Include leading and trailing slashes!

### GitHub Pages (User Site)

For `https://username.github.io/`:

```bash
fastdocs build ./docs ./dist
```

### GitHub Pages (Project Site)

For `https://username.github.io/repo-name/`:

```bash
fastdocs build ./docs ./dist --base /repo-name/
```

## Build Output

The output directory contains a complete static site:

```
dist/
├── index.html
├── guide/
│   ├── index.html
│   └── configuration.html
├── assets/
│   ├── app.js
│   ├── style.css
│   └── ...
└── ...
```

All files are optimized:
- Minified JavaScript and CSS
- Optimized images
- Prerendered HTML for SEO

## Overwrite Behavior

### Without --clean

If output directory exists, fastdocs prompts:

```
Output directory exists: /path/to/dist
Overwrite? (y/N)
```

- Type `y` to overwrite
- Type anything else to cancel

### With --clean

Automatically overwrites without asking:

```bash
fastdocs build --clean
```

Use in CI/CD pipelines where prompts aren't possible.

## Deployment

The built site works with any static hosting:

### GitHub Pages

```bash
fastdocs build ./docs ./dist --base /repo-name/
# Push dist/ to gh-pages branch
```

### Netlify

```bash
fastdocs build ./docs ./dist
# Deploy dist/ directory
```

### Vercel

```bash
fastdocs build ./docs ./dist
# Deploy dist/ directory
```

### Cloudflare Pages

```bash
fastdocs build ./docs ./dist
# Deploy dist/ directory
```

### AWS S3

```bash
fastdocs build ./docs ./dist
aws s3 sync ./dist s3://my-bucket --delete
```

## CI/CD Examples

### GitHub Actions

```yaml
- name: Build docs
  run: npx fastdocs build ./docs ./dist --clean --base /repo-name/

- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

### GitLab CI

```yaml
build:
  script:
    - npx fastdocs build ./docs ./public --clean
  artifacts:
    paths:
      - public
```

## Troubleshooting

### Assets Not Loading

Check your `--base` setting:

```bash
# Wrong (missing slashes)
fastdocs build --base my-project

# Correct
fastdocs build --base /my-project/
```

### Build Fails

Common causes:
- Invalid markdown syntax
- Broken links in markdown
- Invalid `.fastdocs` configuration

Check the error message for details.

**Broken links:** The build automatically checks for broken internal links. If found, the build fails with details about which files have broken links. Fix the links or use `--skip-link-checking` to bypass (not recommended).

### Link Checker False Positive

If the link checker incorrectly reports a valid link as broken:

1. **First, verify the link is actually valid**
   - File exists at the path
   - Path is correct (case-sensitive on Linux)
   - File has `.md` extension

2. **Report the bug**
   - [Open an issue](https://github.com/nldlabs/fastdocs/issues) with the false positive

3. **Temporary workaround**
   ```bash
   fastdocs build --skip-link-checking
   ```
   
   This bypasses link validation entirely. Use with caution as it may allow broken links in your deployed docs.

### Output Not Updated

Ensure you're overwriting the old build:

```bash
fastdocs build --clean
```

## Performance

Build times depend on:
- Number of markdown files
- Total content size
- First-time dependency installation

Typical build: 10-30 seconds for 50-100 pages.

## Related

- [fastdocs check-links](./check-links.md)
- [fastdocs serve](./serve.md)
- [Deployment Guide](../Deployment/index.md)
- [Configuration](../Guide/configuration.md)
