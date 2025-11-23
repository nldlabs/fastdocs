import { resolve, isAbsolute } from 'path'
import { existsSync, statSync } from 'fs'
import { checkLinks, displayLinkResults } from '../utils/linkChecker.js'
import { error } from '../utils/logger.js'

export async function checkLinksCommand(targetPath = '.') {
  // Resolve absolute path
  const absolutePath = isAbsolute(targetPath) ? targetPath : resolve(process.cwd(), targetPath)
  
  // Validate input path
  if (!existsSync(absolutePath)) {
    error(`Directory not found: ${absolutePath}`)
    process.exit(1)
  }
  
  if (!statSync(absolutePath).isDirectory()) {
    error(`Path is not a directory: ${absolutePath}`)
    process.exit(1)
  }
  
  // Check links
  const brokenLinks = await checkLinks(absolutePath)
  
  // Display results
  displayLinkResults(brokenLinks, absolutePath)
  
  // Exit with error code if broken links found
  if (brokenLinks.size > 0) {
    process.exit(1)
  }
}
