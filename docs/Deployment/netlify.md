---
title: Netlify
order: 3
---

# Deploy to Netlify

Deploy your documentation to Netlify with automatic deployments from Git.

## Quick Deploy

### Using Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your site:**
   ```bash
   npx nlddoc build ./docs ./dist
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod --dir dist
   ```

## Automatic Deployments

### 1. Connect Repository

1. Go to [Netlify](https://app.netlify.com)
2. Click **Add new site** → **Import an existing project**
3. Choose your Git provider
4. Select your repository

### 2. Configure Build Settings

**Build command:**
```
npx nlddoc build ./docs ./dist --clean
```

**Publish directory:**
```
dist
```

**Node version:**

Create `netlify.toml`:

```toml
[build]
  command = "npx nlddoc build ./docs ./dist --clean"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

### 3. Deploy

Click **Deploy site**. Netlify will:
- Install dependencies
- Build your site
- Deploy to CDN

Every push to your main branch triggers a new deployment!

## Configuration File

Complete `netlify.toml` example:

```toml
[build]
  command = "npx nlddoc build ./docs ./dist --clean"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

# Redirects for SPA routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Custom headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
```

## Custom Domain

### 1. Build with Root Base

```toml
[build]
  command = "npx nlddoc build ./docs ./dist --clean --base /"
```

### 2. Add Custom Domain

In Netlify dashboard:
1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow DNS configuration steps

## Branch Deployments

### Deploy Previews

Netlify automatically creates deploy previews for pull requests.

Configure in `netlify.toml`:

```toml
[context.deploy-preview]
  command = "npx nlddoc build ./docs ./dist --clean --base /"

[context.branch-deploy]
  command = "npx nlddoc build ./docs ./dist --clean --base /"
```

### Branch-Specific Builds

Deploy specific branches:

```toml
[context.staging]
  command = "npx nlddoc build ./docs ./dist --clean --base /staging/"
  
[context.production]
  command = "npx nlddoc build ./docs ./dist --clean --base /"
```

## Environment Variables

Add in Netlify dashboard under **Site settings** → **Environment variables**.

Use in build:

```toml
[build]
  command = "npx nlddoc build ./docs ./dist --clean --base $BASE_URL"
```

## Performance

### Edge Functions

Netlify's edge network ensures fast global access.

### Cache Control

Add caching headers in `netlify.toml`:

```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

## Troubleshooting

### Build Fails

Check build log in Netlify dashboard. Common issues:
- Wrong Node version (use 18+)
- Missing build command
- Invalid publish directory

### 404 on Routes

Add redirect rule in `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Assets Not Loading

Verify base URL:

```bash
# For custom domain
--base /

# For subdirectory
--base /docs/
```

## Advanced Features

### Form Handling

Netlify can handle forms in your docs:

```html
<form netlify>
  <input type="email" name="email">
  <button type="submit">Subscribe</button>
</form>
```

### Functions

Add serverless functions:

```toml
[build]
  functions = "functions"
```

### Split Testing

A/B test different versions:

```toml
[build]
  command = "npx nlddoc build ./docs ./dist"

[[split_tests]]
  path = "/*"
  branches = ["main:90%", "experiment:10%"]
```

## Manual Deployment

Deploy without Git:

```bash
# Build
npx nlddoc build ./docs ./dist

# Deploy
netlify deploy --prod --dir dist
```

## Related

- [GitHub Pages](./github-pages.md)
- [Vercel](./Vercel.md)
- [CLI: build](../CLI/build.md)
