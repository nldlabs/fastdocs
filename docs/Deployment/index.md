---
title: Overview
order: 1
---

# Deployment

Deploy your nlddoc site to any static hosting platform. Choose the one that fits your needs.

## Overview

nlddoc builds a static site that works anywhere:
- ✅ No server-side rendering needed
- ✅ No databases or backends
- ✅ Just HTML, CSS, and JavaScript
- ✅ Deploy to CDN for global speed

## Quick Deploy

All platforms follow the same pattern:

1. **Build** your site:
   ```bash
   nlddoc build ./docs ./dist
   ```

2. **Deploy** the `./dist` directory

## Platforms

<SubPages />

## Choosing a Platform

### GitHub Pages
- ✅ Free
- ✅ Perfect for open source projects
- ✅ Automatic deployments with GitHub Actions
- ❌ Public repos only (free tier)

### Netlify
- ✅ Free tier is generous
- ✅ Automatic deployments from Git
- ✅ Custom domains easy
- ✅ Preview deployments for PRs

### Vercel
- ✅ Excellent performance
- ✅ Great developer experience
- ✅ Automatic deployments
- ✅ Edge network

### Cloudflare Pages
- ✅ Unlimited bandwidth (free)
- ✅ Fast global CDN
- ✅ Simple setup
- ✅ Great for large sites

## Custom Domain

All platforms support custom domains:

1. **Build** with root base:
   ```bash
   nlddoc build ./docs ./dist
   ```

2. **Configure** DNS to point to your host
3. **Add** custom domain in hosting platform

## Tips

### Always Set Base Correctly

Root domain or subdomain:
```bash
nlddoc build --base /
```

Subdirectory:
```bash
nlddoc build --base /docs/
```

### Test Locally

Before deploying, test your build:

```bash
# Build
nlddoc build ./docs ./dist

# Serve locally (requires python or similar)
cd dist
python -m http.server 8000
```

Open `http://localhost:8000` to verify.

### Automated Deployments

Set up CI/CD for automatic deployments:
- Push to `main` → Auto-deploy to production
- Pull request → Deploy preview
- Always up to date

## Next Steps

Choose your platform and follow the detailed guide!
