import { readdirSync, statSync } from 'fs'
import { join, relative, sep } from 'path'

const excludedDirectories = new Set(['node_modules', '.git', '.vitepress', 'dist', '.cache'])

export function isExcludedPath(root, path) {
  return relative(root, path).split(sep).some(part => excludedDirectories.has(part))
}

/** Stop at the first Markdown file, without scanning dependency/build trees. */
export function hasMarkdownFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (excludedDirectories.has(entry.name)) continue
    if (entry.name.endsWith('.md')) {
      if (entry.isFile()) return true
      // Preserve support for linked Markdown files without traversing directory cycles.
      if (entry.isSymbolicLink()) {
        try {
          if (statSync(join(directory, entry.name)).isFile()) return true
        } catch {
          // Ignore dangling links.
        }
      }
    }
    if (entry.isDirectory() && hasMarkdownFiles(join(directory, entry.name))) return true
  }
  return false
}
