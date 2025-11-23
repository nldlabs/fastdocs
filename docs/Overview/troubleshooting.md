---
title: Troubleshooting
order: 6
---

# Troubleshooting

Solutions to common issues when using nlddoc.

## Server Issues

### Server won't start

**Symptoms:** `nlddoc serve` fails or hangs

**Common causes:**

1. **Port already in use**
   ```bash
   # Try a different port
   nlddoc serve --port 3000
   ```

2. **Node.js version too old**
   ```bash
   # Check version (need 18+)
   node --version
   
   # Update Node.js if needed
   ```

3. **No markdown files found**
   ```bash
   # Verify path and that .md files exist
   ls -la ./docs/*.md
   
   # Check subdirectories
   find ./docs -name "*.md"
   ```

4. **Permission issues**
   ```bash
   # Check directory permissions
   ls -la ./docs
   
   # Ensure you have read access
   ```

### Server starts but shows blank page

**Symptoms:** Browser opens but shows empty page or 404

**Solutions:**

1. **Check for index.md**
   - Create `index.md` in your docs root
   - Or navigate to a specific page: `http://localhost:5173/guide/`

2. **Clear browser cache**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or try incognito/private mode

3. **Check console for errors**
   - Open browser DevTools (F12)
   - Look for errors in Console tab

### Changes don't appear

**Symptoms:** Edited files don't update in browser

**Solutions:**

1. **Check file was saved**
   - Verify changes are on disk
   - Some editors delay saving

2. **Refresh browser**
   - Try hard refresh: `Ctrl+Shift+R`

3. **Check terminal for errors**
   - Look for watcher errors
   - Server might have stopped

4. **Restart server**
   ```bash
   # Stop with Ctrl+C
   # Start again
   nlddoc serve ./docs
   ```

### Hot reload not working

**Symptoms:** Must manually refresh browser after changes

**Solutions:**

1. **WebSocket connection failed**
   - Check browser console for errors
   - Firewall might be blocking WebSocket

2. **Try different browser**
   - Test in Chrome/Firefox/Safari

3. **Network issues**
   - If using `--host`, check firewall settings

## Build Issues

### Build fails with "dead link(s) found"

**Symptoms:**
```
[vitepress] 3 dead link(s) found.
```

**Solution:**

This means you have broken links to other markdown files. Run the link checker to find them:

```bash
nlddoc check-links ./docs
```

You'll see output like:
```
✗ Found 3 broken link(s) in 2 file(s)

  guide/setup.md:
    Line 15: ./missing-page.md
    Text: "Setup Guide"
```

Fix each broken link by:
- Creating the missing file
- Updating the link to the correct path
- Removing the link if no longer needed

See [nlddoc check-links](../CLI/check-links.md) for details.

**False positive?** If the link checker incorrectly reports a valid link as broken:

