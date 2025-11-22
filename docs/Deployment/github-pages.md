---
title: GitHub Pages
order: 2
---

# Deploy to GitHub Pages

Host your documentation on GitHub Pages for free.

## Prerequisites

- Documentation in a GitHub repository
- GitHub Actions enabled (default for new repos)

## Setup

### 1. Create GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

::: v-pre
```yaml
name: Deploy Documentation

on:
  push:
    branches:
      - main  # or master

# Allow only one concurrent deployment
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      
      - name: Build documentation
        run: npx nlddoc build ./docs ./dist --clean --base /${{ github.event.repository.name }}/
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```
:::

### 2. Enable GitHub Pages

1. Go to repository **Settings**
2. Click **Pages** in sidebar
3. Under **Source**, select **GitHub Actions**

### 3. Push and Deploy

```bash
git add .github/workflows/deploy.yml
git commit -m "Add documentation deployment"
git push
```

GitHub Actions will build and deploy automatically!

## Base URL

### Repository Site

For `https://username.github.io/repo-name/`:

::: v-pre
```yaml
run: npx nlddoc build ./docs ./dist --base /${{ github.event.repository.name }}/
```

The `${{ github.event.repository.name }}` automatically uses your repo name.
:::

### User/Organization Site

For `https://username.github.io/`:

Create a repository named `username.github.io` and use:

```yaml
run: npx nlddoc build ./docs ./dist --base /
```

## Custom Domain

### 1. Add CNAME

Create `docs/CNAME` (or `public/CNAME` in your static assets):

```
docs.example.com
```

### 2. Configure DNS

Add a CNAME record pointing to:
```
username.github.io
```

### 3. Update Build

```yaml
run: npx nlddoc build ./docs ./dist --clean --base /
```

### 4. Enable in GitHub

1. Go to **Settings** → **Pages**
2. Enter your custom domain
3. Check "Enforce HTTPS"

## Manual Deployment

Without GitHub Actions:

```bash
# Build
npx nlddoc build ./docs ./dist --base /repo-name/

# Install gh-pages
npm install -g gh-pages

# Deploy
gh-pages -d dist
```

## Troubleshooting

### 404 Errors

Check your base URL:

```bash
# For username.github.io/repo-name/
npx nlddoc build --base /repo-name/

# For username.github.io/ (user site)
npx nlddoc build --base /
```

### Assets Not Loading

Ensure `--base` has leading and trailing slashes:

```bash
# Wrong
--base /docs

# Correct
--base /docs/
```

### Build Fails in Actions

Check the Actions log for specific errors. Common issues:
- Wrong Node.js version (use 18+)
- Invalid markdown
- Missing dependencies

## Advanced

### Deploy on Tag

Deploy only when you create a release tag:

```yaml
on:
  push:
    tags:
      - 'v*'
```

### Multiple Branches

Deploy different branches to different paths:

::: v-pre
```yaml
- name: Set base path
  id: base
  run: |
    if [[ ${{ github.ref }} == 'refs/heads/main' ]]; then
      echo "path=/" >> $GITHUB_OUTPUT
    else
      echo "path=/preview/" >> $GITHUB_OUTPUT
    fi

- name: Build
  run: npx nlddoc build ./docs ./dist --base ${{ steps.base.outputs.path }}
```
:::

## Example Repositories

See these repos for working examples:
- [nlddoc documentation](https://github.com/nldlabs/nlddoc) (this site!)

## Related

- [Netlify Deployment](./netlify.md)
- [Vercel Deployment](./Vercel.md)
- [CLI: build command](../CLI/build.md)
