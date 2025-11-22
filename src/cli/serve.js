import { resolve, isAbsolute } from 'path'
import { existsSync, statSync, readdirSync } from 'fs'
import { spawn } from 'child_process'
import { loadConfig } from './config.js'
import { createTempProject, registerCleanupHandlers } from '../utils/tempProject.js'
import { info, success, error } from '../utils/logger.js'

export async function serve(docsPath = '.', options = {}) {
  // Resolve absolute path
  const absoluteDocsPath = isAbsolute(docsPath) ? docsPath : resolve(process.cwd(), docsPath)
  
  // Validate path
  if (!existsSync(absoluteDocsPath)) {
    error(`Documentation directory not found: ${absoluteDocsPath}`)
    process.exit(1)
  }
  
  if (!statSync(absoluteDocsPath).isDirectory()) {
    error(`Path is not a directory: ${absoluteDocsPath}`)
    process.exit(1)
  }
  
  // Check for at least one markdown file
  const hasMarkdown = readdirSync(absoluteDocsPath, { recursive: true })
    .some(file => file.toString().endsWith('.md'))
  
  if (!hasMarkdown) {
    error('No markdown files found in directory')
    process.exit(1)
  }
  
  // Load configuration
  const config = loadConfig(absoluteDocsPath)
  
  info(`📚 ${config.title}`)
  info(`Starting dev server...`)
  
  // Create temporary VitePress project
  const tempDir = createTempProject(absoluteDocsPath, config)
  
  // Register cleanup handlers
  registerCleanupHandlers(tempDir)
  
  // Install dependencies in temp directory
  await new Promise((resolve, reject) => {
    const npm = spawn('npm', ['install'], {
      cwd: tempDir,
      stdio: 'pipe'  // Hide npm output
    })
    
    npm.on('close', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Setup failed`))
    })
  })
  
  // Start VitePress dev server
  
  const vitepressArgs = ['vitepress', 'dev']
  
  if (options.port) {
    vitepressArgs.push('--port', options.port)
  }
  
  if (options.host) {
    vitepressArgs.push('--host')
  }
  
  const vitepress = spawn('npx', vitepressArgs, {
    cwd: tempDir,
    stdio: 'inherit'
  })
  
  vitepress.on('close', (code) => {
    info('Server stopped')
    process.exit(code)
  })
}
