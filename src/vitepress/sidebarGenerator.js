import { readdirSync, statSync, readFileSync } from 'fs'
import { join, parse } from 'path'
import matter from 'gray-matter'

/**
 * Truncate long titles for sidebar display
 * @param {string} title - Original title
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated title
 */
function truncateTitle(title, maxLength = 27) {
  if (title.length <= maxLength) return title
  
  // Try to truncate at a word boundary
  const truncated = title.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > maxLength * 0.7) {
    // If we can cut at a space without losing too much, do it
    return truncated.slice(0, lastSpace) + '...'
  }
  
  // Otherwise hard truncate
  return truncated + '...'
}

/**
 * Generate VitePress sidebar structure from a directory of markdown files
 * @param {string} dir - Absolute path to directory to scan
 * @param {string} basePath - Relative path for building links
 * @returns {Array} VitePress sidebar items
 */
export function generateSidebar(dir, basePath = '') {
  const items = []
  const files = readdirSync(dir).filter(name => 
    // Exclude build/dependency directories
    !['node_modules', '.vitepress', 'dist', '.cache', '.git'].includes(name)
  )

  // Check if this directory has an index.md
  let indexData = null
  const indexPath = join(dir, 'index.md')
  try {
    const content = readFileSync(indexPath, 'utf8')
    const { data } = matter(content)
    indexData = {
      title: truncateTitle(data.title ?? (basePath ? parse(basePath).name : 'Home')),
      order: data.order ?? Infinity
    }
  } catch (err) {
    // No index.md in this directory
  }

  // Separate files and directories with their metadata
  const entries = files.map(file => {
    const fullPath = join(dir, file)
    const stat = statSync(fullPath)
    const relativePath = basePath ? `${basePath}/${file}` : file
    
    if (stat.isDirectory()) {
      // Check if directory has an index.md and read its frontmatter
      let order = Infinity
      let title = file
      try {
        const indexPath = join(fullPath, 'index.md')
        const content = readFileSync(indexPath, 'utf8')
        const { data } = matter(content)
        order = data.order ?? Infinity
        title = truncateTitle(data.title ?? file)
      } catch (err) {
        // No index.md or error reading it, use defaults
        title = truncateTitle(file)
      }
      
      return {
        type: 'dir',
        name: file,
        title,
        fullPath,
        relativePath,
        order
      }
    } else if (file.endsWith('.md') && file !== 'index.md') {
      // Read frontmatter for order and title
      let order = Infinity
      let title = null
      try {
        const content = readFileSync(fullPath, 'utf8')
        const { data } = matter(content)
        order = data.order ?? Infinity
        title = data.title
      } catch (err) {
        // Ignore errors, use defaults
      }
      
      // If no title in frontmatter, convert filename to title
      if (!title) {
        title = parse(file).name
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      }
      
      // Truncate long titles
      title = truncateTitle(title)
      
      return {
        type: 'file',
        name: file,
        title,
        fullPath,
        relativePath,
        order
      }
      
      return {
        type: 'file',
        name: file,
        title,
        fullPath,
        relativePath,
        order
      }
    }
    return null
  }).filter(Boolean)

  // Sort by order, then alphabetically
  entries.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order
    return a.name.localeCompare(b.name)
  })

  // Build sidebar items
  for (const entry of entries) {
    if (entry.type === 'dir') {
      const childItems = generateSidebar(entry.fullPath, entry.relativePath)
      if (childItems.length > 0) {
        // If directory has an index.md, make the folder itself clickable
        const hasIndex = readdirSync(entry.fullPath).includes('index.md')
        
        items.push({
          text: entry.title,
          link: hasIndex ? `/${entry.relativePath}/` : undefined,
          collapsed: false,
          items: childItems
        })
      }
    } else {
      items.push({
        text: entry.title,
        link: `/${entry.relativePath.replace(/\.md$/, '')}`
      })
    }
  }

  return items
}
