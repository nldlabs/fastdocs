import { resolve, isAbsolute, join } from 'path'
import { existsSync, statSync, readdirSync, rmSync, cpSync } from 'fs'
import { spawn } from 'child_process'
import { loadConfig } from './config.js'
import { createTempProjectForBuild, cleanupTempProject } from '../utils/tempProject.js'
import { info, success, error } from '../utils/logger.js'
import readline from 'readline'

export async function build(inputPath = '.', outputPath = './dist', options = {}) {
  // Resolve absolute paths
  const absoluteInputPath = isAbsolute(inputPath) ? inputPath : resolve(process.cwd(), inputPath)
  const absoluteOutputPath = isAbsolute(outputPath) ? outputPath : resolve(process.cwd(), outputPath)
  
  // Validate input path
  if (!existsSync(absoluteInputPath)) {
    error(`Documentation directory not found: ${absoluteInputPath}`)
    process.exit(1)
  }
  
  if (!statSync(absoluteInputPath).isDirectory()) {
    error(`Path is not a directory: ${absoluteInputPath}`)
    process.exit(1)
  }
  
  // Check for at least one markdown file
  const hasMarkdown = readdirSync(absoluteInputPath, { recursive: true })
    .some(file => file.toString().endsWith('.md'))
  
  if (!hasMarkdown) {
    error('No markdown files found in directory')
    process.exit(1)
  }
  
  // Check if output exists and confirm overwrite
  if (existsSync(absoluteOutputPath) && !options.clean) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    const answer = await new Promise((resolve) => {
      rl.question(`Output directory exists: ${absoluteOutputPath}\nOverwrite? (y/N) `, resolve)
    })
    
    rl.close()
    
    if (answer.toLowerCase() !== 'y') {
      info('Build cancelled')
      process.exit(0)
    }
  }
  
  // Load configuration
  const config = loadConfig(absoluteInputPath)
  
  info(`📚 ${config.title}`)
  info(`Building static site...`)
  
  // Add base URL if provided
  if (options.base) {
    config.base = options.base
  }
  
  // Create temporary VitePress project (for build, copies files)
  const tempDir = createTempProjectForBuild(absoluteInputPath, config)
  
  try {
    // Install dependencies
    await new Promise((resolve, reject) => {
      const npm = spawn('npm', ['install'], {
        cwd: tempDir,
        stdio: 'pipe'
      })
      
      npm.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`Setup failed`))
      })
    })
    
    // Run VitePress build
    
    await new Promise((resolve, reject) => {
      const vitepress = spawn('npx', ['vitepress', 'build'], {
        cwd: tempDir,
        stdio: 'inherit'
      })
      
      vitepress.on('close', (code) => {
        if (code === 0) resolve()
        else reject(new Error(`VitePress build failed with code ${code}`))
      })
    })
    
    // Clean output directory
    if (existsSync(absoluteOutputPath)) {
      rmSync(absoluteOutputPath, { recursive: true, force: true })
    }
    
    // Copy built files to output
    const builtFiles = join(tempDir, '.vitepress/dist')
    cpSync(builtFiles, absoluteOutputPath, { recursive: true })
    
    success(`✨ Build complete!`)
    info(`📁 ${absoluteOutputPath}`)
    
  } catch (err) {
    error(`Build failed: ${err.message}`)
    process.exit(1)
  } finally {
    // Cleanup temp directory
    cleanupTempProject(tempDir)
  }
}
