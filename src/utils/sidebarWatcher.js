import { watch } from 'chokidar'
import { writeFileSync, cpSync, rmSync, mkdirSync, existsSync, unlinkSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'
import { loadConfig } from '../cli/config.js'
import { generateVitePressConfig } from '../vitepress/configGenerator.js'
import pc from 'picocolors'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/**
 * Watch for file structure changes and regenerate VitePress config
 * @param {string} docsPath - Absolute path to docs directory
 * @param {string} tempDir - Temporary VitePress project directory
 * @param {Function} onRestart - Callback to restart VitePress server
 */
export function watchSidebarChanges(docsPath, tempDir, onRestart) {
  const watcher = watch(docsPath, {
    ignoreInitial: true,
    ignored: ['**/node_modules/**', '**/.vitepress/**', '**/dist/**', '**/.git/**'],
    depth: 99 // Watch all subdirectories
  })
  
  watcher.on('error', (err) => {
    console.error(pc.red(`Watcher error: ${err.message}`))
  })
  
  let restartTimeout
  let isRegenerating = false
  
  // Sync a file from user directory to temp directory
  const syncFileToTemp = (userPath) => {
    const relPath = relative(docsPath, userPath)
    const tempPath = join(tempDir, relPath)
    
    try {
      // Ensure parent directory exists
      const parentDir = dirname(tempPath)
      if (!existsSync(parentDir)) {
        mkdirSync(parentDir, { recursive: true })
      }
      
      // Copy file to temp
      cpSync(userPath, tempPath)
    } catch (err) {
      console.error(pc.red(`Error syncing file: ${err.message}`))
    }
  }
  
  // Remove a file from temp directory
  const removeFileFromTemp = (userPath) => {
    const relPath = relative(docsPath, userPath)
    const tempPath = join(tempDir, relPath)
    
    try {
      if (existsSync(tempPath)) {
        unlinkSync(tempPath)
      }
    } catch (err) {
      console.error(pc.red(`Error removing file: ${err.message}`))
    }
  }
  
  // Remove a directory from temp
  const removeDirFromTemp = (userPath) => {
    const relPath = relative(docsPath, userPath)
    const tempPath = join(tempDir, relPath)
    
    try {
      if (existsSync(tempPath)) {
        rmSync(tempPath, { recursive: true, force: true })
      }
    } catch (err) {
      console.error(pc.red(`Error removing directory: ${err.message}`))
    }
  }
  
  const regenerateConfig = (event, path) => {
    // Prevent concurrent regenerations
    if (isRegenerating) {
      return
    }
    
    // Debounce to handle multiple rapid changes
    clearTimeout(restartTimeout)
    restartTimeout = setTimeout(() => {
      isRegenerating = true
      
      console.log(pc.dim(`\n  File ${event}: ${path}`))
      console.log(pc.dim('  Updating...'))
      
      // Reload config and regenerate VitePress config
      const config = loadConfig(docsPath)
      
      // Write updated config (pointing to tempDir)
      const configPath = join(tempDir, '.vitepress/config.mjs')
      const configContent = `import { generateVitePressConfig } from '${join(__dirname, '../vitepress/configGenerator.js').replace(/\\/g, '\\\\')}'

const userConfig = ${JSON.stringify(config, null, 2)}
const docsPath = '${tempDir.replace(/\\/g, '\\\\')}'

export default generateVitePressConfig(userConfig, docsPath, false)
`
      
      writeFileSync(configPath, configContent)
      
      console.log(pc.green('  ✓ Changes reloaded\n'))
      
      // Trigger restart
      onRestart()
      
      // Reset flag after a delay to allow restart to complete
      setTimeout(() => {
        isRegenerating = false
      }, 1000)
    }, 300) // Wait 300ms to batch changes
  }
  
  // Watch for file additions - sync to temp and regenerate
  watcher.on('add', (path) => {
    syncFileToTemp(path)
    regenerateConfig('added', path)
  })
  
  // Watch for file deletions - remove from temp and regenerate
  watcher.on('unlink', (path) => {
    removeFileFromTemp(path)
    regenerateConfig('deleted', path)
  })
  
  // Watch for directory additions - regenerate (structure changed)
  watcher.on('addDir', (path) => {
    regenerateConfig('added directory', path)
  })
  
  // Watch for directory deletions - remove from temp and regenerate
  watcher.on('unlinkDir', (path) => {
    removeDirFromTemp(path)
    regenerateConfig('deleted directory', path)
  })
  
  // Watch for file changes - sync to temp
  watcher.on('change', (path) => {
    syncFileToTemp(path)
    
    // Only regenerate config if it affects sidebar (config or frontmatter)
    if (path.endsWith('.fastdocs') || path.endsWith('.md')) {
      regenerateConfig('changed', path)
    }
  })
  
  return watcher
}
