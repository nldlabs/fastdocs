---
title: nlddoc build
order: 3
---

# nlddoc build

Build a static site from your documentation, ready for deployment.

## Usage

```bash
nlddoc build [input] [output] [options]
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

## Examples

### Build with Defaults

```bash
nlddoc build
```

Builds current directory to `./dist`.

### Specify Input and Output

```bash
nlddoc build ./docs ./public
```

Builds `./docs` to `./public`.

### Deploy to Subdirectory

```bash
nlddoc build ./docs ./dist --base /my-project/
```

For deploying to `https://example.com/my-project/`.

### Skip Confirmation

```bash
nlddoc build ./docs ./dist --clean
```

Overwrites output without asking.

## How It Works

When you run `build`, nlddoc:

1. **Validates** input directory exists and contains `.md` files
2. **Prompts** if output directory exists (unless `--clean`)
3. **Loads** configuration from `.nlddoc`
4. **Creates** temporary VitePress project
5. **Copies** markdown files to temp directory
6. **Installs** dependencies
7. **Builds** static site with VitePress
8. **Copies** built files to output directory
9. **Cleans** up temporary directory

## Output

```
📙 nlddoc build
────────────────────────────────────────────────────────────
● Loading /path/to/docs
● Output /path/to/dist
────────────────────────────────────────────────────────────

✓ Build complete!
────────────────────────────────────────────────────────────
  ● Output: /path/to/dist

  Ready to deploy! Upload the output directory to any static host.
────────────────────────────────────────────────────────────
```

## Base URL

The `--base` option is crucial for subdirectory deployments.

### Root Deployment

Deploying to `https://example.com/`:

```bash
nlddoc build ./docs ./dist
```

No `--base` needed (defaults to `/`).

### Subdirectory Deployment

Deploying to `https://example.com/docs/`:

```bash
nlddoc build ./docs ./dist --base /docs/
```

**Important:** Include leading and trailing slashes!

### GitHub Pages (User Site)

For `https://username.github.io/`:

```bash
nlddoc build ./docs ./dist
```

### GitHub Pages (Project Site)

For `https://username.github.io/repo-name/`:

```bash
nlddoc build ./docs ./dist --base /repo-name/
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

If output directory exists, nlddoc prompts:

```
Output directory exists: /path/to/dist
Overwrite? (y/N)
```

- Type `y` to overwrite
- Type anything else to cancel

### With --clean

Automatically overwrites without asking:

```bash
nlddoc build --clean
```

Use in CI/CD pipelines where prompts aren't possible.

## Deployment

The built site works with any static hosting:

### GitHub Pages

```bash
nlddoc build ./docs ./dist --base /repo-name/
# Push dist/ to gh-pages branch
```

### Netlify

```bash
nlddoc build ./docs ./dist
# Deploy dist/ directory
```

### Vercel

```bash
nlddoc build ./docs ./dist
# Deploy dist/ directory
```

### Cloudflare Pages

```bash
nlddoc build ./docs ./dist
# Deploy dist/ directory
```

### AWS S3

```bash
nlddoc build ./docs ./dist
aws s3 sync ./dist s3://my-bucket --delete
```

## CI/CD Examples

### GitHub Actions

```yaml
- name: Build docs
  run: npx nlddoc build ./docs ./dist --clean --base /repo-name/

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
    - npx nlddoc build ./docs ./public --clean
  artifacts:
    paths:
      - public
```

## Troubleshooting

### Assets Not Loading

Check your `--base` setting:

```bash
# Wrong (missing slashes)
nlddoc build --base my-project

# Correct
nlddoc build --base /my-project/
```

### Build Fails

Common causes:
- Invalid markdown syntax
- Broken links in markdown
- Invalid `.nlddoc` configuration

Check the error message for details.

### Output Not Updated

Ensure you're overwriting the old build:

```bash
nlddoc build --clean
```

## Performance

Build times depend on:
- Number of markdown files
- Total content size
- First-time dependency installation

Typical build: 10-30 seconds for 50-100 pages.

## Related

- [nlddoc serve](./serve.md)
- [Deployment Guide](../Deployment/index.md)
- [Configuration](../Guide/configuration.md)