1. Verify the link is actually valid (file exists, correct path, case-sensitive)
2. [Report the bug](https://github.com/nldlabs/nlddoc/issues)
3. Temporary workaround:
   ```bash
   nlddoc build --skip-link-checking
   ```
   ⚠️ Use with caution - may allow broken links in deployed docs

### Build fails with JSON parse error

**Symptoms:**
```
Error: Invalid JSON in .nlddoc
```

**Solution:**

Your `.nlddoc` configuration file has invalid JSON syntax.

1. **Check for common JSON errors:**
   - Missing commas between properties
   - Trailing commas (not allowed in JSON)
   - Unquoted property names
   - Single quotes instead of double quotes

2. **Validate JSON:**
   ```bash
   # Use a JSON validator
   cat .nlddoc | python -m json.tool
   ```

3. **Example valid config:**
   ```json
   {
     "title": "My Docs",
     "description": "Documentation site",
     "logo": "lucide:book-open"
   }
   ```

### Build succeeds but assets return 404

**Symptoms:** Deployed site loads but images/CSS missing

**Solution:**

This is usually a `--base` URL problem.

1. **Deploying to subdirectory?**
   ```bash
   # For https://example.com/docs/
   nlddoc build ./docs ./dist --base /docs/
   ```

2. **Deploying to root?**
   ```bash
   # For https://example.com/
   nlddoc build ./docs ./dist --base /
   ```

3. **Important:** Include leading and trailing slashes!
   ```bash
   # Wrong
   nlddoc build --base docs
   
   # Correct
   nlddoc build --base /docs/
   ```

See [nlddoc build](../CLI/build.md) for base URL details.

### Build output directory not updating

**Symptoms:** Old content still in build output

**Solution:**

Use `--clean` to force overwrite:

```bash
nlddoc build ./docs ./dist --clean
```

Or manually delete output directory first:

```bash
rm -rf ./dist
nlddoc build ./docs ./dist
```

### Build is very slow

**Symptoms:** Build takes minutes instead of seconds

**Solutions:**

1. **First build is always slower**
   - Dependencies must be installed
   - Subsequent builds are faster

2. **Large docs folder**
   - Many files (500+) increase build time
   - This is normal

3. **Slow disk/network**
   - Check disk I/O
   - Network speed affects dependency download

4. **Use cached builds in CI/CD**
   ```yaml
   # GitHub Actions example
   - uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

## Navigation Issues

### Pages appear in wrong order

**Symptoms:** Sidebar shows pages alphabetically, not desired order

**Solution:**

Use frontmatter `order` to control sorting:

```markdown
---
order: 1
---

# Getting Started
```

Lower numbers appear first. Pages without `order` appear alphabetically after ordered pages.

See [Frontmatter Guide](../Guide/Frontmatter.md) for details.

### Folder not showing in navigation

**Symptoms:** Folder exists but doesn't appear in sidebar

**Solutions:**

1. **Folder is empty**
   - Add at least one `.md` file
   - Or create `index.md` in the folder

2. **Folder name starts with `.` or `_`**
   - These are intentionally hidden
   - Rename folder to make visible

3. **Create index.md for folder**
   ```markdown
   ---
   title: My Section
   order: 1
   ---
   
   # My Section
   
   <SubPages />
   ```

### Page title is ugly/wrong

**Symptoms:** Sidebar shows "my-page-name" instead of "My Page Name"

**Solution:**

Set custom title in frontmatter:

```markdown
---
title: My Page Name
---

# My Page Name
```

Without frontmatter, nlddoc converts filenames to titles automatically:
- `getting-started.md` → "Getting Started"
- `api-reference.md` → "Api Reference"

### Duplicate pages in navigation

**Symptoms:** Same page appears multiple times

**Possible causes:**

1. **Symbolic links**
   - nlddoc follows symlinks
   - May show same file multiple times

2. **Case sensitivity**
   - `Page.md` and `page.md` are different files on Linux
   - But same file on Windows/Mac

**Solution:** Remove duplicates or symlinks

## Content Issues

### Markdown not rendering correctly

**Symptoms:** Markdown syntax appears as text

**Solutions:**

1. **Check file extension**
   - Must be `.md`
   - Not `.txt` or `.markdown`

2. **Verify markdown syntax**
   - Test in another markdown viewer
   - Check for syntax errors

3. **Special characters need escaping**
   ```markdown
   # Wrong
   Use < and > for comparison
   
   # Correct
   Use `<` and `>` for comparison
   ```

### Images not loading

**Symptoms:** Images show broken icon

**Solutions:**

1. **Check file path**
   ```markdown
   # Relative to current file
   ![Logo](./images/logo.png)
   
   # Relative to docs root
   ![Logo](/images/logo.png)
   ```

2. **Verify file exists**
   ```bash
   ls -la ./docs/images/logo.png
   ```

3. **Check file permissions**
   - File must be readable

4. **Case sensitivity matters**
   - `Logo.png` ≠ `logo.png` on Linux

### Code blocks not highlighting

**Symptoms:** Code appears but no syntax highlighting

**Solution:**

Specify language after opening fence:

````markdown
```javascript
console.log('Hello')
```

```python
print("Hello")
```

```bash
npm install
```
````

See [VitePress language list](https://github.com/shikijs/shiki/blob/main/docs/languages.md).

### Custom components not working

**Symptoms:** `<SubPages />` or `<FullContents />` not rendering

**Solutions:**

1. **Check capitalization**
   ```markdown
   # Wrong
   <subpages />
   <Subpages />
   
   # Correct
   <SubPages />
   <FullContents />
   ```

2. **Self-closing tag required**
   ```markdown
   # Wrong
   <SubPages></SubPages>
   
   # Correct
   <SubPages />
   ```

3. **No other custom components**
   - Only `<SubPages />` and `<FullContents />` are built-in
   - For custom components, use VitePress directly

## Configuration Issues

### Logo not appearing

**Symptoms:** Logo configured but not showing

**Solutions:**

1. **Check logo syntax in `.nlddoc`**
   ```json
   {
     "logo": "lucide:book-open"
   }
   ```

2. **For file-based logos**
   ```json
   {
     "logo": "/images/logo.png"
   }
   ```
   - File must exist in docs folder
   - Path is relative to docs root

3. **Icon not found**
   - Check [Lucide Icons](https://lucide.dev/icons)
   - Use exact icon name: `lucide:icon-name`

See [Icons Guide](../Guide/icons.md) for details.

### Favicon not appearing

**Symptoms:** Browser tab shows default icon

**Solutions:**

1. **Check favicon in `.nlddoc`**
   ```json
   {
     "favicon": "lucide:book-open"
   }
   ```

2. **Clear browser cache**
   - Browsers aggressively cache favicons
   - Hard refresh may not work
   - Try incognito/private mode

3. **Wait for propagation**
   - Can take minutes for favicon to update
   - Try closing and reopening browser

### Custom color not working

**Symptoms:** Logo/favicon color stays default

**Solution:**

Use object syntax with color property:

```json
{
  "logo": {
    "icon": "lucide:rocket",
    "color": "#ff6b35"
  },
  "favicon": {
    "icon": "lucide:rocket",
    "color": "#ff6b35"
  }
}
```

Colors must be valid hex codes: `#RRGGBB`

## Deployment Issues

### GitHub Pages shows 404

**Symptoms:** Deployed site returns 404 for all pages

**Solutions:**

1. **Check base URL**
   ```bash
   # For https://username.github.io/repo-name/
   nlddoc build --base /repo-name/
   ```

2. **Verify gh-pages branch**
   - Check branch exists
   - Contains build output
   - GitHub Pages is enabled in repo settings

3. **Wait for deployment**
   - Can take 5-10 minutes
   - Check Actions tab for deployment status

See [GitHub Pages Guide](../Deployment/github-pages.md).

### Netlify build fails

**Symptoms:** Netlify deploy fails

**Solutions:**

1. **Set build command**
   ```
   npx nlddoc build ./docs ./dist
   ```

2. **Set publish directory**
   ```
   dist
   ```

3. **Set Node.js version**
   - Add `.nvmrc` file:
     ```
     18
     ```

See [Netlify Guide](../Deployment/netlify.md).

### Vercel build fails

**Symptoms:** Vercel deploy fails

**Solutions:**

1. **Configure build settings**
   - Build command: `npx nlddoc build ./docs ./dist`
   - Output directory: `dist`

2. **Set Node.js version**
   - Vercel uses Node 18+ by default
   - Override if needed in project settings

See [Vercel Guide](../Deployment/Vercel.md).

## Performance Issues

### Slow page load times

**Symptoms:** Built site loads slowly

**Solutions:**

1. **Optimize images**
   - Compress images before adding
   - Use appropriate formats (WebP for photos, SVG for diagrams)
   - Resize to actual display size

2. **Reduce markdown file size**
   - Split large files into smaller pages
   - Use links instead of including everything

3. **Check hosting**
   - Use CDN-backed hosting (Netlify, Vercel, Cloudflare Pages)
   - Not raw GitHub Pages (slower than alternatives)

### Large bundle size

**Symptoms:** Build output is very large

**Solutions:**

1. **Check for large images**
   ```bash
   find ./dist -type f -size +1M
   ```

2. **Remove unnecessary files**
   - Delete files starting with `.` or `_`
   - These won't be in navigation anyway

3. **This is normal for large docs**
   - VitePress bundles are optimized
   - Large sites = large bundles

## Getting Help

### Still stuck?

1. **Check error message carefully**
   - Error messages usually explain the issue
   - Search for specific error text

2. **Check the guides**
   - [Getting Started](./getting-started.md)
   - [CLI Reference](../CLI/index.md)
   - [Configuration](../Guide/configuration.md)

3. **Search existing issues**
   - [GitHub Issues](https://github.com/nldlabs/nlddoc/issues)
   - Someone may have solved it already

4. **Ask for help**
   - Open a [new issue](https://github.com/nldlabs/nlddoc/issues/new)
   - Include:
     - Error message
     - Command you ran
     - Node.js version (`node --version`)
     - Operating system

5. **Check VitePress docs**
   - nlddoc uses VitePress under the hood
   - [VitePress docs](https://vitepress.dev) may have answers
   - Especially for markdown features

## Related

- [FAQ](./faq.md)
- [Getting Started](./getting-started.md)
- [CLI Reference](../CLI/index.md)
