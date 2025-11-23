import { readdirSync, statSync, readFileSync, existsSync } from 'fs'
import { join, dirname, resolve, relative } from 'path'
import pc from 'picocolors'

/**
 * Find all markdown files in a directory recursively
 * @param {string} dir - Directory to scan
 * @param {Array} fileList - Accumulated file list
 * @returns {Array} List of markdown file paths
 */
function findMarkdownFiles(dir, fileList = []) {
  const files = readdirSync(dir)
  
  files.forEach(file => {
    const filePath = join(dir, file)
    const stat = statSync(filePath)
    
    if (stat.isDirectory()) {
      // Skip common ignore directories
      if (!['node_modules', '.vitepress', 'dist', '.cache', '.git'].includes(file)) {
        findMarkdownFiles(filePath, fileList)
      }
    } else if (file.endsWith('.md')) {
      fileList.push(filePath)
    }
  })
  
  return fileList
}

/**
 * Extract local markdown links from a file
 * @param {string} filePath - Path to markdown file
 * @returns {Array} Array of {link, lineNumber} objects
 */
function extractLocalLinks(filePath) {
  const content = readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  const links = []
  
  // Track code fence depth (supports nested code examples)
  let codeFenceLevel = 0
  
  // Match markdown links: [text](./path.md) or [text](../path.md) or [text](/path.md)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
  
  lines.forEach((line, index) => {
    // Check for code fence opening/closing
    const fenceMatch = line.trim().match(/^(`{3,})/)
    if (fenceMatch) {
      const fenceLength = fenceMatch[1].length
      // Toggle: if we're at level 0, go up, otherwise go down
      if (codeFenceLevel === 0) {
        codeFenceLevel = fenceLength
      } else if (line.trim().startsWith('`'.repeat(codeFenceLevel))) {
        codeFenceLevel = 0
      }
      return
    }
    
    // Skip if we're in a code block
    if (codeFenceLevel > 0) {
      return
    }
    
    // Check for indented code blocks (4 spaces or tab)
    if (line.match(/^(    |\t)/)) {
      return
    }
    
    let match
    while ((match = linkRegex.exec(line)) !== null) {
      const link = match[2]
      const matchIndex = match.index
      const matchEnd = matchIndex + match[0].length
      
      // Check if this link is inside inline code (single backticks)
      // Count backticks before and after the match
      const beforeMatch = line.substring(0, matchIndex)
      const afterMatch = line.substring(matchEnd)
      const backticksBefore = (beforeMatch.match(/`/g) || []).length
      const backticksAfter = (afterMatch.match(/`/g) || []).length
      
      // If odd number of backticks before, we're inside inline code
      if (backticksBefore % 2 !== 0) {
        continue
      }
      
      // Also check if the whole link is wrapped: `[text](link)`
      // Look for backtick immediately before [ and after )
      if (matchIndex > 0 && line[matchIndex - 1] === '`' && 
          matchEnd < line.length && line[matchEnd] === '`') {
        continue
      }
      
      // Only check local markdown links (not http/https, not anchors only)
      if (!link.startsWith('http') && 
          !link.startsWith('//') && 
          (link.includes('.md') || link.startsWith('./') || link.startsWith('../') || link.startsWith('/'))) {
        
        // Remove anchor if present
        const linkWithoutAnchor = link.split('#')[0]
        
        if (linkWithoutAnchor) {
          links.push({
            link: linkWithoutAnchor,
            lineNumber: index + 1,
            text: match[1]
          })
        }
      }
    }
  })
  
  return links
}

/**
 * Check if a link target exists
 * @param {string} sourcePath - Path to file containing the link
 * @param {string} link - The link to check
 * @param {string} docsRoot - Root docs directory
 * @returns {boolean} Whether the target exists
 */
function checkLinkExists(sourcePath, link, docsRoot) {
  let targetPath
  
  if (link.startsWith('/')) {
    // Absolute link from docs root
    targetPath = join(docsRoot, link.substring(1))
  } else {
    // Relative link from current file
    const sourceDir = dirname(sourcePath)
    targetPath = resolve(sourceDir, link)
  }
  
  // Try exact path first
  if (existsSync(targetPath)) {
    return true
  }
  
  // Try adding .md if not present
  if (!targetPath.endsWith('.md') && existsSync(targetPath + '.md')) {
    return true
  }
  
  // Try as directory with index.md
  if (existsSync(join(targetPath, 'index.md'))) {
    return true
  }
  
  return false
}

/**
 * Check all links in documentation
 * @param {string} docsPath - Path to docs directory
 * @returns {Map} Map of file paths to arrays of broken links
 */
export async function checkLinks(docsPath) {
  const markdownFiles = findMarkdownFiles(docsPath)
  const brokenLinksMap = new Map()
  
  markdownFiles.forEach(filePath => {
    const links = extractLocalLinks(filePath)
    const brokenLinks = []
    
    links.forEach(({ link, lineNumber, text }) => {
      if (!checkLinkExists(filePath, link, docsPath)) {
        brokenLinks.push({
          target: link,
          line: lineNumber,
          text
        })
      }
    })
    
    if (brokenLinks.length > 0) {
      const relativePath = relative(docsPath, filePath)
      brokenLinksMap.set(relativePath, brokenLinks)
    }
  })
  
  return brokenLinksMap
}

/**
 * Format and display link check results
 * @param {Map} brokenLinksMap - Map from checkLinks
 * @param {string} docsPath - Path to docs directory
 */
export function displayLinkResults(brokenLinksMap, docsPath) {
  console.log()
  console.log(pc.cyan(pc.bold('🔗 Link Check Results')))
  console.log()
  console.log(pc.dim('─'.repeat(60)))
  console.log()
  
  if (brokenLinksMap.size === 0) {
    console.log(pc.green('✓') + pc.bold(' All links are valid!'))
    console.log()
  } else {
    const totalBroken = Array.from(brokenLinksMap.values()).reduce((sum, links) => sum + links.length, 0)
    console.log(pc.red('✗') + pc.bold(` Found ${totalBroken} broken link(s) in ${brokenLinksMap.size} file(s)`))
    console.log()
    
    for (const [filePath, brokenLinks] of brokenLinksMap) {
      console.log(pc.yellow(`  ${filePath}:`))
      
      brokenLinks.forEach(({ target, line, text }) => {
        console.log(pc.dim(`    Line ${line}: `) + pc.red(target))
        console.log(pc.dim(`    Text: "${text}"`))
        console.log()
      })
    }
    
    console.log(pc.dim('─'.repeat(60)))
    console.log()
    console.log(pc.dim('  Fix these links to ensure proper navigation.'))
    console.log(pc.dim('  ') + pc.red('Note:') + pc.dim(' Broken links will cause build errors.'))
  }
  
  console.log()
  console.log(pc.dim('─'.repeat(60)))
  console.log()
}
