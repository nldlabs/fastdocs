import { resolve, isAbsolute, join } from 'path'
import { existsSync, writeFileSync } from 'fs'
import { error } from '../utils/logger.js'
import pc from 'picocolors'
import readline from 'readline'

const DEFAULT_CONFIG = {
  title: "My Documentation",
  description: "Documentation for my project",
  logo: {
    type: "lucide",
    icon: "book-open",
    color: "#62d144"
  },
  favicon: {
    type: "lucide",
    icon: "book-open",
    color: "#62d144"
  },
  search: true,
  sidebar: {
    collapseFolders: false
  },
  outline: {
    enabled: true,
    depth: [2, 3],
    label: "On this page"
  }
}

export async function init(targetPath = '.', options = {}) {
  // Resolve absolute path
  const absolutePath = isAbsolute(targetPath) ? targetPath : resolve(process.cwd(), targetPath)
  const configPath = join(absolutePath, '.fastdocs')
  
  // Check if config already exists
  if (existsSync(configPath) && !options.force) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    
    const answer = await new Promise((resolve) => {
      rl.question(pc.yellow('⚠ ') + `.fastdocs already exists in ${absolutePath}\nOverwrite? (y/N) `, resolve)
    })
    
    rl.close()
    
    if (answer.toLowerCase() !== 'y') {
      console.log()
      console.log(pc.dim('Cancelled'))
      process.exit(0)
    }
  }
  
  console.log()
  console.log(pc.cyan(pc.bold('📖  Fast Docs init')))
  console.log()
  console.log(pc.dim('─'.repeat(60)))
  console.log()
  console.log(pc.dim('Creating configuration file with default settings...'))
  console.log()
  
  try {
    // Write config file with nice formatting
    const configContent = JSON.stringify(DEFAULT_CONFIG, null, 2)
    writeFileSync(configPath, configContent, 'utf8')
    
    console.log(pc.green('✓') + pc.bold(' Configuration created!'))
    console.log()
    console.log(pc.dim('─'.repeat(60)))
    console.log()
    console.log(`  ${pc.green('●')} ${pc.bold('File:')} ${pc.cyan(configPath)}`)
    console.log()
    console.log(pc.dim('  Edit .fastdocs to customize:'))
    console.log(pc.dim('  • Site title and description'))
    console.log(pc.dim('  • Logo and favicon (file or Lucide icon)'))
    console.log(pc.dim('  • Search and outline settings'))
    console.log()
    console.log(pc.dim('─'.repeat(60)))
    console.log()
    console.log(pc.dim('  Next steps:'))
    console.log(`  ${pc.cyan('$')} ${pc.bold('fastdocs serve')} ${pc.dim('[path]')} ${pc.dim('# Preview your docs')}`)
    console.log(`  ${pc.cyan('$')} ${pc.bold('fastdocs build')} ${pc.dim('[path] [output]')} ${pc.dim('# Build static site')}`)
    console.log()
    console.log(pc.dim('─'.repeat(60)))
    console.log()
  } catch (err) {
    error(`Failed to create configuration: ${err.message}`)
    process.exit(1)
  }
}
