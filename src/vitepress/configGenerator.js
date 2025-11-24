import { generateSidebar } from './sidebarGenerator.js'

/**
 * Generate head configuration for favicon and meta tags
 * @param {Object} userConfig - User configuration
 * @param {string} baseUrl - Base URL for the site
 * @returns {Array} Head configuration array
 */
function generateHeadConfig(userConfig, baseUrl) {
  const head = []
  
  if (userConfig.favicon) {
    let faviconPath = userConfig.favicon
    
    // Handle different favicon formats
    if (typeof faviconPath === 'string') {
      // Check if it's a Lucide icon
      if (faviconPath.startsWith('lucide:')) {
        // For Lucide icons, we'll use a data URI with inline SVG
        const iconName = faviconPath.replace('lucide:', '')
        const svgDataUri = generateLucideFaviconDataUri(iconName)
        head.push(['link', { rel: 'icon', type: 'image/svg+xml', href: svgDataUri }])
      } else {
        // File-based favicon
        // Ensure path works with base URL
        if (!faviconPath.startsWith('http') && !faviconPath.startsWith('/')) {
          faviconPath = baseUrl + faviconPath.replace(/^\.\//, '')
        } else if (faviconPath.startsWith('/') && baseUrl !== '/') {
          faviconPath = baseUrl.replace(/\/$/, '') + faviconPath
        }
        
        // Determine favicon type from extension
        const ext = faviconPath.split('.').pop()
        const type = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : 'image/x-icon'
        
        head.push(['link', { rel: 'icon', type, href: faviconPath }])
      }
    } else if (typeof faviconPath === 'object' && faviconPath.type === 'lucide') {
      // Object format for Lucide icon with optional color
      const svgDataUri = generateLucideFaviconDataUri(faviconPath.icon, faviconPath.color)
      head.push(['link', { rel: 'icon', type: 'image/svg+xml', href: svgDataUri }])
    } else if (typeof faviconPath === 'object' && faviconPath.path) {
      // Object format for file
      let path = faviconPath.path
      if (!path.startsWith('http') && !path.startsWith('/')) {
        path = baseUrl + path.replace(/^\.\//, '')
      } else if (path.startsWith('/') && baseUrl !== '/') {
        path = baseUrl.replace(/\/$/, '') + path
      }
      
      const ext = path.split('.').pop()
      const type = ext === 'svg' ? 'image/svg+xml' : ext === 'png' ? 'image/png' : 'image/x-icon'
      head.push(['link', { rel: 'icon', type, href: path }])
    }
  }
  
  return head
}

/**
 * Generate a simple favicon data URI for Lucide icons
 * @param {string} iconName - Name of the Lucide icon
 * @param {string} color - Optional hex color
 * @returns {string} Data URI for the favicon
 */
function generateLucideFaviconDataUri(iconName, color = '#3b82f6') {
  // Map common icon names to simple SVG paths
  const iconPaths = {
    'book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'book': '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
    'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>',
    'bookmark': '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
    'code': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    'terminal': '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    'rocket': '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    'chef-hat': '<path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/>',
    'code-2': '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
    'snowflake': '<line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>'
  }
  
  const path = iconPaths[iconName] || iconPaths['book-open'] // fallback to book-open
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/**
 * Generate VitePress configuration from user config and docs path
 * @param {Object} userConfig - User configuration from .fastdocs file
 * @param {string} docsPath - Absolute path to documentation directory
 * @param {boolean} useSrcDir - Whether to use srcDir (true for serve, false for build)
 * @returns {Object} VitePress configuration object
 */
export function generateVitePressConfig(userConfig, docsPath, useSrcDir = true) {
  const baseUrl = userConfig.base || '/'
  
  const config = {
    title: userConfig.title,
    description: userConfig.description,
    base: baseUrl,
    head: generateHeadConfig(userConfig, baseUrl),
    markdown: {
      config: (md) => {
        // Custom Mermaid renderer that uses our wrapper component
        const fence = md.renderer.rules.fence.bind(md.renderer.rules)
        md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
          const token = tokens[idx]
          if (token.info.trim() === 'mermaid') {
            const code = encodeURIComponent(token.content)
            const id = `mermaid-${idx}`
            return `<MermaidWrapper :code="'${code}'" id="${id}" />`
          }
          return fence(tokens, idx, options, env, slf)
        }
      }
    },
    themeConfig: {
      // Don't pass logo to VitePress - we handle it in our custom Logo component
      // logo: userConfig.logo,
      // Pass logo config for our custom component
      fastdocsLogo: userConfig.logo,
      nav: [
        { text: 'Docs', link: '/' }
      ],
      sidebar: generateSidebar(docsPath, '', userConfig.sidebar?.collapseFolders ?? false),
      outline: userConfig.outline.enabled ? {
        level: userConfig.outline.depth,
        label: userConfig.outline.label
      } : false,
      search: userConfig.search ? {
        provider: 'local'
      } : undefined
    },
    vite: {
      server: {
        watch: {
          // Watch the actual docs directory when using srcDir
          ignored: ['**/node_modules/**', '**/.vitepress/**', '**/dist/**'],
          usePolling: false
        },
        fs: {
          // Allow serving files from the docs directory
          allow: [docsPath]
        }
      },
      optimizeDeps: {
        exclude: ['vitepress']
      },
      vue: {
        template: {
          compilerOptions: {
            // Show Vue template errors in overlay instead of breaking
            onError: (err) => {
              console.error('Vue template error:', err)
            }
          }
        }
      }
    },
    vue: {
      template: {
        compilerOptions: {
          // More permissive - warn instead of error
          onWarn: (warning) => {
            console.warn('Vue warning:', warning)
          }
        }
      }
    }
  }
  
  // Only use srcDir for serve (dev server with hot reload)
  // For build, files are copied to temp dir to fix Vue module resolution
  if (useSrcDir) {
    config.srcDir = docsPath
  }
  
  return config
}
