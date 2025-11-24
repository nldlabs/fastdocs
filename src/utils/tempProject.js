import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync, readdirSync, statSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { randomBytes } from 'crypto'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Generate missing index.md files for directories that don't have them
 * @param {string} dir - Directory to scan
 * @param {string} basePath - Base path for pretty folder names (for root index)
 * @param {boolean} isRoot - Whether this is the root directory
 */
function generateMissingIndexFiles(dir, basePath = '', isRoot = true) {
  // Skip if directory doesn't exist
  if (!existsSync(dir)) return
  
  const files = readdirSync(dir)
  
  // Check if this directory has an index.md
  const hasIndex = files.includes('index.md')
  
  if (!hasIndex) {
    // Generate a simple index.md
    const folderName = basePath ? basePath.split('/').pop() : 'Documentation'
    const prettyName = folderName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    // Use FullContents for root, SubPages for subdirectories
    const component = isRoot ? '<FullContents />' : '<SubPages />'
    const indexContent = `# ${prettyName}

${component}
`
    
    writeFileSync(join(dir, 'index.md'), indexContent)
  }
  
  // Recursively process subdirectories
  for (const file of files) {
    const fullPath = join(dir, file)
    
    // Skip if not a directory
    try {
      const stat = statSync(fullPath)
      if (!stat.isDirectory()) continue
    } catch (err) {
      continue
    }
    
    // Skip excluded directories
    if (['node_modules', '.git', '.vitepress', 'dist', '.cache'].includes(file)) continue
    
    const childBasePath = basePath ? `${basePath}/${file}` : file
    generateMissingIndexFiles(fullPath, childBasePath, false)
  }
}

/**
 * Create a temporary VitePress project for dev server (copies files and generates missing index.md)
 * @param {string} docsPath - Absolute path to user's documentation
 * @param {Object} config - User configuration
 * @returns {string} Path to temporary project directory
 */
export function createTempProject(docsPath, config) {
  const hash = randomBytes(8).toString('hex')
  const tempDir = join(tmpdir(), `fastdocs-${hash}`)
  
  // Create temp directory structure
  mkdirSync(tempDir, { recursive: true })
  mkdirSync(join(tempDir, '.vitepress'), { recursive: true })
  
  // Copy markdown files to temp directory
  cpSync(docsPath, tempDir, { 
    recursive: true,
    filter: (src) => {
      // Don't copy node_modules, .git, or other build artifacts
      const pathParts = src.split('/')
      return !pathParts.some(part => ['node_modules', '.git', '.vitepress', 'dist', '.cache'].includes(part))
    }
  })
  
  // Generate missing index.md files
  generateMissingIndexFiles(tempDir)
  
  // Copy theme files
  const themeSrc = join(__dirname, '../vitepress/theme')
  const themeDst = join(tempDir, '.vitepress/theme')
  cpSync(themeSrc, themeDst, { recursive: true })
  
  // Generate and write VitePress config (files are in tempDir, no srcDir)
  const configContent = `
import { generateVitePressConfig } from '${join(__dirname, '../vitepress/configGenerator.js')}'

const userConfig = ${JSON.stringify(config, null, 2)}
const docsPath = '${tempDir.replace(/\\/g, '\\\\')}'

export default generateVitePressConfig(userConfig, docsPath, false)
`
  
  writeFileSync(join(tempDir, '.vitepress/config.mjs'), configContent)
  
  // Create minimal package.json for VitePress
  const packageJson = {
    name: 'fastdocs-temp',
    type: 'module',
    private: true,
    dependencies: {
      vitepress: '^1.6.4',
      'gray-matter': '^4.0.3',
      chokidar: '^4.0.3',
      vue: '^3.5.13',
      '@vue/devtools-api': '^7.6.4',
      '@vueuse/core': '^11.3.0',
      '@vueuse/integrations': '^11.3.0',
      'mark.js': '^8.11.1',
      'minisearch': '^7.1.0',
      'lucide-vue-next': '^0.468.0',
      'mermaid': '^11.4.0'
    }
  }
  
  writeFileSync(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2))
  
  return tempDir
}

/**
 * Create a temporary VitePress project for build (copies files, no srcDir)
 * @param {string} docsPath - Absolute path to user's documentation
 * @param {Object} config - User configuration
 * @returns {string} Path to temporary project directory
 */
export function createTempProjectForBuild(docsPath, config) {
  const hash = randomBytes(8).toString('hex')
  const tempDir = join(tmpdir(), `fastdocs-${hash}`)
  
  // Create temp directory structure
  mkdirSync(tempDir, { recursive: true })
  mkdirSync(join(tempDir, '.vitepress'), { recursive: true })
  
  // Copy markdown files to temp directory (fixes Vue module resolution for build)
  cpSync(docsPath, tempDir, { 
    recursive: true,
    filter: (src) => {
      // Don't copy node_modules, .git, or other build artifacts
      // Check if any part of the path contains these directories
      const pathParts = src.split('/')
      return !pathParts.some(part => ['node_modules', '.git', '.vitepress', 'dist', '.cache'].includes(part))
    }
  })
  
  // Generate missing index.md files
  generateMissingIndexFiles(tempDir)
  
  // Copy theme files
  const themeSrc = join(__dirname, '../vitepress/theme')
  const themeDst = join(tempDir, '.vitepress/theme')
  cpSync(themeSrc, themeDst, { recursive: true })
  
  // Generate and write VitePress config (files are in tempDir, no srcDir)
  const configContent = `
import { generateVitePressConfig } from '${join(__dirname, '../vitepress/configGenerator.js')}'

const userConfig = ${JSON.stringify(config, null, 2)}
const docsPath = '${tempDir.replace(/\\/g, '\\\\')}'

export default generateVitePressConfig(userConfig, docsPath, false)
`
  
  writeFileSync(join(tempDir, '.vitepress/config.mjs'), configContent)
  
  // Create minimal package.json for VitePress
  const packageJson = {
    name: 'fastdocs-temp',
    type: 'module',
    private: true,
    dependencies: {
      vitepress: '^1.6.4',
      'gray-matter': '^4.0.3',
      chokidar: '^4.0.3',
      vue: '^3.5.13',
      '@vue/devtools-api': '^7.6.4',
      '@vueuse/core': '^11.3.0',
      '@vueuse/integrations': '^11.3.0',
      'mark.js': '^8.11.1',
      'minisearch': '^7.1.0',
      'lucide-vue-next': '^0.468.0',
      'mermaid': '^11.4.0'
    }
  }
  
  writeFileSync(join(tempDir, 'package.json'), JSON.stringify(packageJson, null, 2))
  
  return tempDir
}

/**
 * Clean up temporary project directory
 * @param {string} tempDir - Path to temporary directory
 */
export function cleanupTempProject(tempDir) {
  try {
    rmSync(tempDir, { recursive: true, force: true })
  } catch (err) {
    console.warn(`⚠ Warning: Could not clean up temp directory: ${err.message}`)
  }
}

/**
 * Register cleanup handlers for process exit
 * @param {string} tempDir - Path to temporary directory
 */
export function registerCleanupHandlers(tempDir) {
  const cleanup = () => {
    cleanupTempProject(tempDir)
  }

  process.on('exit', cleanup)
  process.on('SIGINT', () => {
    console.log('\n\nShutting down...')
    cleanup()
    process.exit(0)
  })
  process.on('SIGTERM', () => {
    cleanup()
    process.exit(0)
  })
  process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err)
    cleanup()
    process.exit(1)
  })
}
