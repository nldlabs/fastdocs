import { watch } from 'chokidar'
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
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
      const vitepressConfig = generateVitePressConfig(config, docsPath, true)
      
      // Write updated config
      const configPath = join(tempDir, '.vitepress/config.mjs')
      const configContent = `import { generateVitePressConfig } from '${join(__dirname, '../vitepress/configGenerator.js').replace(/\\/g, '\\\\')}'

const userConfig = ${JSON.stringify(config, null, 2)}
const docsPath = '${docsPath.replace(/\\/g, '\\\\')}'

export default generateVitePressConfig(userConfig, docsPath, true)
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
  
  // Watch for file/folder additions and deletions (these affect sidebar)
  watcher.on('add', (path) => regenerateConfig('added', path))
  watcher.on('unlink', (path) => regenerateConfig('deleted', path))
  watcher.on('addDir', (path) => regenerateConfig('added directory', path))
  watcher.on('unlinkDir', (path) => regenerateConfig('deleted directory', path))
  
  // Watch for config and markdown changes (frontmatter affects sidebar)
  watcher.on('change', (path) => {
    if (path.endsWith('.nlddoc') || path.endsWith('.md')) {
      regenerateConfig('changed', path)
    }
  })
  
  return watcher
}
