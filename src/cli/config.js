import { readFileSync, existsSync } from 'fs'
import { join, basename } from 'path'

/**
 * Load and merge user configuration with defaults
 * @param {string} docsPath - Absolute path to documentation directory
 * @returns {Object} Merged configuration
 */
export function loadConfig(docsPath) {
  const defaults = {
    title: basename(docsPath),
    description: 'Documentation',
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
      label: 'On this page'
    }
  }

  const configPath = join(docsPath, '.fastdocs')
  
  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, 'utf8')
      const userConfig = JSON.parse(content)
      
      // Deep merge with defaults
      return {
        ...defaults,
        ...userConfig,
        sidebar: {
          ...defaults.sidebar,
          ...(userConfig.sidebar || {})
        },
        outline: {
          ...defaults.outline,
          ...(userConfig.outline || {})
        }
      }
    } catch (err) {
      console.warn(`⚠ Warning: Could not parse .fastdocs file: ${err.message}`)
      console.warn('  Using default configuration')
      return defaults
    }
  }

  return defaults
}
