import { resolve, isAbsolute } from 'path'
import { existsSync, statSync, readdirSync } from 'fs'
import { spawn } from 'child_process'
import { loadConfig } from './config.js'
import { createTempProject, registerCleanupHandlers } from '../utils/tempProject.js'
import { watchSidebarChanges } from '../utils/sidebarWatcher.js'
import { info, success, error } from '../utils/logger.js'
import { checkLinks } from '../utils/linkChecker.js'
import pc from 'picocolors'

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
  
  console.log()
  console.log(pc.cyan(pc.bold('📙 nlddoc')))
  console.log()
  
  // Create temporary VitePress project
  const tempDir = createTempProject(absoluteDocsPath, config)
  
  // Register cleanup handlers
  registerCleanupHandlers(tempDir)
  
  // Install dependencies in temp directory
  process.stdout.write(pc.dim('⚙  Setting up...'))
  await new Promise((resolve, reject) => {
    const npm = spawn('npm', ['install'], {
      cwd: tempDir,
      stdio: 'pipe'  // Hide npm output
    })
    
    npm.on('close', (code) => {
      process.stdout.write('\r\x1b[K') // Clear line
      if (code === 0) resolve()
      else reject(new Error(`Setup failed`))
    })
  })
  
  process.stdout.write(pc.dim('🚀 Starting server...'))
  
  // Start VitePress dev server using local binary
  const vitepressBin = resolve(tempDir, 'node_modules/.bin/vitepress')
  const vitepressArgs = ['dev']
  
  if (options.port) {
    vitepressArgs.push('--port', options.port)
  }
  
  if (options.host) {
    vitepressArgs.push('--host')
  }
  
  let vitepress = null
  let hasShownTips = false
  let serverUrls = { local: null, network: null }
  
  // Function to check and display broken links
  const runLinkCheck = async () => {
    try {
      const brokenLinks = await checkLinks(absoluteDocsPath)
      if (brokenLinks.size > 0) {
        console.log(pc.yellow(pc.bold('⚠ Warning: broken links detected')))
        console.log()
        console.log(pc.dim('─'.repeat(60)))
        console.log()
        
        for (const [file, links] of brokenLinks) {
          console.log(`  ${pc.yellow('●')} ${pc.bold(file)}`)
          for (const link of links) {
            console.log(`    ${pc.dim('→')} ${pc.yellow(link.target)} ${pc.dim(`(line ${link.line})`)}`)
          }
          console.log()
        }
        
        console.log(pc.dim('─'.repeat(60)))
        console.log()
        console.log(pc.dim('  Fix these links to ensure your documentation works correctly.'))
        console.log(pc.dim('  ') + pc.yellow('Note:') + pc.dim(' Broken links will cause build errors.'))
        console.log(pc.dim('  Run ') + pc.cyan('nlddoc check-links') + pc.dim(' for the full report.'))
        console.log()
        console.log(pc.dim('─'.repeat(60)))
        console.log()
      }
    } catch (err) {
      console.error(pc.red('Error checking links:'), err.message)
    }
  }
  
  const startVitePress = () => {
    vitepress = spawn(vitepressBin, vitepressArgs, {
      cwd: tempDir,
      stdio: ['inherit', 'pipe', 'pipe'] // stdin, stdout, stderr - pipe both to capture
    })
    
    // Handle spawn errors
    vitepress.on('error', (err) => {
      error(`Failed to start server: ${err.message}`)
      process.exit(1)
    })
    
    // Filter stderr to remove dependency warnings
    if (vitepress.stderr) {
      vitepress.stderr.on('data', (data) => {
        const output = data.toString()
        // Only show actual errors, not warnings
        if (output.includes('error') && 
            !output.includes('Failed to resolve dependency') && 
            !output.includes('optimizeDeps.include')) {
          process.stderr.write(data)
        }
      })
    }
    
    if (vitepress.stdout) {
      vitepress.stdout.on('data', (data) => {
        const output = data.toString()
        
        // Extract URLs from VitePress output
        const localMatch = output.match(/Local:\s+(http:\/\/[^\s]+)/)
        const networkMatch = output.match(/Network:\s+(http:\/\/[^\s]+)/)
        
        if (localMatch) serverUrls.local = localMatch[1]
        if (networkMatch) serverUrls.network = networkMatch[1]
        
        // Show our custom ready message when VitePress is ready
        if (!hasShownTips && output.includes('Local:')) {
          hasShownTips = true
          process.stdout.write('\r\x1b[K') // Clear "Starting server..." line
          
          console.log(pc.green('✓') + pc.bold(' Server ready!'))
          console.log()
          console.log(pc.dim('─'.repeat(60)))
          console.log()
          console.log(`  ${pc.green('●')} ${pc.bold('Local:   ')} ${pc.cyan(serverUrls.local || 'http://localhost:5173')}`)
          if (serverUrls.network) {
            console.log(`  ${pc.dim('●')} ${pc.bold('Network: ')} ${pc.cyan(serverUrls.network)}`)
          }
          console.log()
          console.log(`  ${pc.dim('Serving')} ${pc.cyan(absoluteDocsPath)}`)
          console.log(`  ${pc.dim('Press')} ${pc.bold('Ctrl+C')} ${pc.dim('to stop')}`)
          console.log()
          console.log(pc.dim('─'.repeat(60)))        
          console.log()
          
          // Check for broken links after server starts
          runLinkCheck()
        }
        
        // Suppress all VitePress stdout output (we've extracted what we need)
      })
    }
    
    vitepress.on('close', (code) => {
      if (code !== 0 && code !== null && !isRestarting) {
        console.log()
        console.log(pc.yellow('⚠ Server stopped with errors'))
        process.exit(code)
      }
    })
  }
  
  // Start initial server
  startVitePress()
  
  // Watch for sidebar changes and restart VitePress
  let isRestarting = false
  const watcher = watchSidebarChanges(absoluteDocsPath, tempDir, () => {
    isRestarting = true
    if (vitepress) {
      vitepress.kill()
      // Wait a bit for process to die before restarting
      setTimeout(() => {
        isRestarting = false
        startVitePress()
        // Re-run link check after restart
        setTimeout(() => runLinkCheck(), 1000)
      }, 500)
    }
  })
  
  // Cleanup on exit
  process.on('SIGINT', () => {
    console.log()
    console.log(pc.dim('✓ Server stopped'))
    watcher.close()
    if (vitepress) {
      vitepress.kill()
    }
    process.exit(0)
  })
}
