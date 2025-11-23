import { mkdirSync, writeFileSync, rmSync, cpSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { randomBytes } from 'crypto'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Create a temporary VitePress project for dev server (uses srcDir)
 * @param {string} docsPath - Absolute path to user's documentation
 * @param {Object} config - User configuration
 * @returns {string} Path to temporary project directory
 */
export function createTempProject(docsPath, config) {
  const hash = randomBytes(8).toString('hex')
  const tempDir = join(tmpdir(), `nlddoc-${hash}`)
  
  // Create temp directory structure
  mkdirSync(join(tempDir, '.vitepress'), { recursive: true })
  
  // Copy theme files
  const themeSrc = join(__dirname, '../vitepress/theme')
  const themeDst = join(tempDir, '.vitepress/theme')
  cpSync(themeSrc, themeDst, { recursive: true })
  
  // Generate and write VitePress config with srcDir for hot reload
  const configContent = `
import { generateVitePressConfig } from '${join(__dirname, '../vitepress/configGenerator.js')}'

const userConfig = ${JSON.stringify(config, null, 2)}
const docsPath = '${docsPath.replace(/\\/g, '\\\\')}'

export default generateVitePressConfig(userConfig, docsPath, true)
`
  
  writeFileSync(join(tempDir, '.vitepress/config.mjs'), configContent)
  
  // Create minimal package.json for VitePress
  const packageJson = {
    name: 'nlddoc-temp',
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
      'lucide-vue-next': '^0.468.0'
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
  const tempDir = join(tmpdir(), `nlddoc-${hash}`)
  
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
    name: 'nlddoc-temp',
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
      'lucide-vue-next': '^0.468.0'
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
