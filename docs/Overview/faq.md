---
title: FAQ
order: 5
---

# FAQ

Common questions about nlddoc.

## General

### What is nlddoc?

nlddoc is a zero-configuration tool for viewing and building markdown documentation. It wraps VitePress to provide an ultra-simple experience with no setup required.

### Why use nlddoc instead of VitePress directly?

- **No setup** - Works instantly with `npx`
- **Zero config** - No `.vitepress` folder or config files needed
- **Clean docs** - Your docs folder stays pristine, no build artifacts
- **Auto navigation** - Generates sidebar from folder structure
- **Simple** - Three commands: `init`, `serve`, `build`

VitePress is powerful but requires setup. nlddoc is for when you just want to document something quickly.

### Does nlddoc require installation?

No! Use with `npx`:

```bash
npx nlddoc serve ./docs
```

Or install globally for convenience:

```bash
npm install -g nlddoc
```

### What's the name about?

nlddoc stands for "Nate Louis Dev Docs" - a simple tool for creating documentation sites quickly.

## Technical

### What version of Node.js do I need?

Node.js 18 or higher.

Check your version:
```bash
node --version
```

### Where does nlddoc store temporary files?

In your system's temp directory (e.g., `/tmp` on Linux/Mac). These are automatically cleaned up when the server stops.

Your documentation folder remains completely clean.

### Can I use TypeScript?

Your docs are markdown - no TypeScript needed!

If you're asking about extending nlddoc itself, yes, the codebase is JavaScript (ESM) but you could contribute TypeScript.

### Does it work offline?

**Serve:** Requires internet for first run (to install dependencies), then works offline.

**Build:** Same - internet needed for first build, then works offline.

**Viewing built site:** Completely offline, it's just static HTML.

### Can I customize the theme?

Not directly. nlddoc uses VitePress's default theme.

For heavy customization, consider using VitePress directly. nlddoc prioritizes simplicity over customization.

### What markdown features are supported?

All VitePress/Markdown-it features:
- GitHub Flavored Markdown
- Syntax highlighting
- Tables
- Task lists
- Emoji :tada:
- Footnotes
- Custom containers
- Math equations (KaTeX)
- Mermaid diagrams

See [VitePress Markdown Guide](https://vitepress.dev/guide/markdown) for details.

## Usage

### Can I have multiple documentation sites?

Yes! Each docs folder is independent:

```bash
npx nlddoc serve ./project-a/docs
npx nlddoc serve ./project-b/docs --port 3001
```

### How do I add images?

Place images in your docs folder:

```
docs/
├── images/
│   └── diagram.png
└── guide.md
```

Reference in markdown:

```markdown
![Diagram](./images/diagram.png)
```

Or use absolute paths from docs root:

```markdown
![Diagram](/images/diagram.png)
```

### Can I use Vue components?

The `<SubPages />` and `<FullContents />` components are built-in.

Custom Vue components aren't supported. For that, use VitePress directly.

### How do I create a homepage?

Create `index.md` in your docs root:

```markdown
# Welcome

This is my documentation site.

<FullContents />
```

### How do I exclude files from navigation?

Files and folders starting with `.` or `_` are ignored:

```
docs/
├── guide.md          # ✓ Shown
├── .draft.md         # ✗ Hidden
└── _templates/       # ✗ Hidden
```

## Deployment

### Can I deploy for free?

Yes! Many free options:
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

All have generous free tiers.

### Do I need a custom domain?

No, all platforms provide free subdomains:
- GitHub: `username.github.io/repo`
- Netlify: `site-name.netlify.app`
- Vercel: `project-name.vercel.app`

Custom domains are optional.

### Can I password-protect my docs?

Not built-in. Options:
- Use Netlify/Vercel password protection features
- Deploy to private hosting
- Use HTTP basic auth on your server

For private docs, consider keeping them in a private Git repo.

### How often should I rebuild?

For static hosting with auto-deploy:
- Every push rebuilds automatically
- No manual rebuilds needed

For manual hosting:
- Rebuild when content changes
- CI/CD can automate this

## Troubleshooting

### Server won't start

Check:
1. Port 5173 available? Try `--port 3000`
2. Node.js 18+? Run `node --version`
3. Markdown files exist? Check directory path
4. Permission issues? Check directory permissions

### Build fails

Common causes:
1. Invalid markdown syntax
2. Broken links
3. Invalid `.nlddoc` JSON
4. Node.js version too old

Check the error message for specifics.

### Navigation is wrong

Navigation is generated from:
1. Folder structure
2. Alphabetical order (default)
3. `order` in frontmatter (if specified)

Use frontmatter to control order:

```markdown
---
order: 1
---
```

### Changes don't appear

For `serve`:
- Should update automatically
- Try refreshing browser
- Check terminal for errors

For `build`:
- Must rebuild: `nlddoc build`
- Changes don't appear until you rebuild

### Assets return 404

Common with subdirectory deployments. Check `--base`:

```bash
# For example.com/docs/
nlddoc build --base /docs/

# For example.com/
nlddoc build --base /
```

## Contributing

### How can I contribute?

- Report bugs on [GitHub Issues](https://github.com/nldlabs/nlddoc/issues)
- Suggest features
- Submit pull requests
- Improve documentation
- Share your experience

### Where's the code?

GitHub: [nldlabs/nlddoc](https://github.com/nldlabs/nlddoc)

### Can I sponsor development?

Not set up yet, but contributions and GitHub stars help! ⭐

## Still Have Questions?

- Check the [Guide](../Guide/index.md)
- Read [CLI Reference](../CLI/index.md)
- Open an [issue](https://github.com/nldlabs/nlddoc/issues)
