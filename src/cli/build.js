import { resolve, isAbsolute, join } from 'path'
import { existsSync, statSync, readdirSync, rmSync, cpSync } from 'fs'
import { spawn } from 'child_process'
import { loadConfig } from './config.js'
import { createTempProjectForBuild, cleanupTempProject } from '../utils/tempProject.js'
import { info, success, error } from '../utils/logger.js'
import { checkLinks } from '../utils/linkChecker.js'
import readline from 'readline'
import pc from 'picocolors'

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
  
  console.log()
  console.log(pc.cyan(pc.bold('📙 nlddoc build')))
  console.log()
  console.log(pc.dim('─'.repeat(60)))
  console.log()
  console.log(`${pc.dim('●')} Loading ${pc.cyan(absoluteInputPath)}`)
  console.log(`${pc.dim('●')} Output ${pc.cyan(absoluteOutputPath)}`)
  console.log()
  console.log(pc.dim('─'.repeat(60)))
  console.log()
  
  // Check for broken links before building (unless skipped)
  if (!options.skipLinkChecking) {
    console.log(pc.dim('🔍 Checking links...'))
    console.log()
    const brokenLinks = await checkLinks(absoluteInputPath)
    
    if (brokenLinks.size > 0) {
      console.log(pc.red(pc.bold('✗ Build failed: broken links detected')))
      console.log()
      console.log(pc.dim('─'.repeat(60)))
      console.log()
      
      for (const [file, links] of brokenLinks) {
        console.log(`  ${pc.red('●')} ${pc.bold(file)}`)
        for (const link of links) {
          console.log(`    ${pc.dim('→')} ${pc.red(link.target)} ${pc.dim(`(line ${link.line})`)}`)
        }
        console.log()
      }
      
      console.log(pc.dim('─'.repeat(60)))
      console.log()
      console.log(pc.dim('  Fix the broken links above and try again.'))
      console.log(pc.dim('  You can also run ') + pc.cyan('nlddoc check-links') + pc.dim(' to see the full report.'))
      console.log(pc.dim('  Or use ') + pc.cyan('--skip-link-checking') + pc.dim(' to build anyway (not recommended).'))
      console.log()
      console.log(pc.dim('─'.repeat(60)))
      console.log()
      
      process.exit(1)
    }
    
    console.log(pc.green('✓') + ' All links valid')
    console.log()
    console.log(pc.dim('─'.repeat(60)))
    console.log()
  } else {
    console.log(pc.yellow('⚠ Skipping link checking'))
    console.log()
    console.log(pc.dim('─'.repeat(60)))
    console.log()
  }
  
  // Add base URL if provided
  if (options.base) {
    config.base = options.base
  }
  
  // Create temporary VitePress project (for build, copies files)
  const tempDir = createTempProjectForBuild(absoluteInputPath, config)
  
  try {
    // Install dependencies
    process.stdout.write(pc.dim('⚙  Setting up...'))
    await new Promise((resolve, reject) => {
      const npm = spawn('npm', ['install'], {
        cwd: tempDir,
        stdio: 'pipe'
      })
      
      npm.on('close', (code) => {
        process.stdout.write('\r\x1b[K') // Clear line
        if (code === 0) resolve()
        else reject(new Error(`Setup failed`))
      })
    })
    
    // Run VitePress build
    process.stdout.write(pc.dim('🔨 Building...'))
    
    const vitepressBin = resolve(tempDir, 'node_modules/.bin/vitepress')
    await new Promise((resolve, reject) => {
      const vitepress = spawn(vitepressBin, ['build'], {
        cwd: tempDir,
        stdio: 'pipe' // Suppress VitePress output
      })
      
      // Only show errors
      vitepress.stderr.on('data', (data) => {
        const output = data.toString()
        if (output.includes('error')) {
          process.stdout.write('\r\x1b[K') // Clear line first
          process.stderr.write(data)
        }
      })
      
      vitepress.on('close', (code) => {
        process.stdout.write('\r\x1b[K') // Clear line
        if (code === 0) resolve()
        else reject(new Error(`Build failed with code ${code}`))
      })
    })
    
    // Clean output directory
    if (existsSync(absoluteOutputPath)) {
      rmSync(absoluteOutputPath, { recursive: true, force: true })
    }
    
    // Copy built files to output
    const builtFiles = join(tempDir, '.vitepress/dist')
    cpSync(builtFiles, absoluteOutputPath, { recursive: true })
    
    console.log(pc.green('✓') + pc.bold(' Build complete!'))
    console.log()
    console.log(pc.dim('─'.repeat(60)))
    console.log()
    console.log(`  ${pc.green('●')} ${pc.bold('Output:')} ${pc.cyan(absoluteOutputPath)}`)
    console.log()
    console.log(pc.dim('  Ready to deploy! Upload the output directory to any static host.'))
    console.log()
    console.log(pc.dim('─'.repeat(60)))
    console.log()
    
  } catch (err) {
    error(`Build failed: ${err.message}`)
    process.exit(1)
  } finally {
    // Cleanup temp directory
    cleanupTempProject(tempDir)
  }
}
