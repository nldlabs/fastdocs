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
    logo: null,
    favicon: null,
    search: true,
    outline: {
      enabled: true,
      depth: [2, 3],
      label: 'On this page'
    }
  }

  const configPath = join(docsPath, '.nlddoc')
  
  if (existsSync(configPath)) {
    try {
      const content = readFileSync(configPath, 'utf8')
      const userConfig = JSON.parse(content)
      
      // Deep merge with defaults
      return {
        ...defaults,
        ...userConfig,
        outline: {
          ...defaults.outline,
          ...(userConfig.outline || {})
        }
      }
    } catch (err) {
      console.warn(`⚠ Warning: Could not parse .nlddoc file: ${err.message}`)
      console.warn('  Using default configuration')
      return defaults
    }
  }

  return defaults
}
