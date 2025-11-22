---
title: Vercel
order: 4
---

# Deploy to Vercel

Deploy your documentation to Vercel's global edge network.

## Quick Deploy

### Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

Vercel will:
- Detect your project
- Build automatically
- Deploy to production

## Automatic Deployments

### 1. Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New...** → **Project**
3. Import your Git repository

### 2. Configure Build

Vercel auto-detects most settings. To customize, create `vercel.json`:

```json
{
  "buildCommand": "npx nlddoc build ./docs ./dist --clean",
  "outputDirectory": "dist",
  "framework": null
}
```

Or use dashboard settings:
- **Build Command:** `npx nlddoc build ./docs ./dist --clean`
- **Output Directory:** `dist`
- **Install Command:** `npm install` (not needed for nlddoc)

### 3. Deploy

Click **Deploy**. Every push triggers a new deployment!

## Configuration

### vercel.json

Complete configuration example:

```json
{
  "buildCommand": "npx nlddoc build ./docs ./dist --clean",
  "outputDirectory": "dist",
  "framework": null,
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Environment Variables

Set in Vercel dashboard or `vercel.json`:

```json
{
  "env": {
    "NODE_VERSION": "18"
  }
}
```

## Custom Domain

### 1. Add Domain

In Vercel dashboard:
1. Go to **Project Settings** → **Domains**
2. Add your domain
3. Configure DNS as shown

### 2. Update Build

For custom domain, use root base:

```bash
npx nlddoc build ./docs ./dist --base /
```

## Branch Deployments

### Production Branch

Set production branch in **Project Settings** → **Git**:
- Usually `main` or `master`

### Preview Deployments

Vercel automatically creates preview deployments for:
- Pull requests
- Non-production branches

Each gets a unique URL like:
```
https://your-project-git-branch-name-username.vercel.app
```

## Performance

### Edge Network

Vercel deploys to global edge network:
- Automatic CDN
- Instant cache invalidation
- Optimized assets

### Analytics

Enable analytics in dashboard:
- Page views
- Top pages
- Referrers
- Real-time monitoring

## Troubleshooting

### Build Fails

Check deployment logs in Vercel dashboard. Common issues:
- Wrong Node.js version
- Incorrect build command
- Invalid output directory

Fix in `vercel.json`:

```json
{
  "buildCommand": "npx nlddoc build ./docs ./dist --clean",
  "outputDirectory": "dist"
}
```

### 404 Errors

Ensure your build completed successfully:

```bash
# Test locally
npx nlddoc build ./docs ./dist
cd dist
npx serve
```

### Assets Not Loading

Check base URL in build command:

```json
{
  "buildCommand": "npx nlddoc build ./docs ./dist --base /"
}
```

## CLI Deployment

### Deploy Preview

```bash
vercel
```

### Deploy Production

```bash
vercel --prod
```

### Deploy Specific Directory

```bash
vercel dist --prod
```

## Advanced

### Monorepo

For monorepo projects:

```json
{
  "buildCommand": "cd docs && npx nlddoc build . ./dist",
  "outputDirectory": "docs/dist"
}
```

### Custom Redirects

Add redirects in `vercel.json`:

```json
{
  "redirects": [
    {
      "source": "/old-page",
      "destination": "/new-page",
      "permanent": true
    }
  ]
}
```

### Rewrites

Proxy requests:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://api.example.com/:path*"
    }
  ]
}
```

## Project Examples

Minimal setup:

```json
{
  "buildCommand": "npx nlddoc build ./docs ./dist --clean",
  "outputDirectory": "dist"
}
```

Advanced setup:

```json
{
  "buildCommand": "npx nlddoc build ./docs ./dist --clean",
  "outputDirectory": "dist",
  "framework": null,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/docs/:path*",
      "destination": "/:path*"
    }
  ]
}
```

## Related

- [GitHub Pages](./github-pages.md)
- [Netlify](./netlify.md)
- [CLI: build](../CLI/build.md)
